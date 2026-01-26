
export enum TripStyle {
  RELAXED = 'Relajado',
  ADVENTURE = 'Aventura',
  CULTURAL = 'Cultural',
  LUXURY = 'Lujo',
  BUDGET = 'Económico',
  FAMILY = 'Familiar'
}

export enum TravelSeason {
  SPRING = 'Primavera',
  SUMMER = 'Verano',
  AUTUMN = 'Otoño',
  WINTER = 'Invierno'
}

export interface TravelerProfile {
  adults: number;
  children: number;
  originCity: string;
  flexibleOrigin: boolean;
}

export interface FixedFlightDetails {
  hasFlight: boolean;
  arrivalCity: string;      // Ciudad de llegada en Europa (ej: Madrid)
  arrivalDate: string;
  arrivalTime: string;      // Hora de llegada del vuelo
  departureCity: string;    // Ciudad de regreso desde Europa (ej: Roma)
  departureDate: string;
  departureTime: string;    // Hora de salida del vuelo
}

export interface CityConstraint {
  city: string;
  fixedNights: number | null; // null means AI decides
  visitOrder: 'START' | 'END' | 'ANY';
}

export interface TripPreferences {
  startDate: string; // ISO String YYYY-MM-DD
  endDate: string;   // ISO String YYYY-MM-DD
  durationDays: number;
  season: TravelSeason;
  style: TripStyle;
  mustVisitCountries: string[];
  mustVisitCities: string[]; 
  cityConstraints: CityConstraint[]; // Nuevo campo para control fino
  budgetLevel: 'Bajo' | 'Medio' | 'Alto';
  interests: string[]; 
  specificRequests: string; 
  creditCard: string;
  existingFlight: FixedFlightDetails;
}

export interface DailyActivity {
  time: string;
  activity: string;
  description: string;
  bookingStatus?: 'PLANNED' | 'BOOKED' | 'CONFIRMED';
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ItineraryStop {
  city: string;
  country: string;
  arrivalDay: number;
  departureDay: number;
  nights: number;
  coordinates: Coordinates;
  
  // EXPLICIT LOGISTICS TIMES
  arrivalTime: string;   // "14:30 PM" (Hora de llegada a ESTA ciudad)
  departureTime: string; // "10:00 AM" (Hora de salida de ESTA ciudad hacia la siguiente)

  // LOGISTICS TO NEXT STOP
  transportToNext: string; // Mode (Train, Flight, etc)
  transportDuration: string; // e.g. "3h 45m"
  transportTime: string; // Legacy field, mapped to departureTime usually
  transportDescription: string; // Detailed logic "Train from Atocha to Sants"
  
  transportDetails: string; // Legacy/Fallback
  highlights: string[];
  keyMilestones: string[]; 
  dailyPlan: DailyActivity[]; 
  estimatedCost: string;
  bookingStatus?: 'NONE' | 'PARTIAL' | 'FULL';
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  shopping: number;
  currency: string;
  explanation: string;
}

export interface GeneratedItinerary {
  id: string;
  comparisonLabel: string;
  tripTitle: string;
  summary: string;
  stops: ItineraryStop[];
  totalEstimatedCostUSD: string;
  budgetBreakdown: BudgetBreakdown; 
  tipsForArgentinians: string[];
  efficiencyStats?: {
    transitTimeHours: number;
    enjoymentTimeHours: number;
    transitPercentage: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: { title: string; url: string }[];
}

export interface FlightSegment {
  airline: string;
  flightNumber: string; 
  departureCity: string;
  departureIata: string; 
  arrivalCity: string;
  arrivalIata: string; 
  duration: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  price: string;
  agentTip: string; 
  source: string; 
  creditCardPerk?: string; 
  qualityScore: number; 
  priceAnalysis: 'Bargain' | 'Fair' | 'Expensive';
  emissionsEstimate: string; 
  outbound: FlightSegment;
  inbound: FlightSegment;
  bookingLink: string; 
}

export interface DayPlan {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface AccommodationOption {
  id: string;
  name: string;
  type: 'HOTEL' | 'AIRBNB';
  description: string;
  pricePerNight: string;
  rating: string;
  matchScore: number; 
  pros: string[];
  cons: string[];
  features: string[];
  location: string;
  bookingLink: string;
}

export interface CityDetails {
  cityName: string;
  bestAreasToStay: string; 
  transportationTips: string; 
  dayByDay: DayPlan[];
  packingAdvice: {
    clothing: string[];
    essentials: string[];
  };
  accommodations: {
    hotels: AccommodationOption[];
    airbnbs: AccommodationOption[];
  };
}

export interface ModificationOption {
  id: string;
  title: string;
  description: string;
  impactOnBudget: string; 
  impactOnPace: string; 
  modifiedItinerary: GeneratedItinerary;
}

// --- PRE-TRIP HUB ---

export interface Phrase {
  original: string;
  translated: string;
  pronunciation: string;
}

export interface LanguageKit {
  language: string;
  phrases: Phrase[];
}

export interface TripRequirements {
  visaInfo: {
    title: string;
    details: string;
    isEtiasRequired: boolean;
  };
  healthInfo: {
    vaccinations: string;
    insuranceAdvice: string;
  };
  currencyStrategy: {
    currencies: string[];
    tips: string; 
  };
  techSpecs: {
    plugTypes: string[]; 
    voltage: string;
    adapterAdvice: string;
  };
  survivalPhrases: LanguageKit[];
  safetyTips: string[];
}

// --- NEW: EXPERT GUIDE ---

export interface CityExpertGuide {
  city: string;
  localTransport: {
    bestApp: string; 
    ticketTip: string; 
    costEstimate: string;
  };
  moneyTactics: {
    tipping: string; 
    cashOrCard: string; 
  };
  safetyAlerts: string[]; 
  hiddenGems: string[]; 
  foodieTips: string; 
}

export interface TravelerGuide {
  generalTips: string[];
  cityGuides: CityExpertGuide[];
}

// --- SESSION PERSISTENCE ---

export interface TripSession {
  createdAt: number;
  lastModified: number;
  profile: TravelerProfile;
  preferences: TripPreferences;
  itinerary: GeneratedItinerary | null;
  availableRoutes: GeneratedItinerary[];
  travelerGuide: TravelerGuide | null; 
  tripRequirements: TripRequirements | null; // Nuevo campo persistente
  version: string;
}

export interface BookingDocument {
  id: string;
  type: 'FLIGHT' | 'HOTEL' | 'ACTIVITY';
  status: 'CONFIRMED' | 'PENDING';
  filePreview?: string;
  details: string;
}
