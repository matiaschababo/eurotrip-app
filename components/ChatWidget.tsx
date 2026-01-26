
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, MapPin, Wand2, Loader2, CheckCircle2 } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { sendChatMessage, generateModificationOptions } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget = () => {
  const { itinerary, setItinerary, preferences, setPreferences, profile } = useTrip();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: '¡Hola! Soy tu experto en viajes. Puedo responder dudas o MODIFICAR tu itinerario actual si me lo pides (ej: "Agrega 2 días en Roma").', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAgentWorking, setIsAgentWorking] = useState(false); // New state for action execution
  const [agentAction, setAgentAction] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAgentWorking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Pass the CURRENT Itinerary as context for the model to see
    const response = await sendChatMessage(messages, input, itinerary || undefined);
    
    let finalText = response.text;

    // Handle Function Calls (The "Agent" Logic)
    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const call of response.functionCalls) {
        if (call.name === 'modifyItinerary') {
          const instruction = call.args.instruction;
          
          if (itinerary) {
             setLoading(false); // Stop text loading, start agent loading
             setIsAgentWorking(true);
             setAgentAction(`Procesando cambio: "${instruction}"...`);

             try {
                // Execute the modification logic (reuse existing service)
                const options = await generateModificationOptions(itinerary, instruction);
                
                if (options && options.length > 0) {
                   // Automatically apply the first (best) option
                   const bestOption = options[0];
                   
                   // SYNC DURATION: If the stops sum to a different number of nights, update global prefs
                   const totalNights = bestOption.modifiedItinerary.stops.reduce((acc, stop) => acc + stop.nights, 0);
                   
                   // If nights changed, update preferences so return date and file export are correct
                   if (totalNights !== preferences.durationDays) {
                      setPreferences({
                        ...preferences,
                        durationDays: totalNights
                      });
                   }

                   setItinerary(bestOption.modifiedItinerary);
                   
                   finalText = `✅ ¡Hecho! He actualizado tu itinerario: ${bestOption.description}. ¿Qué te parece?`;
                } else {
                   finalText = "Intenté modificar el itinerario pero no encontré una solución válida. ¿Podrías reformular el pedido?";
                }
             } catch (error) {
                console.error("Agent Error:", error);
                finalText = "Tuve un problema técnico aplicando los cambios. Intenta de nuevo.";
             }
             
             setIsAgentWorking(false);
             setAgentAction('');
          } else {
             finalText = "No puedo modificar el itinerario porque aún no has generado uno. Ve al paso de planificación primero.";
          }
        }
      }
    }
    
    const aiMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: finalText || "Entendido.", // Fallback if function call didn't generate text
      sources: response.sources,
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[550px] flex flex-col border border-slate-200 mb-4 overflow-hidden transition-all animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-300" />
              <span className="font-semibold">Agente EuroPlanner</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {/* Google Maps Sources Display */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                        <MapPin size={12} className="text-red-500" /> Google Maps:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <a 
                            key={idx} 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-slate-50 text-primary-600 px-2 py-1 rounded border border-slate-200 hover:bg-primary-50 hover:border-primary-200 transition-colors truncate max-w-full"
                          >
                            <MapPin size={10} />
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Agent Action Indicator */}
            {isAgentWorking && (
               <div className="flex justify-start animate-fade-in">
                  <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl rounded-tl-none text-sm text-indigo-800 flex items-center gap-3">
                     <Loader2 size={16} className="animate-spin text-indigo-600" />
                     <span className="font-medium">{agentAction}</span>
                  </div>
               </div>
            )}

            {/* Typing Indicator */}
            {loading && !isAgentWorking && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            {/* Quick Actions if Itinerary Exists */}
            {itinerary && messages.length < 3 && (
               <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
                  <button onClick={() => setInput("Agrega 1 día a París")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border border-slate-200">
                     +1 Día París
                  </button>
                  <button onClick={() => setInput("Elimina 1 noche en Roma")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border border-slate-200">
                     -1 Noche Roma
                  </button>
                  <button onClick={() => setInput("Cambia el orden para empezar por Roma")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border border-slate-200">
                     Empezar por Roma
                  </button>
               </div>
            )}

            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={itinerary ? "Ej: 'Quita Venecia y agrega Milán'..." : "Pregunta por lugares..."}
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-slate-50 focus:bg-white transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={loading || isAgentWorking || !input.trim()}
                className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isAgentWorking ? <Wand2 size={18} className="animate-pulse" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-primary-600 to-indigo-700 hover:from-primary-500 hover:to-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-900/30 transition-transform hover:scale-105 flex items-center justify-center relative group"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
        {!isOpen && itinerary && (
           <span className="absolute -top-1 -right-1 flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
           </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
