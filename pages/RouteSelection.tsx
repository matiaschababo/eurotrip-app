
import React from 'react';
import { useTrip } from '../context/TripContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Wallet, MapPin, Sparkles, ArrowRight } from 'lucide-react';

const RouteSelection = () => {
  const { availableRoutes, setItinerary } = useTrip();
  const navigate = useNavigate();

  if (!availableRoutes || availableRoutes.length === 0) {
    return <Navigate to="/wizard" replace />;
  }

  const handleSelectRoute = (routeId: string) => {
    const selected = availableRoutes.find(r => r.id === routeId);
    if (selected) {
      setItinerary(selected);
      navigate('/itinerary');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans flex flex-col items-center">
      <div className="max-w-7xl w-full">
        
        <header className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Elige tu Ruta Base</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hemos diseñado 3 estrategias diferentes. Selecciona la que más te guste para comenzar a personalizarla al detalle en la siguiente fase.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {availableRoutes.map((route, idx) => (
            <div 
              key={route.id} 
              className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              
              {/* Header Card */}
              <div className={`p-8 ${idx === 0 ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' : 'bg-white text-slate-900 border-b border-slate-100'}`}>
                 <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${idx === 0 ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}`}>
                       {String.fromCharCode(65 + idx)}
                    </div>
                    {idx === 0 && <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1"><Sparkles size={12}/> Recomendada</span>}
                 </div>
                 
                 <h3 className="text-2xl font-black leading-tight mb-2">{route.tripTitle}</h3>
                 <p className={`text-sm font-medium ${idx === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{route.comparisonLabel}</p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 border-b border-slate-100 divide-x divide-slate-100">
                 <div className="p-4 text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-center gap-1"><Wallet size={12} /> Presupuesto</div>
                    <div className="text-lg font-black text-emerald-600">{route.totalEstimatedCostUSD}</div>
                 </div>
                 <div className="p-4 text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center justify-center gap-1"><Clock size={12} /> Ritmo</div>
                    <div className="text-lg font-black text-slate-800">{route.stops.length} Paradas</div>
                 </div>
              </div>

              {/* Route List */}
              <div className="p-6 flex-1 bg-slate-50/50">
                 <div className="space-y-4 relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 -z-10"></div>
                    {route.stops.map((stop, sIdx) => (
                       <div key={sIdx} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 shadow-sm">
                             {sIdx + 1}
                          </div>
                          <div className="flex-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                             <div className="font-bold text-slate-800 text-sm">{stop.city}</div>
                             <div className="text-xs text-slate-500">{stop.nights > 0 ? `${stop.nights} noches` : 'Tránsito / Escala'}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Action */}
              <div className="p-6 bg-white border-t border-slate-100">
                 <button 
                   onClick={() => handleSelectRoute(route.id)}
                   className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      idx === 0 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                   }`}
                 >
                    Elegir Opción {String.fromCharCode(65 + idx)} <ArrowRight size={20} />
                 </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RouteSelection;
