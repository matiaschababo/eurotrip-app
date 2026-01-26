import React, { useState, useEffect } from 'react';
import { Plane, ChevronDown, Loader2, CalendarCheck, ArrowRight, Trophy, CreditCard, Globe, Gauge, Leaf, TrendingUp, TrendingDown, Repeat, GitMerge, AlertTriangle, MapPin, Info } from 'lucide-react';
import { generateFlightOptions } from '../services/geminiService';
import { FlightOption } from '../types';
import { useTrip } from '../context/TripContext';

interface FlightWidgetProps {
  origin: string;
  destination: string;
  lastStop?: string;
}

type FlightStrategy = 'OPEN_JAW' | 'ROUND_TRIP';

const FlightWidget: React.FC<FlightWidgetProps> = ({ origin, destination, lastStop }) => {
  const { preferences, profile } = useTrip();
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searched, setSearched] = useState(false);
  const [hasReset, setHasReset] = useState(false);
  const [showTaxes, setShowTaxes] = useState(true); // Default to showing taxes
  
  // Strategy State
  const [strategy, setStrategy] = useState<FlightStrategy>('OPEN_JAW');

  // Determine effective last stop based on strategy
  const effectiveLastStop = strategy === 'OPEN_JAW' ? (lastStop || destination) : destination;

  // Auto-reset when the route (destination/lastStop) changes
  useEffect(() => {
    setFlights([]);
    setSearched(false);
    setHasReset(true);
    if (lastStop && lastStop !== destination) {
        setStrategy('OPEN_JAW');
    } else {
        setStrategy('ROUND_TRIP');
    }
  }, [destination, lastStop, origin]);

  useEffect(() => {
    if (loading) setHasReset(false);
  }, [loading]);

  const handleSearch = async () => {
    setLoading(true);
    setExpanded(true);
    
    const options = await generateFlightOptions(
      origin, 
      destination, 
      effectiveLastStop, 
      preferences.budgetLevel, 
      preferences.creditCard,
      profile.flexibleOrigin
    );
    setFlights(options);
    setLoading(false);
    setSearched(true);
  };

  const getBookingLink = (option: FlightOption) => {
    const startDate = preferences.startDate; 
    const endDate = preferences.endDate; 
    
    const iataOrigin = option.outbound.departureIata.trim().toUpperCase();
    const iataDest = option.outbound.arrivalIata.trim().toUpperCase();
    const iataReturnOrigin = option.inbound.departureIata.trim().toUpperCase(); 
    const iataReturnDest = option.inbound.arrivalIata.trim().toUpperCase();
    
    const isMultiCity = (iataDest !== iataReturnOrigin) || (iataOrigin !== iataReturnDest);
    const source = option.source.toLowerCase();

    if (source.includes('turismocity')) {
        if (isMultiCity) {
            return `https://www.turismocity.com.ar/vuelos/resultados?segments=${iataOrigin}-${iataDest}-${startDate},${iataReturnOrigin}-${iataReturnDest}-${endDate}&v=2`;
        }
        return `https://www.turismocity.com.ar/vuelos/buscar/${iataOrigin}-${iataDest}/${startDate}/${endDate}`;
    }
    
    if (source.includes('skyscanner')) {
         const date1 = startDate.slice(2).replace(/-/g, ''); 
         const date2 = endDate.slice(2).replace(/-/g, '');
         if (isMultiCity) {
             return `https://www.skyscanner.com.ar/transporte/vuelos/${iataOrigin}/${iataDest}/${date1}/${iataReturnOrigin}/${iataReturnDest}/${date2}`;
         }
         return `https://www.skyscanner.com.ar/transporte/vuelos/${iataOrigin}/${iataDest}/${date1}/${date2}`;
    }

    if (source.includes('kayak')) {
        if (isMultiCity) {
            return `https://www.kayak.com.ar/flights/${iataOrigin}-${iataDest}/${startDate}/${iataReturnOrigin}-${iataReturnDest}/${endDate}`;
        }
        return `https://www.kayak.com.ar/flights/${iataOrigin}-${iataDest}/${startDate}/${endDate}`;
    }
    
    if (isMultiCity) {
         return `https://www.google.com/travel/flights?q=Flights%20from%20${iataOrigin}%20to%20${iataDest}%20on%20${startDate}%20and%20from%20${iataReturnOrigin}%20to%20${iataReturnDest}%20on%20${endDate}`;
    }
    return `https://www.google.com/travel/flights?q=Flights%20from%20${iataOrigin}%20to%20${iataDest}%20on%20${startDate}%20returning%20${endDate}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Helper to parse and calculate Argentina taxes
  const calculatePriceDisplay = (priceStr: string) => {
    // Extract number from string (e.g. "$1,200" -> 1200)
    const basePrice = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    
    // Tax Calculation (approx 60%: 30% PAIS + 30% Percepción)
    const taxRate = 0.60;
    const taxAmount = Math.round(basePrice * taxRate);
    const totalPrice = basePrice + taxAmount;

    if (showTaxes) {
        return {
            main: `US$ ${totalPrice.toLocaleString()}`,
            sub: `Base: $${basePrice} + $${taxAmount} Imp. (60%)`,
            isEstimate: true
        };
    }
    return {
        main: priceStr, // Return original string
        sub: 'Precio Base (Sin Impuestos)',
        isEstimate: false
    };
  };

  return (
    <div className="relative mb-12 animate-fade-in z-20">
       <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-500">
         {/* Header Section */}
         <div 
           className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row justify-between items-center bg-slate-900 text-white group relative overflow-hidden gap-4"
           onClick={() => setExpanded(!expanded)}
         >
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

           <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
             <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-900/50 group-hover:scale-105 transition-transform shrink-0">
               <Plane size={24} className="text-white" />
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-lg md:text-xl tracking-tight flex items-center gap-2">
                  Logística Aérea 
                  {hasReset && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">Actualizado</span>}
               </h3>
               
               <div className="flex flex-wrap items-center gap-2 md:gap-3 text-slate-300 mt-1 text-xs md:text-sm">
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                     {profile.flexibleOrigin ? <GitMerge size={10} className="text-sky-300"/> : null} 
                     {profile.flexibleOrigin ? 'ROS / BUE' : origin.substring(0,3).toUpperCase()}
                  </span>
                  <ArrowRight size={12} />
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{destination.substring(0,3).toUpperCase()}</span>
                  
                  {strategy === 'OPEN_JAW' && lastStop && lastStop !== destination ? (
                    <>
                      <span className="text-slate-500">...</span>
                      <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{lastStop.substring(0,3).toUpperCase()}</span>
                      <ArrowRight size={12} />
                      <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{profile.flexibleOrigin ? 'ARG' : origin.substring(0,3).toUpperCase()}</span>
                    </>
                  ) : (
                     <>
                        <span className="text-slate-500 mx-1"><Repeat size={10} /></span>
                        <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{profile.flexibleOrigin ? 'ARG' : origin.substring(0,3).toUpperCase()}</span>
                     </>
                  )}
               </div>
             </div>
           </div>
           
           <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-between md:justify-end">
              {!searched && !loading && (
                <span className="text-[10px] font-bold bg-sky-500/20 text-sky-200 border border-sky-500/30 px-3 py-1 rounded-full animate-pulse">
                  {hasReset ? 'RECALCULAR' : 'PENDIENTE'}
                </span>
              )}
              <div className={`bg-white/10 p-2 rounded-full transition-transform duration-300 ${expanded ? 'rotate-180' : ''} ml-auto md:ml-0`}>
                <ChevronDown className="text-white" size={20} />
              </div>
           </div>
         </div>

         {expanded && (
           <div className="p-6 md:p-8 bg-slate-50/50">
             
             {/* Controls Bar */}
             <div className="flex flex-col md:flex-row gap-4 mb-6">
                 {/* Strategy Selector */}
                 {lastStop && lastStop !== destination && (
                   <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2">
                      <button 
                         onClick={() => setStrategy('OPEN_JAW')}
                         className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all border-2 text-left ${
                            strategy === 'OPEN_JAW' 
                            ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500' 
                            : 'bg-white border-transparent hover:bg-slate-50'
                         }`}
                      >
                         <div className={`p-1.5 rounded-full ${strategy === 'OPEN_JAW' ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                            <GitMerge size={16} />
                         </div>
                         <div>
                            <div className={`font-bold text-xs ${strategy === 'OPEN_JAW' ? 'text-sky-900' : 'text-slate-600'}`}>Multidestino</div>
                         </div>
                      </button>

                      <button 
                         onClick={() => setStrategy('ROUND_TRIP')}
                         className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all border-2 text-left ${
                            strategy === 'ROUND_TRIP' 
                            ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' 
                            : 'bg-white border-transparent hover:bg-slate-50'
                         }`}
                      >
                         <div className={`p-1.5 rounded-full ${strategy === 'ROUND_TRIP' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Repeat size={16} />
                         </div>
                         <div>
                            <div className={`font-bold text-xs ${strategy === 'ROUND_TRIP' ? 'text-amber-900' : 'text-slate-600'}`}>Ida y Vuelta</div>
                         </div>
                      </button>
                   </div>
                 )}

                 {/* Tax Toggle */}
                 <button 
                    onClick={() => setShowTaxes(!showTaxes)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-2xl border-2 transition-all shadow-sm ${showTaxes ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                 >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${showTaxes ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 bg-white'}`}>
                       {showTaxes && <Info size={12} />}
                    </div>
                    <div className="text-left">
                       <div className="text-xs font-bold">Impuestos Argentinos (+60%)</div>
                       <div className="text-[10px] opacity-70">{showTaxes ? 'Incluidos en el precio' : 'Mostrar solo base'}</div>
                    </div>
                 </button>
             </div>

             {!searched && !loading && (
               <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                 <div className="bg-sky-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Globe size={32} className="text-sky-600" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-800 mb-2">
                   {hasReset ? 'Estrategia Actualizada' : 'Encontremos tu vuelo ideal'}
                 </h4>
                 <p className="mb-6 text-slate-500 max-w-md mx-auto text-sm">
                   Comparando precios en <strong>TurismoCity</strong>, <strong>Skyscanner</strong> y <strong>Kayak</strong>.
                   {preferences.creditCard && ` Priorizando beneficios de ${preferences.creditCard}.`}
                   {profile.flexibleOrigin && <br/><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs mt-2 inline-block">Optimizando salidas Rosario vs Buenos Aires</span>}
                 </p>
                 <button 
                   onClick={handleSearch}
                   className="bg-sky-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-1 flex items-center gap-2 mx-auto text-sm md:text-base"
                 >
                   <CalendarCheck size={18} />
                   {hasReset ? 'Recalcular Vuelos' : 'Analizar Opciones'}
                 </button>
               </div>
             )}

             {loading && (
               <div className="flex flex-col items-center py-12">
                 <div className="relative">
                   <div className="absolute inset-0 bg-sky-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                   <Loader2 className="animate-spin text-sky-600 relative z-10" size={40} />
                 </div>
                 <p className="text-slate-800 font-bold text-base mt-6">Escaneando aerolíneas y calculando impuestos...</p>
                 <div className="flex gap-2 mt-2">
                    {['TurismoCity', 'Skyscanner', 'Kayak'].map((s, i) => (
                       <span key={i} className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 animate-pulse" style={{animationDelay: `${i*0.2}s`}}>{s}</span>
                    ))}
                 </div>
               </div>
             )}

             {searched && !loading && (
               <div className="space-y-4">
                 {/* Warning for Round Trip */}
                 {strategy === 'ROUND_TRIP' && lastStop !== destination && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-sm text-amber-900 mb-6">
                       <AlertTriangle className="shrink-0 mt-0.5 text-amber-600" size={18} />
                       <div>
                          <span className="font-bold block mb-1">Costo Oculto: Traslado Final</span>
                          Al elegir "Ida y Vuelta" desde {destination}, deberás pagar un tren/vuelo interno desde {lastStop} hacia {destination} al final del viaje. Considera este costo adicional.
                       </div>
                    </div>
                 )}

                 {flights.map((f, i) => {
                   const pricing = calculatePriceDisplay(f.price);

                   return (
                   <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden animate-fade-in-up" style={{animationDelay: `${i * 0.05}s`}}>
                     
                     {/* Compact Header */}
                     <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-base text-slate-800">{f.airline}</span>
                          {i === 0 && (
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wide border border-amber-200">
                               <Trophy size={10} /> Top 1
                            </span>
                          )}
                          <span className="hidden md:inline-block text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded uppercase">
                             vía {f.source}
                          </span>
                        </div>
                        <div className="text-right">
                           <span className="block text-xl font-black text-emerald-600">{pricing.main}</span>
                           <span className="block text-[9px] text-slate-400 uppercase tracking-wide font-bold">{pricing.sub}</span>
                        </div>
                     </div>

                     {/* Analytics Bar */}
                     <div className="px-5 py-2 bg-white flex items-center gap-4 border-b border-slate-50 text-xs">
                        <div className="flex items-center gap-1.5" title="Quality Score">
                            <Gauge size={14} className="text-slate-400" />
                            <div className="flex gap-0.5">
                                <div className={`h-1.5 w-8 rounded-full ${getScoreColor(f.qualityScore || 5)}`}></div>
                            </div>
                            <span className="font-bold text-slate-700">{f.qualityScore || 7}/10</span>
                        </div>

                        {/* Origin Indicator - Show clearly if ROS or EZE */}
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold border border-slate-200">
                            <MapPin size={12} className={f.outbound.departureIata === 'ROS' ? 'text-indigo-500' : 'text-sky-500'} />
                            Salida: {f.outbound.departureIata}
                        </div>

                        {f.priceAnalysis && (
                            <div className="flex items-center gap-1.5 ml-auto">
                                {f.priceAnalysis === 'Bargain' ? <TrendingDown size={14} className="text-emerald-500" /> : <TrendingUp size={14} className="text-amber-500" />}
                                <span className={`font-bold ${f.priceAnalysis === 'Bargain' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {f.priceAnalysis}
                                </span>
                            </div>
                        )}
                     </div>

                     {/* Segments */}
                     <div className="p-4 grid gap-3 md:grid-cols-2">
                        {/* Outbound */}
                        <div className="bg-sky-50/40 rounded-lg p-3 border border-sky-100 relative">
                           <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                 <span className="text-lg font-bold text-slate-700 leading-none">{f.outbound.departureIata}</span>
                                 <span className="text-[10px] text-slate-400">Salida</span>
                              </div>
                              
                              <div className="flex-1 mx-3 text-center flex flex-col items-center">
                                 <span className="text-[10px] text-slate-400 mb-0.5">{f.outbound.duration}</span>
                                 <div className="w-full h-[1px] bg-sky-200 relative flex items-center justify-center">
                                    <Plane size={10} className="text-sky-400 absolute bg-sky-50 px-0.5" />
                                 </div>
                              </div>

                              <div className="flex flex-col text-right">
                                 <span className="text-lg font-bold text-slate-700 leading-none">{f.outbound.arrivalIata}</span>
                                 <span className="text-[10px] text-slate-400">Llegada</span>
                              </div>
                           </div>
                        </div>

                        {/* Inbound */}
                        <div className="bg-emerald-50/40 rounded-lg p-3 border border-emerald-100 relative">
                           <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                 <span className="text-lg font-bold text-slate-700 leading-none">{f.inbound.departureIata}</span>
                                 <span className="text-[10px] text-slate-400">Regreso</span>
                              </div>
                              
                              <div className="flex-1 mx-3 text-center flex flex-col items-center">
                                 <span className="text-[10px] text-slate-400 mb-0.5">{f.inbound.duration}</span>
                                 <div className="w-full h-[1px] bg-emerald-200 relative flex items-center justify-center">
                                    <Plane size={10} className="text-emerald-400 absolute bg-emerald-50 px-0.5 rotate-180" />
                                 </div>
                              </div>

                              <div className="flex flex-col text-right">
                                 <span className="text-lg font-bold text-slate-700 leading-none">{f.inbound.arrivalIata}</span>
                                 <span className="text-[10px] text-slate-400">Fin</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Action Footer */}
                     <div className="px-5 pb-4 flex flex-col md:flex-row gap-3 items-center">
                        <p className="text-xs text-slate-500 italic flex-1 line-clamp-1">
                           <span className="font-bold text-sky-600 not-italic">IA Tip:</span> "{f.agentTip}"
                        </p>
                        <a 
                           href={getBookingLink(f)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full md:w-auto whitespace-nowrap flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors shadow-md"
                        >
                           Buscar disponibilidad en {f.source} <ArrowRight size={12} />
                        </a>
                     </div>
                   </div>
                 )})}
               </div>
             )}
           </div>
         )}
       </div>
    </div>
  );
};

export default FlightWidget;