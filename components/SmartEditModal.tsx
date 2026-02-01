
import React, { useState, useEffect } from 'react';
import { X, Wand2, ArrowRight, Sparkles, Split, Timer, Wallet, CheckCircle2 } from 'lucide-react';
import { GeneratedItinerary, ModificationOption } from '../types';
import { generateModificationOptions } from '../services/geminiService';
import { useTrip } from '../context/TripContext';

interface SmartEditModalProps {
  currentItinerary: GeneratedItinerary;
  initialPrompt?: string;
  onSave: (newItinerary: GeneratedItinerary) => void;
  onClose: () => void;
}

const SmartEditModal: React.FC<SmartEditModalProps> = ({ currentItinerary, initialPrompt, onSave, onClose }) => {
  const { aiChatHistory, setAiChatHistory } = useTrip();

  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [isProcessing, setIsProcessing] = useState(false);
  // Remove local options state, use context
  const [view, setView] = useState<'input' | 'options'>(aiChatHistory.length > 0 ? 'options' : 'input');

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    const generatedOptions = await generateModificationOptions(currentItinerary, prompt);
    // Persist to context
    setAiChatHistory(generatedOptions);

    setView('options');
    setIsProcessing(false);
  };

  const handleSelectOption = (option: ModificationOption) => {
    onSave(option.modifiedItinerary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="text-yellow-300" /> Agente de Viajes IA
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                {view === 'input' ? 'Pide cambios globales o específicos y te daré opciones.' : 'He rediseñado tu ruta con estas estrategias:'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

          {view === 'input' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  ¿Qué cambios deseas hacer hoy?
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Eliminar Venecia y agregar 2 días a Roma, o cambiar Italia por Grecia..."
                    className="w-full h-40 p-5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none resize-none text-slate-800 text-lg bg-white shadow-sm"
                    disabled={isProcessing}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                    Puedo recalcular fechas, costos y transporte.
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Acciones Rápidas (Globales)</h4>
                <div className="flex flex-wrap gap-2">
                  {["Cambiar Italia por España", "Eliminar Londres", "Reducir presupuesto a 'Bajo'", "Hacer el viaje más relajado"].map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(sug)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg text-sm font-medium border border-slate-200 hover:border-indigo-200 transition-colors"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'options' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="font-bold text-slate-700">Tu pedido:</span> "{prompt}"
                <button onClick={() => setView('input')} className="text-indigo-600 underline ml-auto">Editar pedido</button>
              </div>

              {aiChatHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No se encontraron opciones viables. Intenta reformular.</div>
              ) : (
                <div className="grid gap-4">
                  {aiChatHistory.map((opt, idx) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      className="group relative bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:shadow-xl transition-all text-left w-full overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>

                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt.title}
                        </h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
                          <CheckCircle2 size={24} />
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {opt.description}
                      </p>

                      <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          <Wallet size={14} /> {opt.impactOnBudget}
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          <Timer size={14} /> {opt.impactOnPace}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
          {view === 'input' ? (
            <>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAnalyze}
                disabled={!prompt.trim() || isProcessing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Recalculando Ruta...
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    Aplicar Cambios
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <p className="text-xs text-slate-400 font-medium">Selecciona la mejor estrategia para actualizar tu itinerario</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SmartEditModal;
