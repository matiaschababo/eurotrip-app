import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 overflow-y-auto h-screen relative flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              EP
            </div>
            <span className="font-bold text-slate-800 text-lg">EuroPlanner</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 relative">
          <Outlet />
        </div>

        <ChatWidget />
      </main>
    </div>
  );
};

export default Layout;
