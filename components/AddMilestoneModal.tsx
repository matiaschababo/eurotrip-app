import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Check, Loader2, PlusCircle } from 'lucide-react';
import { ItineraryStop, DailyActivity } from '../types';
import { integrateMilestoneIntoDay } from '../services/geminiService';

interface AddMilestoneModalProps {
    itineraryStops: ItineraryStop[];
    onClose: () => void;
    onSave: (cityIndex: number, newPlan: DailyActivity[]) => void;
}

const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({ itineraryStops, onClose, onSave }) => {
    const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
    const [dayOffset, setDayOffset] = useState<number>(0); // 0 = first day in city
    const [time, setTime] = useState('12:00');
    const [activity, setActivity] = useState('');
    const [description, setDescription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const selectedStop = itineraryStops[selectedCityIndex];

    // Calculate relative day options based on nights
    const dayOptions = Array.from({ length: selectedStop.nights || 1 }, (_, i) => i);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activity.trim()) return;

        setIsProcessing(true);

        const newMilestone = {
            time,
            activity,
            description
        };

        // Filter activities for the selected day?
        // Currently the data model 'DailyActivity' doesn't strictly attribute to a specific calendar day in the array,
        // usually it's a flat list for the city or organized implicitly.
        // However, in 'geminiService.ts' reuse, we see 'DailyActivity' is just {time, activity, description}.
        // In 'ItineraryView', we map stops and show 'dailyPlan'.
        // The 'dailyPlan' is usually a list of activities for the WHOLE stay in that city.
        // So we pass the ENTIRE current plan for that city to the AI, and let it re-sort.

        // We must inform the AI which "Day" getting added to? 
        // Actually, 'integrateMilestoneIntoDay' assumes we are re-planning. 
        // If the dailyPlan covers multiple days, the AI needs to know WHERE to put it.
        // The prompt in 'integrateMilestoneIntoDay' just says "Insert... in correspondant time".
        // Does it account for multi-day?
        // Let's assume the user specifies "Day 2" in the text or we append " (Day X)" to the time if needed.
        // OR we act as if the user just gives a time, and the AI fits it.
        // But if stay is 3 days, 10:00 AM could be Day 1, 2 or 3.
        // Let's append the day info to the 'time' field sent to AI so it knows context, e.g. "Día 2 - 14:00"

        const timeWithDayContext = `Día ${dayOffset + 1} - ${time}`;

        const updatedPlan = await integrateMilestoneIntoDay(
            selectedStop.dailyPlan || [],
            { ...newMilestone, time: timeWithDayContext },
            selectedStop.city
        );

        onSave(selectedCityIndex, updatedPlan);
        setIsProcessing(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
                    <h2 className="font-bold flex items-center gap-2">
                        <PlusCircle size={20} /> Agregar Hito / Actividad
                    </h2>
                    <button onClick={onClose} disabled={isProcessing} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ciudad</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                            <select
                                value={selectedCityIndex}
                                onChange={(e) => { setSelectedCityIndex(Number(e.target.value)); setDayOffset(0); }}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium bg-slate-50 appearance-none"
                            >
                                {itineraryStops.map((stop, i) => (
                                    <option key={i} value={i}>{stop.city} ({stop.nights} noches)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Día</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-3 text-slate-400" />
                                <select
                                    value={dayOffset}
                                    onChange={(e) => setDayOffset(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium bg-slate-50 appearance-none"
                                >
                                    {dayOptions.map((d) => (
                                        <option key={d} value={d}>Día {d + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hora Aprox</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium bg-slate-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Actividad</label>
                        <input
                            type="text"
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            placeholder="Ej: Cena en Restaurante X"
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Detalles / Notas</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Reservar mesa para 2..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 h-20 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!activity.trim() || isProcessing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Integrando Inteligente...
                            </>
                        ) : (
                            <>
                                <Check size={18} />
                                Agregar al Itinerario
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-center text-slate-400">
                        La IA reorganizará el día para que tu hito encaje perfectamente.
                    </p>

                </form>
            </div>
        </div>
    );
};

export default AddMilestoneModal;
