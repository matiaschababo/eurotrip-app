export interface ScheduleItem {
    dayNumber: number;
    departureDate: string;
    departureTime: string;
    origin: string;
    destination: string;
    transportType: 'Avión' | 'Tren' | 'Combi' | 'Taxi' | 'Bus' | '-';
    travelTime: string;
    arrivalDate: string;
    arrivalTime: string;
    nights?: number | string;
    isStay?: boolean; // Helper to identify rows that represent a stay
}

export interface ScheduleData {
    items: ScheduleItem[];
    totalNights: number;
}
