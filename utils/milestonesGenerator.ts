import { scheduleData } from '../data/scheduleData';
import { defaultTripSession } from '../data/defaultTrip';
import { MilestoneItem } from '../types/milestones';

const CITY_CODE_MAP: Record<string, string> = {
    'MAD': 'Madrid',
    'BCN': 'Barcelona',
    'PAR': 'París',
    'AMS': 'Ámsterdam',
    'BRU': 'Bruselas',
    'LON': 'Londres',
    'LIV': 'Liverpool',
    'DUB': 'Dublín',
    'ROS': 'Rosario',
    'EZE': 'Buenos Aires'
};

export const generateMilestones = (): MilestoneItem[] => {
    const milestones: MilestoneItem[] = [];
    let idCounter = 1;

    // 1. General Milestones (Always present)
    milestones.push(
        { id: `gen-${idCounter++}`, title: 'Verificar pasaportes (vigencia > 6 meses)', category: 'Documentación', completed: false },
        { id: `gen-${idCounter++}`, title: 'Contratar seguro de viaje Schengen', category: 'Documentación', completed: false },
        { id: `gen-${idCounter++}`, title: 'Habilitar tarjetas de crédito para uso en exterior', category: 'General', completed: false },
        { id: `gen-${idCounter++}`, title: 'Comprar E-SIM o plan de datos Europa', category: 'General', completed: false },
        { id: `gen-${idCounter++}`, title: 'Check-in online vuelos internacionales (24/48hs antes)', category: 'Transporte', completed: false }
    );

    // 2. Derive from Schedule
    scheduleData.forEach((item, index) => {
        // A. Transport Tasks
        if (item.transportType && item.transportType !== '-' && item.transportType !== 'N/A') {
            const from = item.origin;
            const to = item.destination || 'Destino';

            let title = `Transporte: ${item.transportType} ${from} ➝ ${to}`;
            if (item.transportType === 'Avión') title = `Check-in / Pasajes Vuelo ${from} ➝ ${to}`;
            if (item.transportType === 'Tren') title = `Pasajes Tren ${from} ➝ ${to}`;
            if (item.transportType === 'Combi') title = `Reserva Combi ${from} ➝ ${to}`;
            if (item.transportType === 'Taxi') title = `Coordinar Taxi/Transfer ${from} ➝ ${to}`;

            milestones.push({
                id: `trans-${index}`,
                title: title,
                description: `Salida: ${item.departureDate} ${item.departureTime}`,
                category: 'Transporte',
                completed: false,
                dueDate: item.departureDate,
                city: from
            });
        }

        // B. Accommodation Tasks
        if (item.isStay) {
            const city = item.origin;
            milestones.push({
                id: `stay-${index}`,
                title: `Alojamiento en ${city}`,
                description: `Estadía de ${item.nights} noches. Check-in: ${item.arrivalDate || item.departureDate}`,
                category: 'Hospedaje',
                completed: false,
                dueDate: item.arrivalDate || item.departureDate,
                city: city
            });

            // C. Specific City Milestones from defaultTrip
            // Try to find matching city in defaultTrip to pull specific activities
            const cityFullName = CITY_CODE_MAP[city] || city;

            // Look in itinerary stops
            const cityStop = defaultTripSession.itinerary.stops.find(s =>
                s.city.toLowerCase().includes(cityFullName.toLowerCase()) ||
                cityFullName.toLowerCase().includes(s.city.toLowerCase())
            );

            if (cityStop && cityStop.keyMilestones) {
                cityStop.keyMilestones.forEach((km, kmIndex) => {
                    // Avoid duplicates if regenerated (simple check)
                    milestones.push({
                        id: `act-${index}-${kmIndex}`,
                        title: km,
                        category: 'Actividad',
                        completed: false,
                        city: city,
                        description: `Hito sugerido para ${cityFullName}`
                    });
                });
            }
        }
    });

    return milestones;
};
