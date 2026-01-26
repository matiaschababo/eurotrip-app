
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Map, Calendar, Shield, Upload, FileJson, Loader2, Image as ImageIcon } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { TripSession } from '../types';
import { reconstructSessionFromDocument } from '../services/geminiService';

const Home = () => {
  const { loadSession } = useTrip();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    
    // Check file type
    if (file.name.endsWith('.json') || file.name.endsWith('.europlanner')) {
       setLoadingMessage('Restaurando sesión...');
       const reader = new FileReader();
       reader.onload = (e) => {
         try {
           const json = JSON.parse(e.target?.result as string) as TripSession;
           if (json.profile && json.preferences) {
             loadSession(json);
             
             // LOGIC UPDATE: Prioritize active itinerary view for resumed sessions
             setTimeout(() => {
               if (json.itinerary) {
                 navigate('/itinerary');
               } else if (json.availableRoutes && json.availableRoutes.length > 0) {
                 navigate('/selection');
               } else {
                 navigate('/wizard');
               }
             }, 800);
           }
         } catch (error) {
           console.error("Invalid file format");
           setIsLoading(false);
         }
       };
       reader.readAsText(file);
    } else if (file.type.startsWith('image/') || file.type === 'application/pdf') {
       setLoadingMessage('Gemini está leyendo tu documento para reconstruir el viaje...');
       
       const reader = new FileReader();
       reader.onloadend = async () => {
          const base64String = reader.result as string;
          // Remove data URL prefix
          const base64Data = base64String.split(',')[1];
          
          const session = await reconstructSessionFromDocument(base64Data, file.type);
          
          if (session && session.itinerary) {
             loadSession(session);
             navigate('/itinerary');
          } else {
             alert("No pudimos reconstruir un itinerario completo desde este archivo. Intenta con otro.");
             setIsLoading(false);
          }
       };
       reader.readAsDataURL(file);
    } else {
       alert("Formato no soportado. Usa JSON, PDF o Imagen.");
       setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <header className="mb-12 animate-fade-in">
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Tu sueño europeo,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">planificado al detalle.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          Desde Rosario hasta el viejo continente. Utiliza nuestra IA para armar la ruta perfecta, gestionar tus reservas y descubrir joyas ocultas.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        
        {/* START NEW CARD */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200 flex flex-col justify-center group animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
               <Map className="text-primary-300" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Nuevo Viaje</h2>
            <p className="text-slate-300 mb-8 max-w-sm leading-relaxed">
              Define tus preferencias, presupuesto y compañeros de viaje. Nuestra IA generará una propuesta inicial en segundos.
            </p>
            <Link to="/wizard" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all hover:-translate-y-1 shadow-lg">
              Comenzar Ahora <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* LOAD PROJECT CARD */}
        <div 
          className={`
            relative rounded-[2.5rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer group animate-fade-in-up
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 bg-white'}
          `}
          style={{animationDelay: '0.1s'}}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { 
            e.preventDefault(); 
            setIsDragging(false);
            if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json,.europlanner,.pdf,image/*" 
            onChange={handleFileUpload} 
          />
          
          {isLoading ? (
            <div className="text-center">
               <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
               <p className="font-bold text-indigo-900">{loadingMessage}</p>
               <p className="text-xs text-slate-400 mt-2">Esto puede tomar unos segundos...</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileJson className="text-indigo-600 w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Cargar Viaje</h2>
              <p className="text-slate-500 text-center max-w-xs mb-6">
                Sube tu archivo <span className="font-mono text-xs bg-slate-100 px-1 rounded text-slate-700">.europlanner</span> o arrastra una imagen/PDF de tu itinerario para reconstruirlo.
              </p>
              <div className="flex gap-3">
                <button className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:underline">
                  <Upload size={16} /> Archivos
                </button>
                <span className="text-slate-300">|</span>
                <button className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:underline">
                  <ImageIcon size={16} /> Fotos
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-slate-800">Rutas Inteligentes</h3>
          <p className="text-slate-500 text-sm">Ordenamos los países para ahorrarte tiempo y dinero en traslados.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-slate-800">Reconstrucción IA</h3>
          <p className="text-slate-500 text-sm">¿Perdiste el archivo? Sube un PDF de tu plan y la IA lo digitalizará de nuevo.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-2 text-slate-800">Modo Caos</h3>
          <p className="text-slate-500 text-sm">¿Lluvia? ¿Cansancio? Replana el día en un click sin estrés.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
