
import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { generateTravelerGuide } from '../services/geminiService';
import { Compass, ShieldAlert, Bus, Utensils, Lightbulb, Loader2, CheckCircle2, MapPin, Coins, Lock, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

const TravelerTips = () => {
  const { itinerary, profile, travelerGuide, setTravelerGuide } = useTrip();
  
  // LOGIC FIX: Start at step 5 (Results) if a guide already exists in global context
  const [step, setStep] = useState(travelerGuide ? 5 : 0); 
  
  const [answers, setAnswers] = useState({
    security: '',
    transport: '',
    food: ''
  });

  if (!itinerary) return <Navigate to="/wizard" replace />;

  const handleAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Loading
      const guide = await generateTravelerGuide(itinerary, profile, answers);
      if (guide) {
         setTravelerGuide(guide);
         setStep(5); // Results
      } else {
         setStep(3); // Error/Retry
         alert("Hubo un error generando la guía. Intenta nuevamente.");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else if (step === 1) setStep(0);
  };

  const handleRegenerate = () => {
    setAnswers({ security: '', transport: '', food: '' });
    setStep(1);
  };

  // --- RENDER HELPERS ---

  const renderLanding = () => (
    <div className="min-h-full bg-slate-900 flex flex-col text-white font-sans">
      <header className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
              <div className="text-indigo-400"><Compass size={24} /></div>
              <span className="font-bold text-lg">EuroPlanner AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
              <Link to="/itinerary" className="hover:text-white transition-colors">Mi Ruta</Link>
              <span className="text-white/40">|</span>
              <span className="text-white font-bold">Guía Experta</span>
          </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in-up w-full max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight mt-8 md:mt-0">
              Tu Guía Táctica Personalizada
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Analizaremos tu itinerario por Europa para darte tips exactos de seguridad, transporte local y estafas comunes según tus preferencias.
          </p>
          
          <button 
              onClick={() => setStep(1)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-indigo-900/50 hover:scale-105 flex items-center gap-2"
          >
              Comenzar Evaluación <ArrowRight size={20} />
          </button>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left pb-12">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <ShieldAlert className="text-emerald-400 mb-4" size={32} />
                  <h3 className="font-bold text-lg mb-2">Seguridad Real</h3>
                  <p className="text-white/60 text-sm">Alertas de estafas (scams) comunes hoy en día en cada una de tus ciudades.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <Bus className="text-blue-400 mb-4" size={32} />
                  <h3 className="font-bold text-lg mb-2">Transporte Inteligente</h3>
                  <p className="text-white/60 text-sm">Apps exactas y trucos de tickets (ej: T-Casual en Barcelona) para ahorrar dinero.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <Utensils className="text-amber-400 mb-4" size={32} />
                  <h3 className="font-bold text-lg mb-2">Comer como Local</h3>
                  <p className="text-white/60 text-sm">Diferencias culturales en propinas y dónde encontrar comida auténtica.</p>
              </div>
          </div>
      </main>
    </div>
  );

  const renderQuiz = () => {
    const questions = [
       { 
         id: 'security', 
         title: 'Nivel de Alerta', 
         q: '¿Cuál es tu enfoque respecto a la seguridad?', 
         options: [
            { val: 'Relaxed', label: 'Relajado', desc: 'Me adapto fácil, uso transporte público y camino por todos lados.' },
            { val: 'Cautious', label: 'Precavido', desc: 'Prefiero evitar zonas dudosas y pagar extra por tranquilidad.' }
         ]
       },
       { 
         id: 'transport', 
         title: 'Preferencia de Movilidad', 
         q: '¿Cómo prefieres moverte dentro de las ciudades?', 
         options: [
            { val: 'Speed', label: 'Rapidez y Confort', desc: 'Taxi, Uber o traslados privados. El tiempo es dinero.' },
            { val: 'Cost', label: 'Eficiencia y Precio', desc: 'Metro, Bus y caminar como un local para ahorrar.' }
         ]
       },
       { 
         id: 'food', 
         title: 'Aventura Culinaria', 
         q: '¿Qué buscas al momento de comer?', 
         options: [
            { val: 'Street', label: 'Auténtico / Al paso', desc: 'Mercados, puestos callejeros y bodegones escondidos.' },
            { val: 'Comfort', label: 'Mesa y Confort', desc: 'Restaurantes con reserva, buen servicio y ambiente tranquilo.' }
         ]
       }
    ];

    const currentQ = questions[step - 1];
    const currentAnswer = answers[currentQ.id as keyof typeof answers];

    return (
      <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
         <div className="bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/10 animate-fade-in">
            <div className="flex flex-col gap-4 mb-10">
               <div className="flex gap-6 justify-between items-center">
                  <p className="text-white/80 text-sm font-bold uppercase tracking-wider">Paso {step} de 3</p>
                  <div className="flex items-center gap-2">
                     {[1, 2, 3].map(i => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === step ? 'bg-indigo-500' : i < step ? 'bg-indigo-500/50' : 'bg-white/10'}`}></div>
                     ))}
                  </div>
               </div>
               <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
               </div>
            </div>

            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{currentQ.title}</h2>
               <p className="text-white/70 text-lg font-normal leading-relaxed">{currentQ.q}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
               {currentQ.options.map(opt => (
                  <button
                     key={opt.val}
                     onClick={() => handleAnswer(currentQ.id, opt.val)}
                     className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 group relative ${
                        currentAnswer === opt.val 
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-900/20' 
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className={`block font-bold text-lg ${currentAnswer === opt.val ? 'text-indigo-300' : 'text-white'}`}>{opt.label}</span>
                        {currentAnswer === opt.val && <CheckCircle2 className="text-indigo-400" size={20} />}
                     </div>
                     <span className="text-sm text-white/60 leading-relaxed">{opt.desc}</span>
                  </button>
               ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-white/10">
               <button 
                  onClick={handleBack}
                  className="flex gap-2 px-6 py-3 rounded-full text-white/40 hover:text-white hover:bg-white/5 font-bold text-sm transition-colors"
               >
                  <ArrowLeft size={18} /> Atrás
               </button>
               
               <button 
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-all hover:translate-x-1"
               >
                  {step === 3 ? 'Generar Guía' : 'Siguiente'} <ArrowRight size={18} />
               </button>
            </div>
         </div>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
       <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 size={64} className="text-indigo-400 animate-spin relative z-10" />
       </div>
       <h2 className="text-3xl font-bold text-white mb-3">Consultando Expertos Locales...</h2>
       <p className="text-white/60 text-lg">Compilando tips tácticos para {itinerary.stops.length} destinos.</p>
    </div>
  );

  const renderResults = () => (
    <div className="min-h-full bg-slate-50 font-sans text-slate-900 pb-20">
       <header className="bg-slate-900 text-white pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
             <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                   <div className="inline-flex items-center gap-2 bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide">
                      <Zap size={14} className="text-yellow-300" /> Guía Guardada en el Proyecto
                   </div>
                   <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Tu Guía Táctica</h1>
                   <p className="text-xl text-white/70 max-w-2xl">
                      Estrategia personalizada para un grupo de <span className="text-white font-bold">{profile.adults + profile.children} personas</span>.
                   </p>
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={handleRegenerate} 
                     className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm transition-colors border border-white/20"
                   >
                     Regenerar
                   </button>
                   <Link 
                     to="/itinerary"
                     className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
                   >
                     Ir al Dashboard <ArrowRight size={16} />
                   </Link>
                </div>
             </div>
          </div>
       </header>

       <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 relative z-20">
          {travelerGuide && (
             <div className="animate-fade-in-up space-y-8">
                
                {/* General Tips Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                   <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                      <Lightbulb className="text-amber-500 fill-current" /> Reglas de Oro
                   </h2>
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {travelerGuide.generalTips.map((tip, i) => (
                         <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-3 items-start">
                            <div className="bg-white p-1 rounded-full shadow-sm shrink-0 mt-0.5 text-emerald-500"><CheckCircle2 size={16} /></div>
                            <p className="text-slate-700 text-sm font-medium leading-relaxed">{tip}</p>
                         </div>
                      ))}
                   </div>
                </div>

                {/* City Cards */}
                <div className="grid gap-8">
                   {travelerGuide.cityGuides.map((guide, idx) => (
                      <div key={idx} className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                         <div className="bg-slate-900 text-white p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/20">
                               {idx + 1}
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">{guide.city}</h3>
                         </div>

                         <div className="p-6 md:p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50">
                            
                            {/* Transport */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                               <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <Bus size={20} />
                               </div>
                               <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Transporte</h4>
                               <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                  <span className="font-bold text-slate-900">App:</span> {guide.localTransport.bestApp}
                               </p>
                               <div className="bg-blue-50 text-blue-800 text-xs font-medium p-3 rounded-xl leading-snug">
                                  💡 {guide.localTransport.ticketTip}
                               </div>
                            </div>

                            {/* Money */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                               <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <Coins size={20} />
                               </div>
                               <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Dinero</h4>
                               <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                  <span className="font-bold text-slate-900">Propina:</span> {guide.moneyTactics.tipping}
                               </p>
                               <p className="text-xs text-slate-500 leading-snug italic border-t border-slate-100 pt-2">
                                  "{guide.moneyTactics.cashOrCard}"
                                </p>
                            </div>

                            {/* Safety */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                               <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <Lock size={20} />
                               </div>
                               <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Scam Alerts</h4>
                               <ul className="space-y-2">
                                  {guide.safetyAlerts.map((alert, ai) => (
                                     <li key={ai} className="text-xs text-slate-600 flex items-start gap-2 leading-snug">
                                        <span className="text-rose-500 mt-0.5 shrink-0">•</span> {alert}
                                     </li>
                                  ))}
                               </ul>
                            </div>

                            {/* Hidden Gems */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                               <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <MapPin size={20} />
                               </div>
                               <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Joyas Ocultas</h4>
                               <ul className="space-y-2">
                                  {guide.hiddenGems.map((gem, gi) => (
                                     <li key={gi} className="text-xs text-slate-600 flex items-start gap-2 leading-snug">
                                        <span className="text-violet-500 mt-0.5 shrink-0">★</span> {gem}
                                     </li>
                                  ))}
                               </ul>
                            </div>

                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>
    </div>
  );

  // ROUTING LOGIC
  if (step === 0) return renderLanding();
  if (step === 4) return renderLoading();
  if (step === 5) return renderResults();
  return renderQuiz();
};

export default TravelerTips;
