import React from 'react';
import { Plane, Train, Bus, Car, MapPin, ArrowRight } from 'lucide-react';
import { ItineraryStop } from '../types';

interface RouteVisualizerProps {
  stops: ItineraryStop[];
  originCity: string;
}

const RouteVisualizer: React.FC<RouteVisualizerProps> = ({ stops, originCity }) => {
  const getTransportIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('avión') || t.includes('vuelo')) return <Plane size={14} />;
    if (t.includes('tren') || t.includes('ferro')) return <Train size={14} />;
    if (t.includes('bus') || t.includes('autobús')) return <Bus size={14} />;
    return <Car size={14} />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 overflow-hidden">
      <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MapPin className="text-primary-600" size={20} /> 
        Mapa de Ruta Lógica
      </h3>
      
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex items-center min-w-max px-4">
          
          {/* Origin Node */}
          <div className="flex flex-col items-center relative z-10 group">
            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 text-slate-500 flex items-center justify-center font-bold mb-3 shadow-sm group-hover:border-primary-400 transition-colors">
              ARG
            </div>
            <span className="font-bold text-slate-700 text-sm">{originCity}</span>
            <span className="text-xs text-slate-400">Inicio</span>
          </div>

          {/* International Flight Connector */}
          <div className="flex-1 w-24 h-[2px] bg-slate-300 mx-2 relative flex items-center justify-center">
            <div className="absolute -top-3 text-slate-400 animate-pulse">
              <Plane size={16} className="rotate-90" />
            </div>
          </div>

          {/* Stops Nodes */}
          {stops.map((stop, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center relative z-10 group cursor-default">
                <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg mb-3 shadow-lg shadow-primary-200 transform group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <span className="font-bold text-slate-800 text-sm">{stop.city}</span>
                <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-full mt-1">
                  {stop.nights} noches
                </span>
              </div>

              {/* Connector to next stop (if exists) */}
              {index < stops.length - 1 && (
                <div className="w-32 h-[2px] bg-slate-300 mx-2 relative flex items-center justify-center">
                  <div className="bg-white px-2 text-slate-400 border border-slate-200 rounded-full p-1">
                    {getTransportIcon(stop.transportToNext)}
                  </div>
                  <div className="absolute -bottom-5 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {stop.transportToNext}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* End Flag Connector */}
          <div className="w-24 h-[2px] bg-slate-300 mx-2 relative flex items-center justify-center border-t border-dashed">
             <ArrowRight size={14} className="text-slate-400" />
          </div>

          {/* End Node */}
          <div className="flex flex-col items-center relative z-10 opacity-60">
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400 flex items-center justify-center mb-3">
              <MapPin size={18} />
            </div>
            <span className="font-medium text-slate-500 text-xs">Regreso</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RouteVisualizer;