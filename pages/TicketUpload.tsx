import React, { useState, useCallback } from 'react';
import { Upload, FileText, Check, AlertCircle, ArrowRight, Loader } from 'lucide-react';
import { analyzeTripImage } from '../services/geminiService';
import { useTrip } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

const TicketUpload = () => {
    const navigate = useNavigate();
    const { preferences, setPreferences, setStep } = useTrip();

    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Por favor sube una imagen (JPG, PNG). El soporte PDF vendrá pronto.');
            return;
        }

        setFile(file);
        setError(null);
        setAnalysisResult(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const analyzeTicket = async () => {
        if (!preview) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // Remove data:image/jpeg;base64, prefix
            const base64Data = preview.split(',')[1];
            const result = await analyzeTripImage(base64Data);

            if (result) {
                setAnalysisResult(result);
            } else {
                setError('No se pudo extraer información del ticket. Intenta con otra imagen más clara.');
            }
        } catch (err) {
            setError('Ocurrió un error al analizar la imagen.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const applyChanges = () => {
        if (!analysisResult) return;

        // Update Preferences
        const newPrefs = { ...preferences };

        if (analysisResult.startDate) newPrefs.startDate = analysisResult.startDate;
        if (analysisResult.endDate) newPrefs.endDate = analysisResult.endDate;

        // Update Duration based on dates
        if (analysisResult.startDate && analysisResult.endDate) {
            const start = new Date(analysisResult.startDate);
            const end = new Date(analysisResult.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            newPrefs.durationDays = diffDays;
        }

        // Add cities/countries if not present
        if (analysisResult.mustVisitCities) {
            analysisResult.mustVisitCities.forEach((city: string) => {
                if (!newPrefs.mustVisitCities.includes(city)) {
                    newPrefs.mustVisitCities.push(city);
                }
            });
        }

        // Flight Details
        if (analysisResult.flightDetails && analysisResult.flightDetails.hasFlight) {
            newPrefs.existingFlight = {
                hasFlight: true,
                arrivalCity: analysisResult.flightDetails.outbound?.arrivalCity || '',
                arrivalDate: analysisResult.flightDetails.outbound?.arrivalDate || '',
                arrivalTime: analysisResult.flightDetails.outbound?.arrivalTime || '',
                departureCity: analysisResult.flightDetails.inbound?.departureCity || '',
                departureDate: analysisResult.flightDetails.inbound?.departureDate || '',
                departureTime: analysisResult.flightDetails.inbound?.departureTime || ''
            };

            // Add constraints for these cities
            if (newPrefs.existingFlight.arrivalCity) {
                // Remove existing constraint for this city if any
                newPrefs.cityConstraints = newPrefs.cityConstraints.filter(c => c.city !== newPrefs.existingFlight.arrivalCity);
                // Add START constraint
                newPrefs.cityConstraints.push({
                    city: newPrefs.existingFlight.arrivalCity,
                    fixedNights: null,
                    visitOrder: 'START'
                });

                // Ensure it's in mustVisit
                if (!newPrefs.mustVisitCities.includes(newPrefs.existingFlight.arrivalCity)) {
                    newPrefs.mustVisitCities.push(newPrefs.existingFlight.arrivalCity);
                }
            }

            if (newPrefs.existingFlight.departureCity) {
                // Remove existing constraint for this city if any
                newPrefs.cityConstraints = newPrefs.cityConstraints.filter(c => c.city !== newPrefs.existingFlight.departureCity);
                // Add END constraint
                newPrefs.cityConstraints.push({
                    city: newPrefs.existingFlight.departureCity,
                    fixedNights: null,
                    visitOrder: 'END'
                });

                // Ensure it's in mustVisit
                if (!newPrefs.mustVisitCities.includes(newPrefs.existingFlight.departureCity)) {
                    newPrefs.mustVisitCities.push(newPrefs.existingFlight.departureCity);
                }
            }
        }

        setPreferences(newPrefs);

        // Redirect to Wizard or Itinerary to regenerate
        // Assuming Step 2 or 3 is where we review preferences
        setStep(2); // Go to "Review" step presumably, or wherever preferences are shown
        navigate('/wizard');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Mis Pasajes</h1>
                <p className="text-slate-600">Sube tus tickets de avión y dejaré todo listo para tu viaje.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div className="space-y-4">
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors h-64 cursor-pointer
              ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'}
              ${preview ? 'bg-slate-50' : ''}
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input')?.click()}
                    >
                        <input
                            type="file"
                            id="file-input"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileInput}
                        />

                        {preview ? (
                            <img src={preview} alt="Preview" className="h-full object-contain rounded-lg" />
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                                    <Upload size={32} />
                                </div>
                                <h3 className="font-semibold text-slate-900">Arrastra tu ticket aquí</h3>
                                <p className="text-sm text-slate-500 mt-2">o haz click para buscar</p>
                                <p className="text-xs text-slate-400 mt-4">Soporta JPG, PNG (Screenshots)</p>
                            </>
                        )}
                    </div>

                    <button
                        onClick={analyzeTicket}
                        disabled={!file || isAnalyzing}
                        className={`w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${!file || isAnalyzing
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-primary-500/25'}
            `}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Analizando...
                            </>
                        ) : (
                            <>
                                <FileText size={20} />
                                Analizar Pasaje
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                {/* Results Area */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                        <Check className="text-green-500" size={20} />
                        Datos Detectados
                    </h3>

                    {!analysisResult ? (
                        <div className="text-center py-12 text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={24} className="opacity-50" />
                            </div>
                            <p>Sube un pasaje para ver la magia.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                                {analysisResult.detectedContext}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Origen</span>
                                    <span className="font-medium text-slate-900">{analysisResult.originCity || 'No detectado'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">Fechas</span>
                                    <span className="font-medium text-slate-900">
                                        {analysisResult.startDate} - {analysisResult.endDate}
                                    </span>
                                </div>

                                {analysisResult.flightDetails?.hasFlight && (
                                    <>
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-xs uppercase text-slate-500 tracking-wider mb-2">Vuelo Ida</h4>
                                            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                                                <div className="flex justify-between mb-1">
                                                    <span>Llegada a</span>
                                                    <span className="font-bold">{analysisResult.flightDetails.outbound.arrivalCity}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-500">
                                                    <span>{analysisResult.flightDetails.outbound.arrivalDate}</span>
                                                    <span>{analysisResult.flightDetails.outbound.arrivalTime}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <h4 className="font-semibold text-xs uppercase text-slate-500 tracking-wider mb-2">Vuelo Vuelta</h4>
                                            <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                                                <div className="flex justify-between mb-1">
                                                    <span>Salida de</span>
                                                    <span className="font-bold">{analysisResult.flightDetails.inbound.departureCity}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-500">
                                                    <span>{analysisResult.flightDetails.inbound.departureDate}</span>
                                                    <span>{analysisResult.flightDetails.inbound.departureTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={applyChanges}
                                className="w-full mt-6 py-3 px-6 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/25"
                            >
                                Aplicar y Planificar
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketUpload;
