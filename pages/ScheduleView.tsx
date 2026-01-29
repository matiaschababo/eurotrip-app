import React from 'react';
import { Calendar, Plane, Train, Bus, Car, Clock, MapPin, Moon } from 'lucide-react';
import { scheduleData, totalNights } from '../data/scheduleData';
import { ScheduleItem } from '../types/schedule';

const TransportIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
        case 'avión': return <Plane size={16} />;
        case 'tren': return <Train size={16} />;
        case 'combi': return <Bus size={16} />; // Using Bus for Combi
        case 'bus': return <Bus size={16} />;
        case 'taxi': return <Car size={16} />;
        default: return <MapPin size={16} />;
    }
};

const ScheduleItemCard = ({ item }: { item: ScheduleItem }) => {
    const isStay = item.isStay;

    return (
        <div className={`relative pl-8 pb-8 border-l-2 ${isStay ? 'border-indigo-200' : 'border-slate-200'} last:border-0`}>
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${isStay ? 'bg-indigo-600 border-indigo-100' : 'bg-slate-400 border-slate-100'}`}></div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                    {/* Date & Time Info */}
                    <div className="min-w-[180px]">
                        <div className="flex items-center gap-2 text-primary-700 font-semibold mb-1">
                            <Calendar size={18} />
                            <span>{item.departureDate}</span>
                        </div>
                        {item.departureTime !== '-' && (
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Clock size={16} />
                                <span>{item.departureTime}</span>
                            </div>
                        )}
                    </div>

                    {/* Route Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg text-slate-800">{item.origin}</span>
                            {item.destination && (
                                <>
                                    <div className="h-px w-8 bg-slate-300"></div>
                                    <span className="font-bold text-lg text-slate-800">{item.destination}</span>
                                </>
                            )}
                        </div>

                        {/* Transport Details (if applicable) */}
                        {!item.isStay && item.transportType !== '-' && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                                <TransportIcon type={item.transportType} />
                                <span>{item.transportType}</span>
                                {item.travelTime && item.travelTime !== '-' && (
                                    <span className="text-slate-400 text-xs ml-1">• {item.travelTime}</span>
                                )}
                            </div>
                        )}

                        {/* Stay Details */}
                        {item.isStay && (
                            <div className="flex items-center gap-2 mt-2 text-indigo-600 font-medium">
                                <Moon size={18} />
                                <span>Estadía: {item.nights} noche{Number(item.nights) > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>

                    {/* Day Number Badge */}
                    <div className="hidden md:flex flex-col items-center justify-center bg-slate-50 rounded-lg p-2 min-w-[60px] border border-slate-100">
                        <span className="text-xs text-slate-400 uppercase font-bold">Día</span>
                        <span className="text-xl font-black text-slate-700">{item.dayNumber}</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

const ScheduleView = () => {
    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">

            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cronograma de Viaje</h1>
                <p className="text-lg text-slate-600">
                    Itinerario detallado día a día. Total de noches de hospedaje: <span className="font-bold text-primary-600">{totalNights}</span>.
                </p>
            </div>

            <div className="mt-8 bg-slate-50/50 rounded-3xl p-2">
                <div className="pt-4">
                    {scheduleData.map((item, index) => (
                        <ScheduleItemCard key={index} item={item} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ScheduleView;
