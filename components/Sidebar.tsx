

import React from 'react';
import { Map, Calendar, Settings, MessageSquare, Home, CheckCircle, Briefcase, Compass, CalendarCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100';

  return (
    <div className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 transition-all duration-300 z-40">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
          EP
        </div>
        <span className="hidden lg:block font-bold text-slate-800 text-lg">EuroPlanner</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/')}`}>
          <Home size={20} />
          <span className="hidden lg:block">Inicio</span>
        </Link>
        <Link to="/wizard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/wizard')}`}>
          <Calendar size={20} />
          <span className="hidden lg:block">Planificar (Fase 1)</span>
        </Link>
        <Link to="/itinerary" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/itinerary')}`}>
          <Map size={20} />
          <span className="hidden lg:block">Mi Ruta</span>
        </Link>
        <Link to="/pre-trip" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/pre-trip')}`}>
          <Briefcase size={20} />
          <span className="hidden lg:block">Preparativos</span>
        </Link>
        <Link to="/schedule" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/schedule')}`}>
          <CalendarCheck size={20} />
          <span className="hidden lg:block">Cronograma</span>
        </Link>
        <Link to="/tips" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/tips')}`}>
          <Compass size={20} />
          <span className="hidden lg:block">Guía Experta</span>
        </Link>

        <div className="hidden lg:block px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Herramientas
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors text-left">
          <MessageSquare size={20} />
          <span className="hidden lg:block">Asistente IA</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 text-center lg:text-left">
            <span className="hidden lg:inline">Conectado como </span>
            <span className="font-semibold">Familia Rosario</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;