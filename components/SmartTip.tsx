import React from 'react';
import { Sparkles, Lightbulb, X, Info, Compass } from 'lucide-react';

interface SmartTipProps {
  text: string;
  type?: 'insight' | 'alert' | 'tip';
  onClose?: () => void;
  className?: string;
}

const SmartTip: React.FC<SmartTipProps> = ({ text, type = 'insight', onClose, className = '' }) => {
  const config = {
    insight: {
      bg: 'bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-100',
      iconBg: 'bg-violet-100 text-violet-600',
      icon: Sparkles,
      title: 'AI Insight'
    },
    alert: {
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100',
      iconBg: 'bg-amber-100 text-amber-700',
      icon: Info,
      title: 'Dato Importante'
    },
    tip: {
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: Compass,
      title: 'Consejo de Viaje'
    }
  };

  const style = config[type];
  const Icon = style.icon;

  if (!text) return null;

  return (
    <div className={`relative group rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 ${style.bg} ${className}`}>
      <div className="flex gap-4 items-start">
        <div className={`shrink-0 w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shadow-sm`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-wider opacity-70 mb-1.5 flex items-center gap-2`}>
            {style.title}
          </p>
          <p className="text-slate-700 text-sm font-medium leading-relaxed">
            {text}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-black/5 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SmartTip;