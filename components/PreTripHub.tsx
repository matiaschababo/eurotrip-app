
import React, { useEffect, useState } from 'react';
import { useTrip } from '../context/TripContext';
import { generateTripRequirements } from '../services/geminiService';
import { TripRequirements } from '../types';
import { ShieldCheck, Plug, Languages, Coins, Loader2, CheckCircle2, FileText, AlertTriangle, Zap } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const PreTripHub = () => {
  const { itinerary, profile, tripRequirements, setTripRequirements } = useTrip();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequirements = async () => {
      // Logic: Only fetch if we don't have them in context
      if (itinerary && itinerary.stops.length > 0 && !tripRequirements) {
        setLoading(true);
        const countries = [...new Set(itinerary.stops.map(s => s.country))] as string[];
        const result = await generateTripRequirements(countries, profile.originCity);
        setTripRequirements(result);
        setLoading(false);
      }
    };

    fetchRequirements();
  }, [itinerary, profile, tripRequirements, setTripRequirements]);

  if (!itinerary) {
    return <div className="p-8 text-center"><p>Primero debes generar un itinerario.</p></div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Consultando bases de datos consulares...</h2>
        <p className="text-slate-500">Verificando visas, vacunas y enchufes para tu ruta.</p>
      </div>
    );
  }

  const data = tripRequirements;
  if (!data) return <div className="p-8 text-center flex flex-col items-center gap-4">
     <AlertTriangle className="text-amber-500" size={48} />
     <p>No pudimos cargar los requisitos. Intenta de nuevo.</p>
     <button onClick={() => setTripRequirements(null)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">Reintentar</button>
  </div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide">
             <ShieldCheck size={14} /> Logística & Burocracia
          </div>
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">Centro de Preparación</h1>
                <p className="text-lg text-slate-600">Todo lo que necesitas resolver antes de subir al avión.</p>
             </div>
             <button onClick={() => setTripRequirements(null)} className="text-xs text-indigo-600 font-bold hover:underline">Regenerar Información</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <FileText className="text-blue-500" /> Documentación
              </h2>
              <div className="space-y-4">
                 <div className={`p-4 rounded-xl border ${data.visaInfo.isEtiasRequired ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{data.visaInfo.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{data.visaInfo.details}</p>
                 </div>
                 <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-slate-400 mt-1 shrink-0" />
                    <p className="text-xs text-slate-500">
                       Recuerda que el pasaporte debe tener al menos 6 meses de vigencia desde la fecha de retorno.
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <ShieldCheck className="text-emerald-500" /> Salud & Seguridad
              </h2>
              <div className="space-y-4">
                 <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Vacunas</span>
                    <p className="text-sm text-slate-700 font-medium">{data.healthInfo.vaccinations}</p>
                 </div>
                 <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Seguro Médico</span>
                    <p className="text-sm text-slate-700 font-medium">{data.healthInfo.insuranceAdvice}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">Tips de Seguridad</span>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                       {data.safetyTips.slice(0,3).map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Plug className="text-indigo-500" /> Tech & Adaptadores
              </h2>
              
              <div className="flex items-center justify-center gap-4 py-4 bg-indigo-50/50 rounded-xl mb-4">
                 {data.techSpecs.plugTypes.map(pt => (
                    <div key={pt} className="text-center">
                       <div className="w-12 h-12 bg-white border-2 border-indigo-200 rounded-lg flex items-center justify-center font-black text-indigo-600 text-xl shadow-sm mb-1">
                          {pt}
                       </div>
                       <span className="text-[10px] font-bold text-slate-400">TIPO {pt}</span>
                    </div>
                 ))}
              </div>

              <div className="text-sm text-slate-600 space-y-2">
                 <p><span className="font-bold">Voltaje:</span> {data.techSpecs.voltage}</p>
                 <p className="bg-slate-50 p-2 rounded text-xs italic border border-slate-100">
                    <Zap size={12} className="inline mr-1 text-yellow-500" />
                    {data.techSpecs.adapterAdvice}
                 </p>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Coins className="text-amber-500" /> Dinero
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                 {data.currencyStrategy.currencies.map(c => (
                    <span key={c} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-sm font-bold border border-amber-100">
                       {c}
                    </span>
                 ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                 {data.currencyStrategy.tips}
              </p>
           </div>

           <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Languages className="text-pink-400" /> Kit de Supervivencia de Idiomas
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {data.survivalPhrases.map((kit, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/10">
                       <h3 className="font-bold text-lg mb-3 text-pink-200">{kit.language}</h3>
                       <div className="space-y-3">
                          {kit.phrases.map((phrase, pIdx) => (
                             <div key={pIdx} className="flex justify-between items-start border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                <div>
                                   <div className="font-bold text-sm">{phrase.translated}</div>
                                   <div className="text-xs text-slate-400">{phrase.original}</div>
                                </div>
                                <div className="text-xs italic text-pink-300 bg-black/20 px-2 py-1 rounded">
                                   /{phrase.pronunciation}/
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default PreTripHub;
