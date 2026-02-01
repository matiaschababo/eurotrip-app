
import React, { createContext, useContext, useState, ReactNode, PropsWithChildren, useEffect, useRef } from 'react';
import { TravelerProfile, TripPreferences, GeneratedItinerary, TripStyle, TravelSeason, TripSession, TravelerGuide, TripRequirements, ModificationOption } from '../types';

interface TripContextType {
  step: number;
  setStep: (step: number) => void;
  profile: TravelerProfile;
  setProfile: (p: TravelerProfile) => void;
  preferences: TripPreferences;
  setPreferences: (p: TripPreferences) => void;
  itinerary: GeneratedItinerary | null;
  setItinerary: (i: GeneratedItinerary | null) => void;
  availableRoutes: GeneratedItinerary[];
  setAvailableRoutes: (routes: GeneratedItinerary[]) => void;
  travelerGuide: TravelerGuide | null;
  setTravelerGuide: (g: TravelerGuide | null) => void;
  tripRequirements: TripRequirements | null;
  setTripRequirements: (r: TripRequirements | null) => void;
  isGenerating: boolean;
  setIsGenerating: (b: boolean) => void;
  loadSession: (session: TripSession) => void;
  exportSession: () => TripSession;
  aiChatHistory: ModificationOption[];
  setAiChatHistory: (options: ModificationOption[]) => void;
}

import { defaultTripSession } from '../data/defaultTrip';

// Constants
const defaultProfile: TravelerProfile = {
  adults: 2,
  children: 0,
  originCity: 'Buenos Aires',
  flexibleOrigin: false,
};

const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const defaultPreferences: TripPreferences = {
  startDate: getFutureDate(30),
  endDate: getFutureDate(45),
  durationDays: 15,
  season: TravelSeason.SPRING,
  style: TripStyle.CULTURAL,
  mustVisitCountries: [],
  mustVisitCities: [],
  cityConstraints: [],
  budgetLevel: 'Medio',
  interests: [],
  specificRequests: '',
  creditCard: '',
  existingFlight: {
    hasFlight: false,
    arrivalCity: '',
    arrivalDate: getFutureDate(30),
    arrivalTime: '10:00',
    departureCity: '',
    departureDate: getFutureDate(45),
    departureTime: '18:00'
  }
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: PropsWithChildren<{}>) => {

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<TravelerProfile>(defaultProfile);
  const [preferences, setPreferences] = useState<TripPreferences>(defaultPreferences);
  const [itinerary, setItineraryState] = useState<GeneratedItinerary | null>(null);
  const [availableRoutes, setAvailableRoutes] = useState<GeneratedItinerary[]>([]);
  const [travelerGuide, setTravelerGuide] = useState<TravelerGuide | null>(null);
  const [tripRequirements, setTripRequirements] = useState<TripRequirements | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<ModificationOption[]>([]);

  // Load default session on mount
  useEffect(() => {
    // We cast it to TripSession because the JSON import might inferred slightly differently
    loadSession(defaultTripSession as unknown as TripSession);
  }, []);

  const [sessionCreatedAt, setSessionCreatedAt] = useState<number>(Date.now());
  const lastItineraryId = useRef<string | null>(null);

  // Logic: Reset secondary data ONLY if the itinerary identity (ID) changes significantly
  const setItinerary = (newItinerary: GeneratedItinerary | null) => {
    if (newItinerary && newItinerary.id !== lastItineraryId.current) {
      // If it's a completely new itinerary (different ID), we should probably clear the old guide
      // but the user might want to keep it if they just made a small edit.
      // For now, let's keep it but mark for regeneration if the user desires.
      // As requested: "En el unico momento donde se tendrian que volver a generar es si cambio algo del itinerario principal."
      setTravelerGuide(null);
      setTripRequirements(null);
      lastItineraryId.current = newItinerary.id;
    }
    setItineraryState(newItinerary);

    if (newItinerary && availableRoutes.length > 0) {
      setAvailableRoutes(prevRoutes =>
        prevRoutes.map(route => route.id === newItinerary.id ? newItinerary : route)
      );
    }
  };

  const loadSession = (session: TripSession) => {
    setSessionCreatedAt(session.createdAt || Date.now());
    setProfile(session.profile);
    setPreferences(session.preferences);
    setItineraryState(session.itinerary);
    setAvailableRoutes(session.availableRoutes || []);
    setTravelerGuide(session.travelerGuide || null);
    setTripRequirements(session.tripRequirements || null);

    if (session.itinerary) {
      lastItineraryId.current = session.itinerary.id;
      setStep(4);
    }
  };

  const exportSession = (): TripSession => {
    return {
      createdAt: sessionCreatedAt,
      lastModified: Date.now(),
      profile,
      preferences,
      itinerary,
      availableRoutes,
      travelerGuide,
      tripRequirements,
      version: '1.6'
    };
  };

  return (
    <TripContext.Provider value={{
      step, setStep,
      profile, setProfile,
      preferences, setPreferences,
      itinerary, setItinerary,
      availableRoutes, setAvailableRoutes,
      travelerGuide, setTravelerGuide,
      tripRequirements, setTripRequirements,
      isGenerating, setIsGenerating,
      loadSession, exportSession,
      aiChatHistory, setAiChatHistory
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
