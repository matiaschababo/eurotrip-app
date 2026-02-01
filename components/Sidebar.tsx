import React from 'react';
import { Map, Calendar, Settings, MessageSquare, Home, CheckCircle, Briefcase, Compass, CalendarCheck, CheckSquare, X, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-100';

  // Desktop: Static sidebar. Mobile: slide-over drawer
  // lg:static means on desktop it returns to normal flow
  // lg:translate-x-0 ensures it's visible on desktop
  const containerClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-screen transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:z-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      <div className={containerClasses}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100 h-16 lg:h-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              EP
            </div>
            <span className="font-bold text-slate-800 text-lg">EuroPlanner</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 p-1">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link onClick={onClose} to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/')}`}>
            <Home size={20} />
            <span>Inicio</span>
          </Link>
          <Link onClick={onClose} to="/wizard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/wizard')}`}>
            <Calendar size={20} />
            <span>Planificar</span>
          </Link>
          <Link onClick={onClose} to="/tickets" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/tickets')}`}>
            <FileText size={20} />
            <span>Mis Pasajes</span>
          </Link>
          <Link onClick={onClose} to="/itinerary" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/itinerary')}`}>
            <Map size={20} />
            <span>Mi Ruta</span>
          </Link>
          <Link onClick={onClose} to="/pre-trip" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/pre-trip')}`}>
            <Briefcase size={20} />
            <span>Preparativos</span>
          </Link>
          <Link onClick={onClose} to="/schedule" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/schedule')}`}>
            <CalendarCheck size={20} />
            <span>Cronograma</span>
          </Link>
          <Link onClick={onClose} to="/milestones" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/milestones')}`}>
            <CheckSquare size={20} />
            <span>Hitos & Checklist</span>
          </Link>
          <Link onClick={onClose} to="/tips" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/tips')}`}>
            <Compass size={20} />
            <span>Guía Experta</span>
          </Link>

          <div className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Herramientas
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors text-left">
            <MessageSquare size={20} />
            <span>Asistente IA</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs text-slate-500 text-center lg:text-left">
              <span className="lg:inline">Conectado como </span>
              <span className="font-semibold block lg:inline">Familia Rosario</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;