
import React, { useEffect, useState } from 'react';
import { X, MapPin, Coffee, Sun, Moon, Loader2, Train, Hotel, Pencil, ArrowRight, DollarSign, Briefcase, Shirt, Plug, Home, Star, ExternalLink, Building, ThumbsUp, ThumbsDown, Heart, Check, AlertCircle, Wand2 } from 'lucide-react';
import { ItineraryStop, TravelerProfile, CityDetails, TravelSeason, TripStyle } from '../types';
import { generateCityDetails, regenerateDailyPlan } from '../services/geminiService';

interface CityDetailModalProps {
  stop: ItineraryStop;
  profile: TravelerProfile;
  budgetLevel: string;
  season: TravelSeason;
  tripStyle: TripStyle;
  onClose: () => void;
  onEditRequest: (prompt: string) => void;
  onUpdateStop?: (updatedStop: ItineraryStop) => void;
}

const CityDetailModal: React.FC<CityDetailModalProps> = ({ stop, profile, budgetLevel, season, tripStyle, onClose, onEditRequest, onUpdateStop }) => {
  const [details, setDetails] = useState<CityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [accommodationType, setAccommodationType] = useState<'HOTEL' | 'AIRBNB'>('HOTEL');
  
  // Personalization State
  const [customInterests, setCustomInterests] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await generateCityDetails(stop.city, stop.country, stop.nights, profile, budgetLevel, season, tripStyle);
      setDetails(data);
      setLoading(false);
    };
    fetchDetails();
  }, [stop, profile, budgetLevel, season, tripStyle]);

  // Calculation Helper
  const calculateTotal = (priceString: string) => {
    const num = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
    return num * stop.nights;
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-indigo-500';
    return 'text-amber-500';
  };

  const handleRegenerateActivities = async () => {
    if (!customInterests.trim()) return;
    setIsRegenerating(true);
    
    try {
        const newDailyPlan = await regenerateDailyPlan(stop.city, stop.country, stop.nights, customInterests, season);
        if (newDailyPlan.length > 0 && onUpdateStop) {
            const updatedStop = { ...stop, dailyPlan: newDailyPlan };
            onUpdateStop(updatedStop);
            // Also update local view if displaying daily plan from props or fetch
            // Note: 'details.dayByDay' is fetched separately from 'stop.dailyPlan' in current architecture.
            // We should update local details state to reflect change visually here too if structures match.
            // Convert DailyActivity[] to DayPlan[] structure for this view
            const mappedDays = newDailyPlan.map((act, idx) => ({
                day: idx + 1, // Approximate mapping since regenerate returns activities not strict days
                morning: act.activity, // Simplified mapping for visualization
                afternoon: act.description,
                evening: ''
            }));
            // Ideally we re-fetch details, but for speed we update UI
            alert("Agenda actualizada! Cierra y abre el modal para ver todos los detalles sincronizados en el itinerario principal.");
        }
    } catch (error) {
        console.error("Failed to regenerate", error);
    }
    
    setIsRegenerating(false);
    setCustomInterests('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-primary-600 p-6 flex justify-between items-start shrink-0">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <MapPin /> {stop.city}
            </h2>
            <p className="opacity-90 text-base md:text-lg">{stop.nights} noches en {stop.country}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <Loader2 size={48} className="animate-spin text-primary-600 mb-4" />
              <p className="text-lg font-medium">Consultando disponibilidad en tiempo real...</p>
              <p className="text-sm opacity-70">Comparando precios de Hoteles vs Airbnb para {season}.</p>
            </div>
          ) : details ? (
            <div className="space-y-8">
              
              {/* ACCOMMODATION COMPARISON SECTION */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                   <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 text-lg">Ranking de Alojamiento</h3>
                      <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Precios Hoy</span>
                   </div>
                   
                   {/* Toggle Switch */}
                   <div className="flex bg-slate-200 p-1 rounded-xl w-full sm:w-auto">
                      <button 
                        onClick={() => setAccommodationType('HOTEL')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          accommodationType === 'HOTEL' 
                          ? 'bg-white text-primary-600 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Hotel size={16} /> Hoteles
                      </button>
                      <button 
                        onClick={() => setAccommodationType('AIRBNB')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          accommodationType === 'AIRBNB' 
                          ? 'bg-white text-rose-500 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Home size={16} /> Airbnb
                      </button>
                   </div>
                </div>

                <div className="p-4 md:p-6">
                   <div className="mb-4 text-slate-600 text-sm italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-700">Zonas recomendadas:</span> {details.bestAreasToStay}
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(accommodationType === 'HOTEL' ? details.accommodations?.hotels : details.accommodations?.airbnbs)?.map((option, idx) => (
                         <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:shadow-xl hover:border-indigo-200 transition-all bg-white flex flex-col h-full relative overflow-hidden group">
                            
                            {/* Match Score Badge */}
                            <div className="absolute top-4 right-4 flex flex-col items-end">
                               <div className={`text-xl font-black ${getMatchColor(option.matchScore || 85)}`}>
                                 {option.matchScore || 85}%
                               </div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase">Match</div>
                            </div>

                            <div className="mb-3 mt-0 mr-12">
                               <h4 className="font-bold text-slate-800 leading-tight text-lg mb-1">{option.name}</h4>
                               <div className="flex items-center gap-2">
                                  <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">
                                     <Star size={10} fill="currentColor" /> {option.rating}
                                  </div>
                                  <p className="text-xs text-slate-500 truncate">
                                     {option.location}
                                  </p>
                               </div>
                            </div>
                            
                            <p className="text-xs text-slate-600 mb-4 line-clamp-2">{option.description}</p>
                            
                            {/* Pros/Cons List */}
                            <div className="mb-4 space-y-2 bg-slate-50 p-3 rounded-lg">
                                <div className="flex items-start gap-2">
                                   <ThumbsUp size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                   <p className="text-xs text-slate-600 leading-tight">{option.pros?.[0] || "Excelente ubicación"}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                   <ThumbsDown size={12} className="text-rose-400 mt-0.5 shrink-0" />
                                   <p className="text-xs text-slate-500 leading-tight">{option.cons?.[0] || "Precio elevado"}</p>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                               <div className="flex justify-between items-end mb-3">
                                  <div>
                                     <div className="text-[10px] text-slate-400 uppercase font-bold">Por Noche</div>
                                     <div className="text-lg font-black text-slate-800">{option.pricePerNight}</div>
                                  </div>
                                  <div className="text-right">
                                     <div className="text-[10px] text-slate-400 uppercase font-bold">Total ({stop.nights}n)</div>
                                     <div className="text-sm font-bold text-emerald-600">~USD {calculateTotal(option.pricePerNight)}</div>
                                  </div>
                               </div>
                               
                               <a 
                                 href={option.bookingLink} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg ${
                                    accommodationType === 'HOTEL' 
                                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200' 
                                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                                 }`}
                               >
                                  {accommodationType === 'HOTEL' ? 'Ver en Booking' : 'Ver en Airbnb'} <ExternalLink size={14} />
                               </a>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Transport & Tips Section */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Intra-city Transport */}
                <div className="bg-white p-5 rounded-xl border-l-4 border-blue-400 shadow-sm relative group">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Train size={18} className="text-blue-500"/> Cómo Moverse (Local)
                    </h3>
                    <button 
                      onClick={() => onEditRequest(`Para moverme dentro de ${stop.city}, prefiero...`)}
                      className="text-slate-400 hover:text-primary-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      title="Refinar sugerencias de transporte local"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pr-6">{details.transportationTips}</p>
                </div>

                 {/* Inter-city Transport */}
                {stop.transportToNext && (
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <ArrowRight size={18} className="text-primary-600"/> 
                        Hacia {stop.transportDetails ? 'el siguiente destino' : '...'}
                      </h3>
                      <button 
                        onClick={() => onEditRequest(`Para el tramo desde ${stop.city} hacia el siguiente destino, prefiero usar...`)}
                        className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline px-2 py-1 rounded"
                      >
                        <Pencil size={14} /> Cambiar
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-700">
                      <span className="font-semibold bg-slate-200 px-2 py-1 rounded text-slate-800">
                        {stop.transportToNext}
                      </span>
                      <span className="text-slate-500">{stop.transportDetails}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* WHAT TO PACK SECTION */}
              {details.packingAdvice && (
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
                   
                   <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4 relative z-10">
                      <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-900/50">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Qué Empacar</h3>
                        <p className="text-slate-400 text-xs font-medium">Optimizado para: <span className="text-indigo-300">{season}</span> • <span className="text-indigo-300">{tripStyle}</span></p>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8 relative z-10">
                      {/* Clothing */}
                      <div>
                         <h4 className="font-bold text-indigo-300 mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
                            <Shirt size={14} /> Indumentaria Clave
                         </h4>
                         <ul className="space-y-3">
                            {details.packingAdvice.clothing.map((item, idx) => (
                               <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 group">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 group-hover:bg-indigo-300 transition-colors"></span>
                                  <span className="group-hover:text-white transition-colors">{item}</span>
                               </li>
                            ))}
                         </ul>
                      </div>

                      {/* Essentials */}
                      <div>
                         <h4 className="font-bold text-emerald-300 mb-3 flex items-center gap-2 text-xs uppercase tracking-widest">
                            <Plug size={14} /> Esenciales y Tech
                         </h4>
                         <ul className="space-y-3">
                            {details.packingAdvice.essentials.map((item, idx) => (
                               <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 group">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 group-hover:bg-emerald-300 transition-colors"></span>
                                  <span className="group-hover:text-white transition-colors">{item}</span>
                               </li>
                            ))}
                         </ul>
                      </div>
                   </div>
                </div>
              )}

              {/* Day by Day with Personalization */}
              <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Itinerario Detallado</h3>
                </div>
                
                {/* Personalization Input */}
                <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col md:flex-row gap-3 items-start md:items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-bold text-indigo-700 uppercase mb-1 block">Personalizar Agenda</label>
                        <input 
                            type="text"
                            value={customInterests}
                            onChange={(e) => setCustomInterests(e.target.value)}
                            placeholder="Ej: 'Quiero visitar estadios de fútbol' o 'Tour de cafeterías'..."
                            className="w-full px-4 py-2 rounded-lg border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button 
                        onClick={handleRegenerateActivities}
                        disabled={isRegenerating || !customInterests.trim()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
                    >
                        {isRegenerating ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                        Regenerar Actividades
                    </button>
                </div>

                <div className="space-y-6">
                  {details.dayByDay.map((day) => (
                    <div key={day.day} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-slate-50 px-5 py-3 font-bold text-slate-700 border-b border-slate-100 flex justify-between items-center">
                        <span>Día {day.day}</span>
                        <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">Agenda Sugerida</span>
                      </div>
                      <div className="p-5 grid md:grid-cols-3 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="pt-2 md:pt-0">
                          <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wide mb-2">
                            <Coffee size={14} /> Mañana
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{day.morning}</p>
                        </div>
                        <div className="pt-4 md:pt-0 md:pl-6">
                          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wide mb-2">
                            <Sun size={14} /> Tarde
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{day.afternoon}</p>
                        </div>
                        <div className="pt-4 md:pt-0 md:pl-6">
                          <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wide mb-2">
                            <Moon size={14} /> Noche
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{day.evening}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center text-red-500">No se pudo cargar la información. Intente nuevamente.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CityDetailModal;
