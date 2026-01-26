import React from 'react';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen relative">
        <Outlet />
        <ChatWidget />
      </main>
    </div>
  );
};

export default Layout;
