
import React, { useState } from 'react';
import { PieChart, DollarSign, ShoppingBag, Utensils, Hotel, Ticket, Calendar, Download, Share2, Wallet } from 'lucide-react';
import { GeneratedItinerary } from '../types';

interface BudgetAnalyticsProps {
  itinerary: GeneratedItinerary;
  onClose: () => void;
}

const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({ itinerary, onClose }) => {
  const bd = itinerary.budgetBreakdown || {
    accommodation: 2000,
    food: 1200,
    transport: 800,
    activities: 600,
    shopping: 500,
    currency: 'USD',
    explanation: 'Estimación basada en promedios estándar.'
  };

  const total = bd.accommodation + bd.food + bd.transport + bd.activities + bd.shopping;

  const categories = [
    { label: 'Alojamiento', value: bd.accommodation, color: 'bg-indigo-500', icon: Hotel },
    { label: 'Comida', value: bd.food, color: 'bg-emerald-500', icon: Utensils },
    { label: 'Transporte', value: bd.transport, color: 'bg-sky-500', icon: Ticket },
    { label: 'Actividades', value: bd.activities, color: 'bg-amber-500', icon: Ticket },
    { label: 'Compras/Extras', value: bd.shopping, color: 'bg-rose-500', icon: ShoppingBag },
  ];

  // Function to generate .ics file
  const handleExportCalendar = () => {
    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EuroPlanner AI//Trip Schedule//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH"
    ];

    // Generate date string for ICS (YYYYMMDD)
    const formatDate = (dateStr: string) => {
      return dateStr.replace(/-/g, ''); 
    };

    // Current Date (simulated start date for demo if exact dates not in stop object, 
    // but usually we have start date in context. For this demo we assume relative days).
    // Ideally, we pass the real startDate here.
    const now = new Date(); 
    
    itinerary.stops.forEach((stop, index) => {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() + (stop.arrivalDay || index * 2));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + stop.nights);

        const startStr = startDate.toISOString().split('T')[0].replace(/-/g, '');
        const endStr = endDate.toISOString().split('T')[0].replace(/-/g, '');

        icsContent.push(
            "BEGIN:VEVENT",
            `DTSTART;VALUE=DATE:${startStr}`,
            `DTEND;VALUE=DATE:${endStr}`,
            `SUMMARY:Viaje: ${stop.city} (${stop.country})`,
            `DESCRIPTION:Estadía de ${stop.nights} noches. Highlights: ${stop.highlights.join(', ')}.`,
            `LOCATION:${stop.city}, ${stop.country}`,
            "END:VEVENT"
        );
    });

    icsContent.push("END:VCALENDAR");

    const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "europlanner_trip.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-slate-900 p-8 text-white shrink-0 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <Wallet className="text-emerald-400" /> Centro de Control
            </h2>
            <p className="text-slate-400 mt-1">Analítica de costos y herramientas de exportación</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors text-sm font-bold bg-white/10 px-3 py-1 rounded-lg">
             CERRAR ESCAPE
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* LEFT: Budget Analytics */}
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <PieChart size={20} className="text-indigo-600" /> Desglose de Gastos
                  </h3>
                  
                  {/* Visual Bar Chart */}
                  <div className="space-y-4">
                     {categories.map((cat) => (
                        <div key={cat.label}>
                           <div className="flex justify-between text-sm mb-1">
                              <span className="font-bold text-slate-700 flex items-center gap-2">
                                 <cat.icon size={14} className="text-slate-400" /> {cat.label}
                              </span>
                              <span className="font-mono text-slate-600">${cat.value}</span>
                           </div>
                           <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full ${cat.color} transition-all duration-1000 ease-out`} 
                                 style={{ width: `${(cat.value / total) * 100}%` }}
                              ></div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
                     <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Estimado</span>
                        <div className="text-3xl font-black text-slate-900">${total} <span className="text-base font-normal text-slate-500">USD</span></div>
                     </div>
                     <div className="text-right text-xs text-slate-400 max-w-[150px]">
                        *Sin vuelos internacionales. Basado en perfil {itinerary.budgetBreakdown ? '' : '(Simulado)'}
                     </div>
                  </div>
               </div>

               <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-900 leading-relaxed">
                  <span className="font-bold">Nota del Experto:</span> {bd.explanation}
               </div>
            </div>

            {/* RIGHT: Actions & Calendar */}
            <div className="space-y-6">
               
               {/* Calendar Export Card */}
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors"></div>
                  
                  <div className="relative z-10">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                        <Calendar size={24} className="text-sky-300" />
                     </div>
                     <h3 className="text-xl font-bold mb-2">Sincronizar Calendario</h3>
                     <p className="text-slate-300 text-sm mb-6">
                        Exporta todo tu itinerario a Google Calendar, Outlook o Apple Calendar con un solo click.
                     </p>
                     <button 
                        onClick={handleExportCalendar}
                        className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
                     >
                        <Download size={18} /> Descargar .ICS
                     </button>
                  </div>
               </div>

               {/* Share Card */}
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                     <Share2 size={18} className="text-indigo-600" /> Compartir Viaje
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                     Envía este plan a tus compañeros de viaje.
                  </p>
                  <div className="flex gap-2">
                     <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-lg border border-slate-200 text-sm">
                        Copiar Link
                     </button>
                     <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 rounded-lg border border-emerald-200 text-sm">
                        WhatsApp
                     </button>
                  </div>
               </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalytics;
