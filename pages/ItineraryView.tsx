
import React, { useState, useRef } from 'react';
import { useTrip } from '../context/TripContext';
// Added missing icons: Plug, Languages, Star, Check
import { MapPin, Moon, Train, ArrowRight, Info, Sparkles, Volume2, Calendar, ListTodo, Plus, Minus, Trash2, Download, CloudRain, BatteryWarning, Save, Clock, DollarSign, Wallet, CheckCircle2, ShieldCheck, Globe, Plane, FileText, Loader2, Zap, TrendingUp, MousePointerClick, Bus, Coins, Lock, X, ChevronDown, Car, Ship, LogIn, LogOut, Printer, FileDown, Plug, Languages, Star, Check } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import FlightWidget from '../components/FlightWidget';
import CityDetailModal from '../components/CityDetailModal';
import RouteVisualizer from '../components/RouteVisualizer';
import InteractiveMap from '../components/InteractiveMap';
import SmartEditModal from '../components/SmartEditModal';
import SmartTip from '../components/SmartTip';
import BudgetAnalytics from '../components/BudgetAnalytics';
import BookingWallet from '../components/BookingWallet'; 
import AccommodationWidget from '../components/AccommodationWidget';
import { ItineraryStop, TripRequirements } from '../types';
import { playTextAsSpeech, generateTripRequirements } from '../services/geminiService';

const ItineraryView = () => {
  const { itinerary, setItinerary, availableRoutes, profile, preferences, exportSession, travelerGuide, tripRequirements, setTripRequirements } = useTrip();
  const [selectedStop, setSelectedStop] = useState<ItineraryStop | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editModalInitialPrompt, setEditModalInitialPrompt] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const [showRouteMenu, setShowRouteMenu] = useState(false);

  if (!itinerary) {
    return <Navigate to="/wizard" replace />;
  }

  const handlePlaySummary = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await playTextAsSpeech(`Aquí tienes el plan para tu viaje de ${preferences.durationDays} días. ${itinerary.summary}. El costo total estimado es de ${itinerary.totalEstimatedCostUSD} dólares.`);
    setIsPlayingAudio(false);
  };

  const handleOpenSmartEdit = (initialText: string = '') => {
    setEditModalInitialPrompt(initialText);
    setIsEditModalOpen(true);
    setSelectedStop(null); 
  };

  const handleUpdateStop = (stopIndex: number, updatedStop: ItineraryStop) => {
    if (!itinerary) return;
    const newStops = [...itinerary.stops];
    newStops[stopIndex] = updatedStop;
    setItinerary({
      ...itinerary,
      stops: newStops
    });
    if (selectedStop && selectedStop.city === updatedStop.city) {
        setSelectedStop(updatedStop);
    }
  };

  const handleSaveProject = () => {
    const session = exportSession();
    const dataStr = JSON.stringify(session, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `europlanner-${itinerary.tripTitle.replace(/\s+/g, '-').toLowerCase()}.europlanner`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // NATIVE PDF DOWNLOAD LOGIC
  const handleDownloadPDF = async () => {
    setIsPreparingPrint(true);
    try {
      // 1. Ensure all data is ready
      if (!tripRequirements) {
         const countries = Array.from(new Set(itinerary.stops.map(s => s.country))) as string[];
         const data = await generateTripRequirements(countries, profile.originCity);
         setTripRequirements(data);
      }

      // 2. Show the view briefly to ensure content is rendered
      setShowPrintView(true);
      
      // 3. Use html2pdf for a real download
      setTimeout(async () => {
        const element = document.getElementById('master-report-content');
        if (!element) return;

        const opt = {
          margin:       [10, 10, 10, 10],
          filename:     `EuroPlanner-${itinerary.tripTitle.replace(/\s+/g, '_')}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, logging: false },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Generate and download
        // @ts-ignore (Library added via script tag)
        await html2pdf().set(opt).from(element).save();
        
        setIsPreparingPrint(false);
        // Do not auto-close so the user can see it's done or print if they want
      }, 1500);

    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsPreparingPrint(false);
      alert("Hubo un problema al generar el PDF. Verifica tu conexión.");
    }
  };

  const handleSwitchRoute = (routeId: string) => {
    const selected = availableRoutes.find(r => r.id === routeId);
    if (selected) {
      setItinerary(selected);
      setShowRouteMenu(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const getTransportIcon = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes('vuelo') || t.includes('avión')) return <Plane size={18} />;
    if (t.includes('tren') || t.includes('ferro')) return <Train size={18} />;
    if (t.includes('bus') || t.includes('autobús')) return <Bus size={18} />;
    if (t.includes('barco') || t.includes('ferry')) return <Ship size={18} />;
    return <Car size={18} />;
  };

  const hasCoordinates = itinerary.stops.every(s => s.coordinates && typeof s.coordinates.lat === 'number');
  
  const firstStop = itinerary.stops[0]?.city || "Europa";
  const lastStop = itinerary.stops[itinerary.stops.length - 1]?.city || "Europa";
  
  const getRealDate = (dayOffset: number) => {
    const start = new Date(preferences.startDate + 'T12:00:00'); 
    start.setDate(start.getDate() + dayOffset);
    return start.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };
  
  let cumulativeDays = 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-40 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <div className={showPrintView ? 'hidden' : 'block'}>
        <div className="relative h-[450px] lg:h-[500px] overflow-visible bg-slate-900 text-white group z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-50 z-10 overflow-hidden"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=2000&q=80" 
            alt="Europe Travel" 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[20s] opacity-80"
          />
          
          <div className="relative z-20 max-w-7xl mx-auto px-6 pt-10 h-full">
            <div className="absolute top-8 right-6 lg:right-10 z-50">
               {availableRoutes.length > 1 && (
                 <div className="relative">
                    <button 
                      onClick={() => setShowRouteMenu(!showRouteMenu)}
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/20 transition-colors shadow-lg"
                    >
                      <Sparkles size={16} className="text-yellow-300" />
                      Estrategia: {itinerary.comparisonLabel}
                      <ChevronDown size={16} className={`transition-transform ${showRouteMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showRouteMenu && (
                      <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl p-2 border border-slate-100 animate-fade-in origin-top-right">
                         <div className="p-3 border-b border-slate-50 mb-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cambiar Estrategia de Ruta</h4>
                         </div>
                         <div className="space-y-2">
                            {availableRoutes.map((route) => {
                               const isActive = route.id === itinerary.id;
                               return (
                                  <button
                                    key={route.id}
                                    onClick={() => handleSwitchRoute(route.id)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${isActive ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                                  >
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {route.comparisonLabel.charAt(0)}
                                     </div>
                                     <div className="flex-1">
                                        <div className={`text-sm font-bold ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{route.comparisonLabel}</div>
                                        <div className="text-xs text-slate-500">{route.totalEstimatedCostUSD} • {route.stops.length} Destinos</div>
                                     </div>
                                     {isActive && <CheckCircle2 size={16} className="text-indigo-600" />}
                                  </button>
                               )
                            })}
                         </div>
                      </div>
                    )}
                 </div>
               )}
            </div>

            <div className="flex flex-col justify-center h-full pb-20">
              <div className="inline-flex items-center gap-2 self-start bg-indigo-600 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold text-white mb-6 animate-fade-in shadow-lg">
                  <Sparkles size={14} className="text-yellow-300" /> 
                  ITINERARIO OPTIMIZADO
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight mb-4 drop-shadow-2xl animate-fade-in-up max-w-4xl">
                {itinerary.tripTitle}
              </h1>
              
              <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-3xl max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <p className="text-base md:text-lg text-white/95 leading-relaxed font-medium">
                  {itinerary.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <button 
                    onClick={handlePlaySummary}
                    disabled={isPlayingAudio}
                    className="flex items-center gap-2 bg-white text-slate-900 px-5 py-3 md:px-6 md:py-3 rounded-xl font-bold shadow-xl hover:bg-indigo-50 transition-all hover:-translate-y-1 active:scale-95 text-xs md:text-sm"
                  >
                    <Volume2 size={18} className={isPlayingAudio ? "animate-pulse text-indigo-600" : ""} />
                    {isPlayingAudio ? 'Escuchando...' : 'Resumen IA'}
                  </button>
                  <button 
                    onClick={() => handleOpenSmartEdit()}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 md:px-6 md:py-3 rounded-xl font-bold transition-all backdrop-blur-md text-xs md:text-sm"
                  >
                    <Sparkles size={18} className="text-yellow-200" />
                    Personalizar
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isPreparingPrint}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white border border-white/20 px-5 py-3 md:px-6 md:py-3 rounded-xl font-bold transition-all shadow-lg text-xs md:text-sm"
                  >
                    {isPreparingPrint ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
                    Descargar Plan (PDF)
                  </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-16 lg:h-24"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8">
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-fade-in-up delay-300">
                  {hasCoordinates ? (
                    <InteractiveMap stops={itinerary.stops} />
                  ) : (
                    <RouteVisualizer stops={itinerary.stops} originCity={profile.originCity} />
                  )}
                </div>

                <FlightWidget origin={profile.originCity} destination={firstStop} lastStop={lastStop} />
                <AccommodationWidget stops={itinerary.stops} />
              </div>

              <div className="flex items-center gap-4 mb-12 mt-12 animate-fade-in">
                <span className="text-slate-400 font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={16} /> Inicio: {getRealDate(0)}
                </span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <div className="relative space-y-12 pl-4 md:pl-6 pb-12">
                <div className="absolute left-[39px] md:left-[47px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-300 via-indigo-200 to-slate-200 -z-10"></div>

                {itinerary.stops.map((stop, index) => {
                  const isLast = index === itinerary.stops.length - 1;
                  const currentDate = getRealDate(cumulativeDays);
                  const travelStartDayOffset = cumulativeDays + stop.nights;
                  const travelDate = getRealDate(travelStartDayOffset);
                  cumulativeDays += stop.nights;

                  return (
                    <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}>
                      <div className="absolute left-0 top-0 w-[80px] flex flex-col items-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white text-slate-800 rounded-full shadow-lg shadow-indigo-900/10 flex items-center justify-center font-black text-lg md:text-xl border-4 border-slate-50 z-10 relative">
                          {index + 1}
                        </div>
                        <div className="mt-2 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded border border-slate-200 text-center w-full">
                            {currentDate}
                        </div>
                      </div>

                      <div className="ml-20 md:ml-24">
                        <div onClick={() => setSelectedStop(stop)} className="group bg-white rounded-[2rem] p-1 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 border border-slate-100 hover:border-indigo-100 transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 z-0 opacity-50"></div>
                          <div className="relative z-10 p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-3 text-emerald-600 text-xs font-bold uppercase tracking-wide">
                               <div className="bg-emerald-100 p-1 rounded-full"><LogIn size={12} /></div>
                               Llegada: {stop.arrivalTime || "10:00 AM"}
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">{stop.city}</h3>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                              <span className="text-slate-500 font-bold flex items-center gap-1 text-xs uppercase tracking-wide"><MapPin size={12} /> {stop.country}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-slate-500 font-bold flex items-center gap-1 text-xs uppercase tracking-wide"><Moon size={12} /> {stop.nights} noches</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {stop.highlights.map((h, i) => (
                                <span key={i} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700">
                                  {h}
                                </span>
                              ))}
                            </div>

                            {stop.keyMilestones && stop.keyMilestones.length > 0 && (
                              <div className="mb-6 bg-gradient-to-r from-violet-50/50 to-indigo-50/50 rounded-xl p-5 border border-violet-100">
                                  <h4 className="text-[10px] font-black text-violet-700 uppercase tracking-widest mb-3 flex items-center gap-2"><ListTodo size={14} /> Misiones Clave</h4>
                                  <div className="space-y-2.5">
                                    {stop.keyMilestones.map((milestone, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                                          <div className="mt-0.5 text-violet-600 shrink-0"><CheckCircle2 size={14} /></div>
                                          <span className="leading-snug">{milestone}</span>
                                        </div>
                                    ))}
                                  </div>
                              </div>
                            )}

                            <div className="flex items-center justify-end text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform gap-2 mt-4">
                                Ver hoteles y táctica <ArrowRight size={16} />
                            </div>
                          </div>
                        </div>

                        {!isLast && (
                          <div className="py-8 relative z-10">
                             <div className="bg-white border-l-4 border-indigo-500 rounded-r-xl shadow-md p-4 flex items-center justify-between gap-6 transform transition-transform hover:scale-[1.01]">
                                <div className="flex flex-col min-w-[80px] border-r border-slate-100 pr-4 items-center">
                                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Viaje</div>
                                    <div className="bg-indigo-50 text-indigo-700 font-black text-sm px-2 py-1 rounded-lg text-center">{travelDate}</div>
                                </div>
                                <div className="flex flex-col min-w-[80px]">
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Salida</div>
                                   <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                                      <Clock size={16} className="text-indigo-500" /> {stop.departureTime || "09:00 AM"}
                                   </div>
                                </div>
                                <div className="flex-1 flex flex-col items-center px-4 relative">
                                   <div className="w-full h-[2px] bg-indigo-100 absolute top-1/2 -translate-y-1/2 z-0"></div>
                                   <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full z-10 shadow-sm border border-indigo-100">{getTransportIcon(stop.transportToNext)}</div>
                                   <div className="text-[10px] font-bold text-indigo-500 bg-white px-2 mt-1 relative z-10">{stop.transportDuration}</div>
                                </div>
                                <div className="flex flex-col items-end text-right flex-1">
                                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hacia {itinerary.stops[index + 1].city}</div>
                                   <div className="text-sm font-bold text-slate-700 leading-tight">{stop.transportDescription}</div>
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-4 ml-24 pt-4 opacity-50">
                  <div className="w-3 h-3 bg-slate-300 rounded-full ring-4 ring-slate-100"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regreso: {getRealDate(cumulativeDays)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 relative z-40">
              <div className="sticky top-6 space-y-6">
                <BookingWallet />
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                  <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 text-xl">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Info size={20} /></div> Resumen
                  </h3>
                  <div className="space-y-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Costo Total Estimado</span>
                        <span className="text-3xl font-black text-emerald-600 tracking-tight">{itinerary.totalEstimatedCostUSD}</span>
                        <button onClick={() => setIsBudgetModalOpen(true)} className="mt-2 w-full text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                            <Wallet size={12} /> Desglose Detallado
                        </button>
                      </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <button onClick={handleSaveProject} className="w-full bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                        <Save size={18} /> Guardar Archivo .europlanner
                    </button>
                    <button onClick={handleDownloadPDF} disabled={isPreparingPrint} className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                       {isPreparingPrint ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />}
                       Exportar Todo a PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {selectedStop && (
        <CityDetailModal 
          stop={selectedStop} 
          profile={profile}
          budgetLevel={preferences.budgetLevel}
          season={preferences.season}
          tripStyle={preferences.style}
          onClose={() => setSelectedStop(null)} 
          onEditRequest={handleOpenSmartEdit}
          onUpdateStop={(updated) => {
             const idx = itinerary.stops.findIndex(s => s.city === updated.city);
             if (idx !== -1) handleUpdateStop(idx, updated);
          }}
        />
      )}

      {isEditModalOpen && (
        <SmartEditModal 
          currentItinerary={itinerary}
          initialPrompt={editModalInitialPrompt}
          onSave={(newItinerary) => setItinerary(newItinerary)}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isBudgetModalOpen && (
        <BudgetAnalytics itinerary={itinerary} onClose={() => setIsBudgetModalOpen(false)} />
      )}

      {/* FULL REPORT EXPORT CONTAINER */}
      {showPrintView && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-md overflow-y-auto print:static print:bg-white print:overflow-visible">
           {/* Top Sticky bar for controlling the export */}
           <div className="sticky top-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center z-[10000] no-print shadow-2xl border-b border-white/10">
              <div className="flex items-center gap-4">
                 <div className="bg-indigo-600 p-2 rounded-lg">
                    <FileText size={20} />
                 </div>
                 <div>
                    <h2 className="font-bold text-lg leading-none">Reporte Maestro Consolidado</h2>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Documento de Viaje Profesional</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button 
                    onClick={() => {
                      setIsPreparingPrint(true);
                      window.print();
                      setIsPreparingPrint(false);
                    }} 
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors border border-white/10"
                 >
                    <Printer size={18} /> Diálogo de Impresión
                 </button>
                 <button 
                    onClick={handleDownloadPDF} 
                    disabled={isPreparingPrint}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
                 >
                    {isPreparingPrint ? <Loader2 className="animate-spin" size={18} /> : <FileDown size={18} />} 
                    Descargar PDF Nativo
                 </button>
                 <button 
                    onClick={() => setShowPrintView(false)} 
                    className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-bold transition-colors"
                 >
                    <X size={20} />
                 </button>
              </div>
           </div>

           {/* The actual content to be exported */}
           <div id="master-report-content" ref={printRef} className="max-w-[210mm] mx-auto bg-white p-0 min-h-screen text-slate-900 print-content shadow-2xl my-8 md:my-12">
             
             {/* Portada */}
             <div className="h-[280mm] flex flex-col justify-center p-20 text-center print-break-after relative overflow-hidden" style={{ WebkitPrintColorAdjust: 'exact' }}>
                <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-primary-600"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full -mr-48 -mb-48 opacity-50"></div>
                
                <div className="mb-12 flex justify-center scale-150"><Sparkles size={60} className="text-indigo-600" /></div>
                
                <h1 className="text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                   {itinerary.tripTitle}
                </h1>
                
                <div className="h-1.5 w-32 bg-indigo-600 mx-auto mb-12"></div>
                
                <p className="text-4xl text-slate-400 font-medium mb-20">Plan Maestro de Viaje</p>
                
                <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto w-full mb-20">
                   <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] bg-slate-50 shadow-sm">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Fecha de Salida</div>
                      <div className="text-2xl font-black text-slate-900">
                         {new Date(preferences.startDate + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                   </div>
                   <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] bg-slate-50 shadow-sm">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Duración</div>
                      <div className="text-2xl font-black text-slate-900">{preferences.durationDays} Noches Reales</div>
                   </div>
                   <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] bg-slate-50 shadow-sm">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Grupo Viajero</div>
                      <div className="text-2xl font-black text-slate-900">{profile.adults + profile.children} Integrantes</div>
                   </div>
                </div>

                <div className="text-left max-w-4xl mx-auto bg-slate-50 p-12 rounded-[3rem] border border-slate-100 shadow-inner">
                   <h3 className="font-bold uppercase tracking-[0.2em] text-indigo-600 text-xs mb-6">Resumen Ejecutivo</h3>
                   <p className="text-2xl leading-relaxed text-slate-700 font-medium">{itinerary.summary}</p>
                </div>

                <div className="mt-auto text-slate-300 font-bold text-xs uppercase tracking-widest">
                   Generado por EuroPlanner AI • {new Date().toLocaleDateString()}
                </div>
             </div>

             {/* Itinerario General - Hoja de Ruta */}
             <div className="p-20 print-break-after">
                <div className="flex items-center gap-4 mb-16">
                   <div className="w-12 h-1 bg-indigo-600"></div>
                   <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Hoja de Ruta</h2>
                </div>
                
                <div className="space-y-10">
                   {itinerary.stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-10 p-8 border border-slate-100 rounded-[2rem] bg-white shadow-sm hover:border-indigo-100 transition-colors">
                         <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center font-black text-3xl shrink-0 shadow-lg shadow-slate-200">
                            {i+1}
                         </div>
                         <div className="flex-1">
                            <div className="font-black text-3xl text-slate-900 mb-1">{stop.city}</div>
                            <div className="text-xs text-slate-400 uppercase font-black tracking-[0.2em]">{stop.country}</div>
                         </div>
                         <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Estadía</div>
                            <div className="text-3xl font-black text-indigo-600">{stop.nights} <span className="text-sm font-bold text-slate-300">Noches</span></div>
                         </div>
                      </div>
                   ))}
                </div>
                
                <div className="mt-16 bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex justify-between items-center">
                   <div>
                      <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">Presupuesto Total Estimado</h4>
                      <p className="text-sm text-emerald-600 font-medium">Incluye alojamiento, comidas y traslados internos</p>
                   </div>
                   <div className="text-4xl font-black text-emerald-700">{itinerary.totalEstimatedCostUSD}</div>
                </div>
             </div>

             {/* Preparativos y Logística */}
             {tripRequirements && (
                <div className="p-20 print-break-after bg-slate-50" style={{ WebkitPrintColorAdjust: 'exact' }}>
                   <div className="flex items-center gap-4 mb-16">
                      <div className="w-12 h-1 bg-indigo-600"></div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Preparativos</h2>
                   </div>

                   <div className="grid grid-cols-2 gap-10">
                      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 break-inside-avoid">
                         <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            <h3 className="font-black text-xl text-slate-800">Visas y Salud</h3>
                         </div>
                         <div className="space-y-6">
                            <div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Documentación</div>
                               <p className="text-sm font-bold text-slate-700 mb-1">{tripRequirements.visaInfo.title}</p>
                               <p className="text-xs text-slate-500 leading-relaxed">{tripRequirements.visaInfo.details}</p>
                            </div>
                            <div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Salud / Seguros</div>
                               <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold text-slate-800">Vacunas:</span> {tripRequirements.healthInfo.vaccinations}</p>
                               <p className="text-xs text-slate-600 leading-relaxed mt-2"><span className="font-bold text-slate-800">Seguro:</span> {tripRequirements.healthInfo.insuranceAdvice}</p>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 break-inside-avoid">
                         <div className="flex items-center gap-3 mb-6">
                            <Plug className="text-indigo-500" size={24} />
                            <h3 className="font-black text-xl text-slate-800">Tecnología</h3>
                         </div>
                         <div className="space-y-6">
                            <div className="flex gap-4">
                               {tripRequirements.techSpecs.plugTypes.map(pt => (
                                  <div key={pt} className="text-center">
                                     <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black mb-1">{pt}</div>
                                     <div className="text-[9px] font-bold text-slate-400">TIPO {pt}</div>
                                  </div>
                               ))}
                            </div>
                            <div>
                               <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold text-slate-800">Voltaje:</span> {tripRequirements.techSpecs.voltage}</p>
                               <p className="text-xs text-slate-500 italic mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">"{tripRequirements.techSpecs.adapterAdvice}"</p>
                            </div>
                         </div>
                      </div>

                      <div className="col-span-2 bg-slate-900 text-white p-12 rounded-[3rem] shadow-xl break-inside-avoid">
                         <div className="flex items-center gap-3 mb-8">
                            <Languages className="text-pink-400" size={28} />
                            <h3 className="font-black text-2xl">Survival Kit de Idiomas</h3>
                         </div>
                         <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                            {tripRequirements.survivalPhrases.map((kit, kIdx) => (
                               <div key={kIdx} className="space-y-4">
                                  <h4 className="font-black text-pink-300 text-lg border-b border-white/10 pb-2">{kit.language}</h4>
                                  <div className="space-y-3">
                                     {kit.phrases.slice(0, 4).map((p, pIdx) => (
                                        <div key={pIdx} className="flex justify-between items-center text-sm">
                                           <div>
                                              <div className="font-bold">{p.translated}</div>
                                              <div className="text-[10px] text-white/40">{p.original}</div>
                                           </div>
                                           <div className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded">/{p.pronunciation}/</div>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* Guía Experta Táctica */}
             {travelerGuide && (
                 <div className="p-20 print-break-after" style={{ WebkitPrintColorAdjust: 'exact' }}>
                    <div className="flex items-center gap-4 mb-16">
                      <div className="w-12 h-1 bg-indigo-600"></div>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Guía Táctica</h2>
                    </div>

                    <div className="mb-16 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 rounded-[3rem] text-white shadow-xl shadow-indigo-900/10">
                       <h3 className="font-black uppercase text-indigo-200 text-xs mb-8 tracking-[0.3em]">Directivas Generales</h3>
                       <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                          {travelerGuide.generalTips.map((tip, i) => (
                             <div key={i} className="text-base leading-relaxed flex gap-4 font-medium italic">
                                <span className="text-indigo-300 text-2xl shrink-0">“</span>
                                {tip}
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-16">
                       {travelerGuide.cityGuides.map((guide, idx) => (
                          <div key={idx} className="bg-white border-2 border-slate-100 rounded-[3rem] p-12 break-inside-avoid relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-[10rem] -mr-12 -mt-12 z-0"></div>
                             
                             <div className="flex items-center gap-6 mb-10 relative z-10">
                                <span className="text-6xl font-black text-slate-100">0{idx + 1}</span>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{guide.city}</h3>
                             </div>

                             <div className="grid grid-cols-2 gap-12 relative z-10">
                                <div>
                                   <div className="flex items-center gap-3 mb-4">
                                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Bus size={18}/></div>
                                      <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Transporte</h4>
                                   </div>
                                   <p className="text-base font-bold text-slate-800 mb-2">App: {guide.localTransport.bestApp}</p>
                                   <p className="text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed font-medium">{guide.localTransport.ticketTip}</p>
                                </div>

                                <div>
                                   <div className="flex items-center gap-3 mb-4">
                                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Coins size={18}/></div>
                                      <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Dinero & Propinas</h4>
                                   </div>
                                   <p className="text-base font-bold text-slate-800 mb-2">Propina: {guide.moneyTactics.tipping}</p>
                                   <p className="text-sm text-slate-500 italic leading-relaxed border-l-2 border-emerald-200 pl-4">"{guide.moneyTactics.cashOrCard}"</p>
                                </div>

                                <div className="col-span-2 grid grid-cols-2 gap-12 pt-8 border-t border-slate-50">
                                   <div>
                                      <div className="flex items-center gap-3 mb-4">
                                         <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Lock size={18}/></div>
                                         <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest text-rose-600">Alerta de Seguridad</h4>
                                      </div>
                                      <div className="space-y-2">
                                         {guide.safetyAlerts.map((alert, i) => (
                                            <div key={i} className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                               <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {alert}
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-3 mb-4">
                                         <div className="p-2 bg-violet-50 text-violet-600 rounded-xl"><Star size={18}/></div>
                                         <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Hidden Gems</h4>
                                      </div>
                                      <div className="space-y-2">
                                         {guide.hiddenGems.map((gem, i) => (
                                            <div key={i} className="text-sm font-medium text-slate-600 italic">
                                               ★ {gem}
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
             )}

             {/* Itinerario Diario Detallado */}
             <div className="p-20">
                <div className="flex items-center gap-4 mb-16">
                  <div className="w-12 h-1 bg-indigo-600"></div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Agenda Diaria</h2>
                </div>

                {itinerary.stops.map((stop, idx) => (
                   <div key={idx} className="mb-24 print-break-inside-avoid">
                      <div className="flex items-baseline gap-8 mb-10 border-b-4 border-slate-900 pb-6">
                         <h3 className="text-5xl font-black text-slate-900 tracking-tight">{stop.city}</h3>
                         <span className="text-2xl text-slate-300 font-bold tracking-[0.2em] uppercase">{stop.country}</span>
                      </div>
                      
                      <div className="pl-12 border-l-8 border-indigo-50 ml-6 space-y-12">
                         <div className="flex gap-8 text-sm font-black bg-slate-50 p-6 rounded-[2rem] border border-slate-100 w-fit shadow-sm">
                            <div className="text-emerald-700 flex items-center gap-3"><LogIn size={20}/> Check-In: {stop.arrivalTime || "10:00"}</div>
                            {stop.departureTime && <div className="text-amber-700 flex items-center gap-3 border-l border-slate-200 pl-8"><LogOut size={20}/> Check-Out: {stop.departureTime}</div>}
                         </div>

                         <div className="space-y-10">
                            {stop.dailyPlan && stop.dailyPlan.map((act, i) => (
                               <div key={i} className="flex gap-12">
                                  <div className="font-black w-32 shrink-0 text-indigo-600 text-xl border-r-2 border-indigo-50 pr-8">{act.time}</div>
                                  <div className="flex-1">
                                     <div className="font-black text-2xl text-slate-900 mb-2">{act.activity}</div>
                                     <div className="text-slate-500 text-lg leading-relaxed font-medium">{act.description}</div>
                                  </div>
                               </div>
                            ))}
                         </div>

                         <div className="pt-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Puntos Críticos de Reserva</h4>
                            <div className="grid grid-cols-2 gap-4">
                               {stop.keyMilestones.map((m, i) => (
                                  <div key={i} className="bg-white p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold text-slate-800 flex items-center gap-3">
                                     <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Check size={14}/></div>
                                     {m}
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                ))}

                <div className="mt-20 pt-20 border-t-2 border-slate-100 text-center">
                   <p className="text-slate-400 font-black text-xs uppercase tracking-[0.5em]">Fin del Reporte EuroPlanner AI</p>
                   <p className="text-slate-300 text-[10px] mt-4">Los precios y requisitos pueden variar. Verifique con los organismos oficiales antes de viajar.</p>
                </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryView;
