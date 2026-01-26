
import React, { useState, useRef } from 'react';
import { Image, Upload, Sparkles, Loader2, CheckCircle2, X } from 'lucide-react';
import { analyzeTripImage } from '../services/geminiService';

interface MultimodalInputProps {
  onAnalysisComplete: (data: any) => void;
}

const MultimodalInput: React.FC<MultimodalInputProps> = ({ onAnalysisComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      
      setPreview(base64String);
      setIsAnalyzing(true);
      
      // Call Gemini Vision Service
      const result = await analyzeTripImage(base64Data);
      
      setIsAnalyzing(false);
      if (result) {
        onAnalysisComplete(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={`
        relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 bg-white'}
        ${preview ? 'h-32' : 'h-40 md:h-48'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleChange} 
      />

      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>

      {isAnalyzing ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
          <p className="text-indigo-600 font-bold animate-pulse">Analizando tu imagen...</p>
          <p className="text-xs text-slate-400">Extrayendo fechas y destinos</p>
        </div>
      ) : preview ? (
        <div className="absolute inset-0 flex items-center justify-between p-4 bg-indigo-50/50">
           <div className="flex items-center gap-4">
              <img src={preview} alt="Upload preview" className="w-20 h-20 object-cover rounded-xl shadow-md border border-white" />
              <div>
                 <p className="font-bold text-indigo-900 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" /> Imagen Cargada
                 </p>
                 <p className="text-xs text-slate-500 max-w-[200px]">Gemini ha leído tu archivo. Revisa los campos completados.</p>
              </div>
           </div>
           <button onClick={handleClear} className="p-2 bg-white rounded-full shadow hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors">
             <X size={20} />
           </button>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className={`
             w-14 h-14 mb-4 rounded-2xl flex items-center justify-center transition-colors
             ${isDragging ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}
          `}>
             {isDragging ? <Upload size={28} /> : <Image size={28} />}
          </div>
          
          <h3 className="font-bold text-slate-700 mb-1 group-hover:text-indigo-700 transition-colors">
             Drop & Plan
          </h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Arrastra una captura de vuelo, post de Instagram o reserva.
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-2 py-1 rounded-full">
             <Sparkles size={10} className="text-yellow-300" /> Gemini Vision
          </div>
        </div>
      )}
    </div>
  );
};

export default MultimodalInput;
