
import React, { useState, useEffect } from 'react';
import { Hotel, Home, Search, ChevronDown, Star, ExternalLink, ThumbsUp, AlertCircle, BedDouble, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { ItineraryStop, AccommodationOption } from '../types';
import { fetchRealTimeAccommodations } from '../services/geminiService';
import { useTrip } from '../context/TripContext';

interface AccommodationWidgetProps {
  stops: ItineraryStop[];
}

const AccommodationWidget: React.FC<AccommodationWidgetProps> = ({ stops }) => {
  const { preferences, profile } = useTrip();
  const [selectedCityIdx, setSelectedCityIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ [key: string]: { hotels: AccommodationOption[], airbnbs: AccommodationOption[], comparison: string } }>({});

  // Safety check: if no stops, don't render
  if (!stops || stops.length === 0) return null;

  // Safety Effect: Reset index if stops change and index is out of bounds
  useEffect(() => {
    if (selectedCityIdx >= stops.length) {
        setSelectedCityIdx(0);
    }
  }, [stops.length, selectedCityIdx]);

  // GUARD: Ensure currentStop exists before rendering
  const currentStop = stops[selectedCityIdx];
  if (!currentStop) return null;

  // Calculate approximate dates for the selected stop
  const getApproxDates = () => {
    if (!preferences.startDate) return "próximas fechas";
    
    const start = new Date(preferences.startDate);
    // Add days from previous stops
    let dayOffset = 0;
    for (let i = 0; i < selectedCityIdx; i++) {
        if (stops[i]) dayOffset += stops[i].nights;
    }
    
    const checkIn = new Date(start);
    checkIn.setDate(checkIn.getDate() + dayOffset);
    
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + currentStop.nights);

    return `${checkIn.toLocaleDateString('es-ES', {month: 'short', day: 'numeric'})} - ${checkOut.toLocaleDateString('es-ES', {month: 'short', day: 'numeric'})}`;
  };

  const handleSearch = async () => {
    if (results[currentStop.city]) return; // Don't re-fetch if exists

    setLoading(true);
    const data = await fetchRealTimeAccommodations(
        currentStop.city,
        currentStop.country,
        getApproxDates(),
        preferences.budgetLevel,
        profile.adults + profile.children
    );

    if (data) {
        setResults(prev => ({ ...prev, [currentStop.city]: data }));
    }
    setLoading(false);
  };

  // Auto-expand when manually opened
  useEffect(() => {
     if (expanded && !results[currentStop.city] && !loading) {
         // Optional: Auto search on open logic if desired
     }
  }, [expanded, currentStop.city]);

  const currentData = results[currentStop.city];

  const calculateTotal = (priceString: string) => {
    const num = parseInt(priceString.replace(/[^0-9]/g, '')) || 0;
    return num * currentStop.nights;
  };

  return (
    <div className="mb-12 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-500">
            
            {/* Header */}
            <div 
                className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row justify-between items-center bg-slate-900 text-white group relative overflow-hidden gap-4"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:scale-105 transition-transform shrink-0">
                        <BedDouble size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg md:text-xl tracking-tight flex items-center gap-2">
                           Dashboard de Alojamiento
                           <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">Tiempo Real</span>
                        </h3>
                        <p className="text-slate-300 text-xs md:text-sm mt-1">
                           Comparativa inteligente Hotel vs Airbnb en tus {stops.length} destinos
                        </p>
                    </div>
                </div>

                <div className={`bg-white/10 p-2 rounded-full transition-transform duration-300 ${expanded ? 'rotate-180' : ''} ml-auto md:ml-0 relative z-10`}>
                    <ChevronDown className="text-white" size={20} />
                </div>
            </div>

            {expanded && (
                <div className="bg-slate-50 border-t border-slate-100">
                    
                    {/* City Tabs - Scrollable */}
                    <div className="flex overflow-x-auto p-2 bg-white border-b border-slate-200 custom-scrollbar">
                        {stops.map((stop, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedCityIdx(idx)}
                                className={`
                                    flex-shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition-all border-b-2 mx-1 whitespace-nowrap
                                    ${selectedCityIdx === idx 
                                        ? 'bg-violet-50 text-violet-700 border-violet-500' 
                                        : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-50'}
                                `}
                            >
                                {stop.city}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 md:p-8">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 mb-1">{currentStop.city}</h4>
                                <p className="text-sm text-slate-500 font-medium">{getApproxDates()} • {currentStop.nights} Noches • {profile.adults + profile.children} Huéspedes</p>
                            </div>
                            {!currentData && !loading && (
                                <button 
                                    onClick={handleSearch}
                                    className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                                >
                                    <Search size={16} /> Buscar Precios Ahora
                                </button>
                            )}
                        </div>

                        {loading && (
                            <div className="py-12 text-center">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-violet-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                    <Loader2 className="w-12 h-12 text-violet-600 animate-spin relative z-10" />
                                </div>
                                <p className="mt-4 font-bold text-violet-900">Escaneando Booking, Airbnb & Expedia...</p>
                                <p className="text-xs text-slate-400">Buscando las mejores ofertas reales para tus fechas.</p>
                            </div>
                        )}

                        {currentData && (
                            <div className="animate-fade-in">
                                {/* AI Comparison Insight */}
                                <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 rounded-xl border border-violet-100 mb-8 flex gap-4 items-start">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-violet-600 shrink-0">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-violet-900 text-sm uppercase tracking-wide mb-1">Análisis de Mercado</h5>
                                        <p className="text-slate-700 text-sm leading-relaxed">{currentData.comparison}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    
                                    {/* Hotels Column */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-200 pb-2">
                                            <Hotel className="text-blue-500" /> Hoteles Recomendados
                                        </div>
                                        <div className="space-y-4">
                                            {currentData.hotels?.map((hotel, i) => (
                                                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-bold text-slate-800 leading-tight">{hotel.name}</h5>
                                                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                            <Star size={10} fill="currentColor"/> {hotel.rating}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{hotel.description}</p>
                                                    
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">{hotel.pros?.[0]}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                                        <div className="font-black text-lg text-slate-800">{hotel.pricePerNight}</div>
                                                        <a href={hotel.bookingLink} target="_blank" rel="noreferrer" className="text-xs font-bold bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1">
                                                            Ver <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Airbnb Column */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-200 pb-2">
                                            <Home className="text-rose-500" /> Airbnb / Apartamentos
                                        </div>
                                        <div className="space-y-4">
                                            {currentData.airbnbs?.map((bnb, i) => (
                                                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-bold text-slate-800 leading-tight">{bnb.name}</h5>
                                                        <div className="flex items-center gap-1 bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                            <Star size={10} fill="currentColor"/> {bnb.rating}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{bnb.description}</p>

                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">{bnb.pros?.[0]}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                                        <div className="font-black text-lg text-slate-800">{bnb.pricePerNight}</div>
                                                        <a href={bnb.bookingLink} target="_blank" rel="noreferrer" className="text-xs font-bold bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-rose-500 transition-colors flex items-center gap-1">
                                                            Ver <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {!currentData && !loading && (
                            <div className="py-8 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 mt-4">
                                <p className="text-slate-400 font-medium">Selecciona una ciudad y haz click en buscar para ver precios reales.</p>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default AccommodationWidget;
