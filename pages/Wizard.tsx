
import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { TripStyle, TravelSeason, CityConstraint } from '../types';
import { generateTripPlan } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Wallet, ArrowRight, Sparkles, Heart, Plane, Check, ChevronLeft, MapPin, Plus, X, Coffee, Music, Camera, ShoppingBag, BookOpen, CreditCard, Image as ImageIcon, GitFork, Ticket, Clock, GripVertical, AlertCircle, ArrowDownToLine, ArrowUpFromLine, Footprints } from 'lucide-react';
import SmartTip from '../components/SmartTip';
import MultimodalInput from '../components/MultimodalInput';

const Wizard = () => {
  const { 
    step, setStep, 
    profile, setProfile, 
    preferences, setPreferences,
    setItinerary, setAvailableRoutes, setIsGenerating, isGenerating 
  } = useTrip();
  
  const navigate = useNavigate();
  const [activeTip, setActiveTip] = useState<string>("");
  const [cityInput, setCityInput] = useState("");

  // Manage City Constraints Local State before syncing
  const [localConstraints, setLocalConstraints] = useState<CityConstraint[]>([]);

  // Calculate days between start and end
  useEffect(() => {
    if (preferences.startDate && preferences.endDate) {
      const start = new Date(preferences.startDate);
      const end = new Date(preferences.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // LOGIC FIX: Late Arrival Adjustment
      // If user arrives after 9 PM (21:00), effectively the trip starts the next day.
      if (preferences.existingFlight.hasFlight && preferences.existingFlight.arrivalTime) {
         const arrivalHour = parseInt(preferences.existingFlight.arrivalTime.split(':')[0], 10);
         if (arrivalHour >= 21) {
            diffDays -= 1; // Subtract 1 night from the "enjoyable" duration
         }
      }
      
      // Auto detect season (approximate)
      const month = start.getMonth() + 1;
      let detectedSeason = TravelSeason.SPRING;
      if (month >= 6 && month <= 8) detectedSeason = TravelSeason.SUMMER;
      else if (month >= 9 && month <= 11) detectedSeason = TravelSeason.AUTUMN;
      else if (month === 12 || month <= 2) detectedSeason = TravelSeason.WINTER;

      setPreferences(prev => ({ 
        ...prev, 
        durationDays: diffDays,
        season: detectedSeason
      }));
    }
  }, [preferences.startDate, preferences.endDate, preferences.existingFlight, setPreferences]);

  // Sync constraints when cities change
  useEffect(() => {
    const newConstraints: CityConstraint[] = preferences.mustVisitCities.map(city => {
       const existing = localConstraints.find(c => c.city === city);
       if (existing) return existing;
       
       // Smart default for fixed flights
       let order: 'START' | 'END' | 'ANY' = 'ANY';
       let nights: number | null = null;

       if (preferences.existingFlight.hasFlight) {
          if (city === preferences.existingFlight.arrivalCity) {
             order = 'START';
             // Default to 0 nights (Transit) if arrival city matches a desired city, 
             // user can increase it if they want to stay.
             // But usually first stop has nights. Let's keep null (Auto) unless user sets it.
          }
          if (city === preferences.existingFlight.departureCity) order = 'END';
       }

       return { city, fixedNights: nights, visitOrder: order };
    });
    setLocalConstraints(newConstraints);
  }, [preferences.mustVisitCities, preferences.existingFlight]);

  // Dynamic AI messaging based on step
  useEffect(() => {
    if (step === 1) setActiveTip("¡Hola! Soy tu copiloto de viaje. Puedes llenar los datos manualmente O soltar una imagen de tu pasaje/reserva aquí abajo para que yo lo complete por ti.");
    if (step === 2) setActiveTip("Si ya tienes pasajes, activa la opción para que ajuste el plan a tus vuelos. Si no, buscaré el mejor clima y precios.");
    if (step === 3) setActiveTip("¡El momento de elegir! Selecciona los países clave. Si tienes una lista de ciudades (ej: 'Londres, Paris, Roma'), pégala y yo las separo automáticamente.");
    if (step === 4) {
       const isLateArrival = preferences.existingFlight.hasFlight && parseInt(preferences.existingFlight.arrivalTime.split(':')[0]) >= 21;
       if (isLateArrival) {
          setActiveTip(`He detectado que llegas tarde (${preferences.existingFlight.arrivalTime}). He ajustado la duración a ${preferences.durationDays} noches reales para descontar esa noche de llegada.`);
       } else {
          setActiveTip("Control total: Si pones '0 noches' en una ciudad (ej: Madrid), entenderé que es solo escala o tránsito y te llevaré directo al siguiente destino.");
       }
    }
    if (step === 5) setActiveTip("Para terminar, cuéntame sobre tus gustos y métodos de pago. Buscaré vuelos con beneficios específicos para tu tarjeta.");
  }, [step, preferences.existingFlight, preferences.durationDays]);

  const handleNext = () => {
    if (step === 4) {
        setPreferences(prev => ({ ...prev, cityConstraints: localConstraints }));
    }
    setStep(step + 1);
  };
  
  const handleBack = () => setStep(step - 1);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Final sync before generate
    const finalPrefs = { ...preferences, cityConstraints: localConstraints };
    setPreferences(finalPrefs);

    setActiveTip(`¡Manos a la obra! Estoy analizando eventos y clima entre el ${preferences.startDate} y ${preferences.endDate} para crear 3 rutas perfectas...`);
    
    const plans = await generateTripPlan(profile, finalPrefs);
    
    setIsGenerating(false);
    
    if (plans && plans.length > 0) {
      setAvailableRoutes(plans); // Store all options
      setItinerary(null);        // Ensure no itinerary is selected yet
      navigate('/selection');    // Navigate to Selection Screen
    } else {
       setActiveTip("Hubo un pequeño error al generar las rutas. Por favor intenta de nuevo.");
    }
  };

  const handleImageAnalysis = (data: any) => {
    let newProfile = { ...profile };
    let newPreferences = { ...preferences };
    let tipMessage = "¡Genial! He autocompletado los campos con lo que vi en la imagen.";

    if (data.originCity) newProfile.originCity = data.originCity;
    
    // Explicitly set dates as strings to avoid timezone shifts
    if (data.startDate && data.endDate) {
      newPreferences.startDate = data.startDate;
      newPreferences.endDate = data.endDate;
    }

    if (data.mustVisitCountries || data.mustVisitCities) {
      newPreferences.mustVisitCountries = [...new Set([...newPreferences.mustVisitCountries, ...(data.mustVisitCountries || [])])];
      newPreferences.mustVisitCities = [...new Set([...newPreferences.mustVisitCities, ...(data.mustVisitCities || [])])];
    }

    if (data.flightDetails && data.flightDetails.hasFlight) {
        newPreferences.existingFlight = {
            hasFlight: true,
            arrivalCity: data.flightDetails.outbound?.arrivalCity || '',
            arrivalDate: data.flightDetails.outbound?.arrivalDate || data.startDate,
            arrivalTime: data.flightDetails.outbound?.arrivalTime || '10:00',
            departureCity: data.flightDetails.inbound?.departureCity || '',
            departureDate: data.flightDetails.inbound?.departureDate || data.endDate,
            departureTime: data.flightDetails.inbound?.departureTime || '18:00',
        };
        // Force update global dates to match flight
        newPreferences.startDate = data.flightDetails.outbound?.arrivalDate || data.startDate;
        newPreferences.endDate = data.flightDetails.inbound?.departureDate || data.endDate;
        
        tipMessage = `¡Excelente! Detecté tus pasajes confirmados del ${newPreferences.startDate} al ${newPreferences.endDate}.`;
    }

    if (data.detectedContext) tipMessage = `¡Genial! ${data.detectedContext}.`;

    setProfile(newProfile);
    setPreferences(newPreferences);
    setActiveTip(tipMessage);
    setStep(2);
  };

  const toggleCountry = (country: string) => {
    setPreferences(prev => {
      const exists = prev.mustVisitCountries.includes(country);
      if (exists) {
        return { ...prev, mustVisitCountries: prev.mustVisitCountries.filter(c => c !== country) };
      } else {
        // REMOVED LIMIT CHECK
        return { ...prev, mustVisitCountries: [...prev.mustVisitCountries, country] };
      }
    });
  };

  const addCity = () => {
    if (!cityInput.trim()) return;

    // Split by comma and clean up
    const citiesToAdd = cityInput.split(',').map(c => c.trim()).filter(c => c.length > 0);
    
    // Filter out duplicates
    const uniqueNewCities = citiesToAdd.filter(c => !preferences.mustVisitCities.includes(c));

    if (uniqueNewCities.length > 0) {
      setPreferences(prev => ({
        ...prev,
        mustVisitCities: [...prev.mustVisitCities, ...uniqueNewCities]
      }));
      setCityInput("");
    }
  };

  const removeCity = (city: string) => {
    setPreferences(prev => ({
      ...prev,
      mustVisitCities: prev.mustVisitCities.filter(c => c !== city)
    }));
  };

  const updateConstraint = (city: string, field: keyof CityConstraint, value: any) => {
     setLocalConstraints(prev => prev.map(c => c.city === city ? { ...c, [field]: value } : c));
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      }
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const updateFixedFlight = (field: string, value: any) => {
    setPreferences(prev => {
        const updatedFlight = { ...prev.existingFlight, [field]: value };
        const updatedPrefs = { ...prev, existingFlight: updatedFlight };
        if (field === 'arrivalDate') updatedPrefs.startDate = value;
        if (field === 'departureDate') updatedPrefs.endDate = value;
        return updatedPrefs;
    });
  };

  // Calculate used days for Step 4
  const usedDays = localConstraints.reduce((acc, c) => acc + (c.fixedNights || 0), 0);
  const remainingDays = preferences.durationDays - usedDays;

  const commonCountries = [
    { name: "España", flag: "🇪🇸", img: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=400&q=80" },
    { name: "Italia", flag: "🇮🇹", img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80" },
    { name: "Francia", flag: "🇫🇷", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
    { name: "Reino Unido", flag: "🇬🇧", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80" },
    { name: "Alemania", flag: "🇩🇪", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80" },
    { name: "Países Bajos", flag: "🇳🇱", img: "https://images.unsplash.com/photo-1512470876302-687da7453c47?auto=format&fit=crop&w=400&q=80" },
    { name: "Suiza", flag: "🇨🇭", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80" },
    { name: "Grecia", flag: "🇬🇷", img: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=400&q=80" },
    { name: "Portugal", flag: "🇵🇹", img: "https://images.unsplash.com/photo-1555881400-74d7acaacd81?auto=format&fit=crop&w=400&q=80" }
  ];

  const interestOptions = [
    { label: "Gastronomía", icon: Coffee },
    { label: "Historia y Museos", icon: BookOpen },
    { label: "Vida Nocturna", icon: Music },
    { label: "Paisajes / Naturaleza", icon: Camera },
    { label: "Compras", icon: ShoppingBag },
    { label: "Fútbol / Deportes", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary-900 via-primary-800 to-slate-50 z-0"></div>
      
      {/* Header / Progress */}
      <div className="relative z-10 max-w-5xl mx-auto w-full p-8 flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
             <Sparkles size={24} className="text-yellow-300 animate-pulse-slow" />
          </div>
          <div>
             <h1 className="font-bold text-xl tracking-tight">EuroPlanner AI</h1>
             <p className="text-primary-200 text-sm font-medium">Diseñando tu experiencia</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {[1, 2, 3, 4, 5].map(s => (
             <div key={s} className={`h-2 w-2 rounded-full transition-all duration-500 ${s === step ? 'bg-white w-8' : s < step ? 'bg-primary-400' : 'bg-white/20'}`} />
          ))}
          <span className="ml-2 text-sm font-medium text-white/80">Paso {step} de 5</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 pb-12">
        
        {/* AI Dialogue Bubble */}
        <div className="max-w-3xl w-full mb-8 animate-fade-in-up">
           <SmartTip 
             text={activeTip} 
             type="insight" 
             className="bg-white/95 border-white/50 shadow-2xl backdrop-blur-xl transform hover:scale-[1.01] transition-transform" 
           />
        </div>

        {/* Interactive Card */}
        <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col min-h-[600px] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          
          <div className="flex-1 p-8 md:p-12 flex flex-col">
            
            {/* STEP 1: TRAVELERS */}
            {step === 1 && (
              <div className="flex-1 flex flex-col gap-10 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">¿Quiénes viajan?</h2>
                  <p className="text-lg text-slate-500">Define tu grupo o <strong className="text-primary-600">arrastra un pasaje</strong>.</p>
                </div>
                
                <div className="max-w-2xl mx-auto w-full"><MultimodalInput onAnalysisComplete={handleImageAnalysis} /></div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full mt-4">
                   <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-bold text-slate-800">Adultos</h3>
                         <div className="flex items-center gap-4">
                            <button onClick={() => setProfile({...profile, adults: Math.max(1, profile.adults - 1)})} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center font-bold text-slate-500">-</button>
                            <span className="text-2xl font-black">{profile.adults}</span>
                            <button onClick={() => setProfile({...profile, adults: profile.adults + 1})} className="w-10 h-10 rounded-full bg-primary-600 text-white shadow flex items-center justify-center font-bold">+</button>
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <h3 className="text-xl font-bold text-slate-800">Niños</h3>
                         <div className="flex items-center gap-4">
                            <button onClick={() => setProfile({...profile, children: Math.max(0, profile.children - 1)})} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center font-bold text-slate-500">-</button>
                            <span className="text-2xl font-black">{profile.children}</span>
                            <button onClick={() => setProfile({...profile, children: profile.children + 1})} className="w-10 h-10 rounded-full bg-primary-600 text-white shadow flex items-center justify-center font-bold">+</button>
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Origen</label>
                      <input 
                        type="text" 
                        value={profile.originCity}
                        onChange={(e) => setProfile({...profile, originCity: e.target.value})}
                        className="w-full p-4 bg-white rounded-xl font-bold border-2 border-transparent focus:border-primary-200 outline-none"
                        placeholder="Ej: Buenos Aires"
                      />
                      <div className="mt-4 flex items-center gap-2 cursor-pointer" onClick={() => setProfile({...profile, flexibleOrigin: !profile.flexibleOrigin})}>
                         <div className={`w-10 h-6 rounded-full p-1 transition-colors ${profile.flexibleOrigin ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${profile.flexibleOrigin ? 'translate-x-4' : 'translate-x-0'}`}></div>
                         </div>
                         <span className="text-sm font-bold text-slate-600">Origen Flexible (ROS/BUE)</span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* STEP 2: DATES */}
            {step === 2 && (
              <div className="flex-1 flex flex-col gap-8 animate-fade-in">
                 <div className="text-center space-y-2">
                   <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Fechas y Estilo</h2>
                 </div>
                 
                 <div className="max-w-4xl mx-auto w-full grid lg:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 lg:col-span-2">
                       <div className="flex justify-between items-center mb-6">
                           <label className="font-bold text-xl text-slate-700">¿Ya tienes pasajes?</label>
                           <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${preferences.existingFlight.hasFlight ? 'bg-primary-600' : 'bg-slate-300'}`} onClick={() => updateFixedFlight('hasFlight', !preferences.existingFlight.hasFlight)}>
                               <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${preferences.existingFlight.hasFlight ? 'translate-x-6' : 'translate-x-0'}`}></div>
                           </div>
                       </div>
                       
                       {preferences.existingFlight.hasFlight ? (
                           <div className="grid md:grid-cols-2 gap-4">
                               <div className="bg-white p-4 rounded-xl border-2 border-primary-100">
                                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Llegada</label>
                                   <input type="date" value={preferences.existingFlight.arrivalDate} onChange={(e) => updateFixedFlight('arrivalDate', e.target.value)} className="w-full font-bold outline-none mb-2" />
                                   <input type="time" value={preferences.existingFlight.arrivalTime} onChange={(e) => updateFixedFlight('arrivalTime', e.target.value)} className="w-full font-bold outline-none border-b border-slate-200 pb-2 mb-2" />
                                   <input type="text" placeholder="Ciudad Llegada" value={preferences.existingFlight.arrivalCity} onChange={(e) => updateFixedFlight('arrivalCity', e.target.value)} className="w-full pt-2 outline-none" />
                               </div>
                               <div className="bg-white p-4 rounded-xl border-2 border-primary-100">
                                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Regreso</label>
                                   <input type="date" value={preferences.existingFlight.departureDate} onChange={(e) => updateFixedFlight('departureDate', e.target.value)} className="w-full font-bold outline-none mb-2" />
                                   <input type="time" value={preferences.existingFlight.departureTime} onChange={(e) => updateFixedFlight('departureTime', e.target.value)} className="w-full font-bold outline-none border-b border-slate-200 pb-2 mb-2" />
                                   <input type="text" placeholder="Ciudad Salida" value={preferences.existingFlight.departureCity} onChange={(e) => updateFixedFlight('departureCity', e.target.value)} className="w-full pt-2 outline-none" />
                               </div>
                           </div>
                       ) : (
                           <div className="grid grid-cols-2 gap-4">
                               <div className="bg-white p-4 rounded-xl"><label className="block text-xs font-bold text-slate-400 uppercase mb-1">Inicio</label><input type="date" value={preferences.startDate} onChange={(e) => setPreferences({...preferences, startDate: e.target.value})} className="w-full font-bold outline-none"/></div>
                               <div className="bg-white p-4 rounded-xl"><label className="block text-xs font-bold text-slate-400 uppercase mb-1">Fin</label><input type="date" value={preferences.endDate} onChange={(e) => setPreferences({...preferences, endDate: e.target.value})} className="w-full font-bold outline-none"/></div>
                           </div>
                       )}
                    </div>
                    
                    <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100">
                       <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Presupuesto</label>
                       <div className="flex gap-2">
                           {['Bajo', 'Medio', 'Alto'].map(l => (
                               <button key={l} onClick={() => setPreferences({...preferences, budgetLevel: l as any})} className={`flex-1 py-2 rounded-lg font-bold text-sm ${preferences.budgetLevel === l ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>{l}</button>
                           ))}
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* STEP 3: CITIES */}
            {step === 3 && (
              <div className="flex-1 flex flex-col gap-6 animate-fade-in h-full">
                 <div className="text-center mb-2">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Tus Imperdibles</h2>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 -mx-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                       {commonCountries.map(c => {
                          const isSelected = preferences.mustVisitCountries.includes(c.name);
                          return (
                             <button key={c.name} onClick={() => toggleCountry(c.name)} className={`relative group rounded-3xl overflow-hidden aspect-[4/2] transition-all duration-300 ${isSelected ? 'ring-4 ring-primary-500 scale-[0.98]' : 'hover:shadow-xl ring-1 ring-slate-200'}`}>
                                <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
                                <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-primary-900/60' : 'bg-black/40'}`}></div>
                                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white text-left"><span className="font-bold text-lg">{c.flag} {c.name}</span></div>
                             </button>
                          );
                       })}
                    </div>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <label className="text-sm font-bold text-slate-600 mb-2 block">Agregar Ciudades (separadas por coma)</label>
                    <div className="flex gap-2 mb-3">
                       <input 
                         type="text" 
                         value={cityInput} 
                         onChange={(e) => setCityInput(e.target.value)} 
                         onKeyPress={(e) => e.key === 'Enter' && addCity()} 
                         placeholder="Ej: Londres, Paris, Liverpool, Manchester..." 
                         className="flex-1 px-5 py-3 rounded-xl border outline-none" 
                       />
                       <button onClick={addCity} className="bg-slate-900 text-white px-4 rounded-xl"><Plus /></button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                        {preferences.mustVisitCities.map((city, i) => (
                            <span key={i} className="bg-white px-3 py-1 rounded-lg font-bold flex items-center gap-2 border shadow-sm">
                                {city} <button onClick={() => removeCity(city)} className="hover:text-red-500"><X size={14}/></button>
                            </span>
                        ))}
                    </div>
                 </div>
              </div>
            )}

            {/* STEP 4: ALLOCATION */}
            {step === 4 && (
               <div className="flex-1 flex flex-col gap-6 animate-fade-in">
                  <div className="text-center mb-4">
                     <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Distribución</h2>
                     <p className="text-slate-500">
                        Asigna noches. Si pones <strong>0 noches</strong>, será considerada una ciudad de paso/tránsito.
                     </p>
                  </div>

                  {/* Budget Bar */}
                  <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl max-w-3xl mx-auto w-full mb-4">
                      <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-slate-400 uppercase">Días Totales</span>
                          <span className={`text-2xl font-black ${remainingDays < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {remainingDays} <span className="text-sm font-medium text-white/60">disponibles</span>
                          </span>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden flex">
                          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.min(100, (usedDays / preferences.durationDays) * 100)}%` }}></div>
                          {remainingDays < 0 && <div className="h-full bg-red-500 w-full animate-pulse"></div>}
                      </div>
                  </div>

                  {/* City List */}
                  <div className="max-w-3xl mx-auto w-full space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                      {localConstraints.length === 0 && (
                          <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl">
                              No has seleccionado ciudades específicas. La IA sugerirá la ruta óptima.
                          </div>
                      )}
                      
                      {localConstraints.map((c, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-all hover:border-indigo-200">
                              
                              <div className="flex-1 flex items-center gap-3 w-full">
                                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                                      {idx + 1}
                                  </div>
                                  <span className="font-bold text-lg text-slate-800">{c.city}</span>
                              </div>

                              {/* Nights Control (Allows 0) */}
                              <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                  <button 
                                    onClick={() => updateConstraint(c.city, 'fixedNights', c.fixedNights !== null ? Math.max(0, c.fixedNights - 1) : 0)}
                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-slate-500 font-bold"
                                  >-</button>
                                  <div className="text-center min-w-[80px]">
                                      <span className={`block font-black text-lg leading-none ${c.fixedNights !== null ? 'text-indigo-600' : 'text-slate-400'}`}>
                                          {c.fixedNights === 0 ? "Tránsito" : (c.fixedNights || "Auto")}
                                      </span>
                                      <span className="text-[10px] uppercase font-bold text-slate-400">
                                          {c.fixedNights === 0 ? "Solo Paso" : "Noches"}
                                      </span>
                                  </div>
                                  <button 
                                    onClick={() => updateConstraint(c.city, 'fixedNights', (c.fixedNights || 0) + 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-indigo-600 font-bold"
                                  >+</button>
                              </div>

                              {/* Order Control */}
                              <div className="flex bg-slate-100 p-1 rounded-lg">
                                  <button 
                                      onClick={() => updateConstraint(c.city, 'visitOrder', 'START')}
                                      className={`p-2 rounded-md transition-all ${c.visitOrder === 'START' ? 'bg-white shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                                      title="Primera Parada"
                                  ><ArrowDownToLine size={16} /></button>
                                  <button 
                                      onClick={() => updateConstraint(c.city, 'visitOrder', 'ANY')}
                                      className={`p-2 rounded-md transition-all ${c.visitOrder === 'ANY' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                      title="Cualquier Orden"
                                  ><GripVertical size={16} /></button>
                                  <button 
                                      onClick={() => updateConstraint(c.city, 'visitOrder', 'END')}
                                      className={`p-2 rounded-md transition-all ${c.visitOrder === 'END' ? 'bg-white shadow text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                                      title="Última Parada"
                                  ><ArrowUpFromLine size={16} /></button>
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
            )}

            {/* STEP 5: PERSONALIZATION */}
             {step === 5 && (
              <div className="flex-1 flex flex-col gap-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">El Toque Personal</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
                  <div className="space-y-4">
                     <h3 className="text-slate-700 font-bold ml-2 flex items-center gap-2"><Heart size={16} /> Intereses</h3>
                     <div className="grid grid-cols-2 gap-3">
                        {interestOptions.map((interest) => {
                          const Icon = interest.icon;
                          const isSelected = preferences.interests.includes(interest.label);
                          return (
                            <button key={interest.label} onClick={() => toggleInterest(interest.label)} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100'}`}>
                              <Icon size={18} className={isSelected ? 'text-white' : 'text-indigo-600'} />
                              <span className="font-bold text-xs">{interest.label}</span>
                            </button>
                          );
                        })}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-slate-700 font-bold ml-2 flex items-center gap-2"><CreditCard size={16} /> Tarjeta</h3>
                     <div className="bg-white p-6 rounded-[2rem] border border-slate-200">
                        <input type="text" value={preferences.creditCard} onChange={(e) => setPreferences({...preferences, creditCard: e.target.value})} placeholder="Ej: Visa Signature Galicia" className="w-full p-4 bg-slate-50 rounded-xl border outline-none font-bold" />
                     </div>
                  </div>
                </div>
                <div className="max-w-5xl mx-auto w-full">
                  <textarea value={preferences.specificRequests} onChange={(e) => setPreferences({...preferences, specificRequests: e.target.value})} placeholder="Deseos específicos..." className="w-full h-24 p-4 bg-white rounded-xl border outline-none resize-none" />
                </div>
              </div>
            )}

          </div>

          {/* FOOTER NAV */}
          <div className="p-8 bg-white border-t border-slate-100 flex justify-between items-center">
             {step > 1 ? (
               <button onClick={handleBack} className="group flex items-center gap-2 px-6 py-3 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold transition-all">
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Atrás
               </button>
             ) : (<div></div>)}
             
             {step < 5 ? (
               <button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800 text-white pl-8 pr-6 py-4 rounded-2xl font-bold text-lg flex items-center gap-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group">
                  Siguiente <ArrowRight size={20} className="group-hover:translate-x-1" />
               </button>
             ) : (
               <button onClick={handleGenerate} disabled={isGenerating} className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 disabled:opacity-50 w-full md:w-auto justify-center">
                  {isGenerating ? <><div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> Generando...</> : <><Sparkles size={22} className="text-yellow-300 animate-pulse" /> GENERAR RUTAS</>}
               </button>
             )}
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default Wizard;
