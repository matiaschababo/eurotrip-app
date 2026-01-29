import React, { useState, useEffect } from 'react';
import { MilestoneItem, MilestoneCategory } from '../types/milestones';
import { generateMilestones } from '../utils/milestonesGenerator';
import { CheckCircle2, Circle, Plane, Bed, MapPin, FileText, CheckSquare, RefreshCw, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'eurotrip_milestones_state';

const CategoryIcon = ({ category }: { category: MilestoneCategory }) => {
    switch (category) {
        case 'Transporte': return <Plane className="text-blue-500" size={20} />;
        case 'Hospedaje': return <Bed className="text-indigo-500" size={20} />;
        case 'Actividad': return <MapPin className="text-emerald-500" size={20} />;
        case 'Documentación': return <FileText className="text-amber-500" size={20} />;
        default: return <CheckSquare className="text-slate-500" size={20} />;
    }
};

const MilestonesView = () => {
    const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
    const [filter, setFilter] = useState<'ALL' | MilestoneCategory>('ALL');

    useEffect(() => {
        // Load from local storage or generate
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setMilestones(JSON.parse(saved));
            } catch (e) {
                console.error("Error parsing milestones", e);
                loadDefault();
            }
        } else {
            loadDefault();
        }
    }, []);

    const loadDefault = () => {
        const generated = generateMilestones();
        setMilestones(generated);
        save(generated);
    };

    const save = (items: MilestoneItem[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    const toggleMilestone = (id: string) => {
        const updated = milestones.map(m =>
            m.id === id ? { ...m, completed: !m.completed } : m
        );
        setMilestones(updated);
        save(updated);
    };

    const resetProgress = () => {
        if (confirm('¿Estás seguro de reiniciar todos los hitos? Se perderá el progreso.')) {
            loadDefault();
        }
    };

    // Stats
    const total = milestones.length;
    const completed = milestones.filter(m => m.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Grouping
    const filteredItems = filter === 'ALL'
        ? milestones
        : milestones.filter(m => m.category === filter);

    const categories: MilestoneCategory[] = ['Transporte', 'Hospedaje', 'Actividad', 'Documentación', 'General'];

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hitos & Checklist</h1>
                    <p className="text-lg text-slate-600">
                        Lista de tareas deducida de tu cronograma para que no olvides nada.
                    </p>
                </div>
                <button
                    onClick={resetProgress}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                >
                    <RefreshCw size={14} /> Reiniciar Lista
                </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-500 font-medium">Progreso Global</span>
                    <span className="text-2xl font-bold text-primary-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                        className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-2 text-xs text-slate-400 text-right">
                    {completed} de {total} completados
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Todos
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${filter === cat ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500 ring-offset-1' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <CategoryIcon category={cat} />
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filteredItems.map(item => (
                    <div
                        key={item.id}
                        onClick={() => toggleMilestone(item.id)}
                        className={`group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${item.completed
                                ? 'bg-slate-50 border-slate-200 opacity-60'
                                : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-md'
                            }`}
                    >
                        <div className={`mt-1 transition-colors ${item.completed ? 'text-green-500' : 'text-slate-300 group-hover:text-primary-400'}`}>
                            {item.completed ? <CheckCircle2 size={24} className="fill-green-50" /> : <Circle size={24} />}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryColor(item.category)}`}>
                                    {item.category}
                                </span>
                                {item.city && (
                                    <span className="text-xs text-slate-400 font-medium">• {item.city}</span>
                                )}
                                {item.dueDate && (
                                    <span className="text-xs text-slate-400 font-medium ml-auto">{item.dueDate}</span>
                                )}
                            </div>
                            <h3 className={`font-semibold text-lg ${item.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className={`text-sm mt-1 ${item.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <p>No hay hitos en esta categoría.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

const categoryColor = (cat: MilestoneCategory) => {
    switch (cat) {
        case 'Transporte': return 'bg-blue-100 text-blue-700';
        case 'Hospedaje': return 'bg-indigo-100 text-indigo-700';
        case 'Actividad': return 'bg-emerald-100 text-emerald-700';
        case 'Documentación': return 'bg-amber-100 text-amber-700';
        default: return 'bg-slate-100 text-slate-700';
    }
}

export default MilestonesView;
