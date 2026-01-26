
import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, FileText, Loader2, X } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const BookingWallet = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate analysis
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setUploadStatus('idle');
    
    // Simulación de Gemini Vision procesando un PDF/Imagen
    setTimeout(() => {
       setIsAnalyzing(false);
       setUploadStatus('success');
       setStatusMessage('Vuelo a Madrid detectado. Coincide con Día 1. ¡Confirmado!');
    }, 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 overflow-hidden relative">
       <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
             <FileText className="text-indigo-600" /> Travel Wallet
          </h3>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase">Beta</span>
       </div>

       <div 
          className={`
             border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer
             ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}
             ${uploadStatus === 'success' ? 'bg-emerald-50 border-emerald-200' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={simulateAnalysis}
       >
          {isAnalyzing ? (
             <div className="py-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold text-indigo-900">Leyendo documento...</p>
             </div>
          ) : uploadStatus === 'success' ? (
             <div className="py-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-700">{statusMessage}</p>
                <button onClick={(e) => { e.stopPropagation(); setUploadStatus('idle'); }} className="text-[10px] underline text-slate-400 mt-2">Subir otro</button>
             </div>
          ) : (
             <div className="py-2">
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">Arrastra tus Reservas</p>
                <p className="text-[10px] text-slate-400">PDFs de vuelos, Airbnb o entradas.</p>
             </div>
          )}
       </div>
       
       {/* Stats */}
       <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-2 bg-slate-50 rounded-lg">
             <div className="text-xl font-black text-slate-800">0</div>
             <div className="text-[9px] font-bold text-slate-400 uppercase">Docs</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
             <div className="text-xl font-black text-slate-800">0%</div>
             <div className="text-[9px] font-bold text-slate-400 uppercase">Booked</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
             <div className="text-xl font-black text-emerald-500">OK</div>
             <div className="text-[9px] font-bold text-slate-400 uppercase">Status</div>
          </div>
       </div>
    </div>
  );
};

export default BookingWallet;
