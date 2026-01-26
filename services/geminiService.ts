
import { GoogleGenAI, Type, Schema, FunctionDeclaration } from "@google/genai";
import { TripPreferences, TravelerProfile, GeneratedItinerary, ChatMessage, FlightOption, CityDetails, TravelSeason, TripStyle, ModificationOption, TripRequirements, TripSession, AccommodationOption, TravelerGuide, DailyActivity } from "../types";

const FLASH_MODEL = "gemini-2.5-flash";
const PRO_MODEL = "gemini-3-pro-preview";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Common definitions to be reused
const stopSchemaProperties = {
  city: { type: Type.STRING },
  country: { type: Type.STRING },
  arrivalDay: { type: Type.INTEGER },
  departureDay: { type: Type.INTEGER },
  nights: { type: Type.INTEGER },
  coordinates: {
    type: Type.OBJECT,
    properties: {
      lat: { type: Type.NUMBER },
      lng: { type: Type.NUMBER }
    },
    required: ["lat", "lng"],
    description: "Coordenadas exactas para plotear en mapa"
  },
  
  // EXPLICIT TIMES
  arrivalTime: { type: Type.STRING, description: "Hora de llegada estimada a ESTA ciudad (ej: '14:00'). IMPORTANTE: Si es la primera ciudad, DEBE coincidir con la hora de aterrizaje del vuelo." },
  departureTime: { type: Type.STRING, description: "Hora de salida de ESTA ciudad hacia la siguiente (ej: '10:00')." },

  // LOGISTICS REFACTOR
  transportToNext: { type: Type.STRING, description: "Medio de transporte PRINCIPAL hacia la SIGUIENTE parada (ej: Tren Alta Velocidad, Vuelo Low Cost)" },
  transportDuration: { type: Type.STRING, description: "Duración exacta del traslado (ej: '3h 45m'). Sé realista." },
  transportTime: { type: Type.STRING, description: "Legacy: Same as departureTime." },
  transportDescription: { type: Type.STRING, description: "Detalle EXPLICITO de origen y destino del tramo. Ej: 'Tren Italo desde Roma Termini hacia Florencia SMN'." },
  transportDetails: { type: Type.STRING, description: "Legacy field, same as transportDescription" },

  highlights: {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: "3 atracciones imperdibles"
  },
  keyMilestones: {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: "3-5 acciones CRÍTICAS y CONCRETAS (ej: 'Reservar entrada al Louvre 2 meses antes')."
  },
  dailyPlan: {
    type: Type.ARRAY,
    description: "Agenda con horarios específicos.",
    items: {
      type: Type.OBJECT,
      properties: {
        time: { type: Type.STRING, description: "Horario específico ej: '09:00 - 11:30' o '20:00'" },
        activity: { type: Type.STRING, description: "Título de la actividad" },
        description: { type: Type.STRING, description: "Descripción breve." }
      }
    }
  },
  estimatedCost: { type: Type.STRING, description: "Presupuesto diario sugerido para esta ciudad" }
};

const budgetBreakdownSchema = {
  type: Type.OBJECT,
  properties: {
    accommodation: { type: Type.NUMBER, description: "Total estimado en alojamiento (USD)" },
    food: { type: Type.NUMBER, description: "Total estimado en comida (USD)" },
    transport: { type: Type.NUMBER, description: "Total estimado en transporte interno (USD)" },
    activities: { type: Type.NUMBER, description: "Total estimado en entradas/tours (USD)" },
    shopping: { type: Type.NUMBER, description: "Reserva estimada para compras/extras (USD)" },
    currency: { type: Type.STRING, description: "Moneda base (USD/EUR)" },
    explanation: { type: Type.STRING, description: "Breve explicación del cálculo." }
  },
  required: ["accommodation", "food", "transport", "activities", "shopping", "currency", "explanation"]
};

const singleItineraryStructure = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    comparisonLabel: { type: Type.STRING, description: "Etiqueta breve para comparar (ej: 'Más Económica', 'Mejor Clima', 'Ruta Clásica')" },
    tripTitle: { type: Type.STRING, description: "Un nombre creativo y evocador" },
    summary: { type: Type.STRING, description: "Resumen narrativo explicando por qué esta ruta es ideal para las fechas seleccionadas." },
    totalEstimatedCostUSD: { type: Type.STRING, description: "Costo estimado TOTAL DEL GRUPO (todos los pasajeros) en USD. Suma todo." },
    budgetBreakdown: budgetBreakdownSchema,
    tipsForArgentinians: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Consejos financieros y culturales"
    },
    efficiencyStats: {
      type: Type.OBJECT,
      properties: {
        transitTimeHours: { type: Type.NUMBER, description: "Horas totales pasadas en aviones/trenes" },
        enjoymentTimeHours: { type: Type.NUMBER, description: "Horas totales despierto disfrutando destino" },
        transitPercentage: { type: Type.NUMBER, description: "Porcentaje del viaje gastado en transporte (0-100)" }
      }
    },
    stops: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: stopSchemaProperties,
        required: ["city", "country", "nights", "coordinates", "highlights", "keyMilestones", "transportToNext", "transportDuration", "transportTime", "transportDescription", "dailyPlan", "estimatedCost", "arrivalTime", "departureTime"]
      }
    }
  },
  required: ["id", "comparisonLabel", "tripTitle", "summary", "stops", "tipsForArgentinians", "totalEstimatedCostUSD", "budgetBreakdown"]
};

const multiItinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      items: singleItineraryStructure,
      description: "3 opciones de itinerarios completas y distintas entre sí."
    }
  },
  required: ["options"]
};

export const generateTripPlan = async (
  profile: TravelerProfile,
  prefs: TripPreferences
): Promise<GeneratedItinerary[] | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  // Build Constraint String
  let constraintInstruction = "";
  if (prefs.existingFlight.hasFlight) {
    constraintInstruction = `
      *** RESTRICCIÓN CRÍTICA DE VUELOS CONFIRMADOS ***
      El usuario YA TIENE PASAJES comprados con HORARIOS EXACTOS:
      
      1. VUELO DE IDA (Llegada a Europa):
         - Ciudad: ${prefs.existingFlight.arrivalCity}
         - Fecha: ${prefs.existingFlight.arrivalDate}
         - HORA ATERRIZAJE: ${prefs.existingFlight.arrivalTime}
         --> REGLA: La primera parada en el itinerario DEBE ser ${prefs.existingFlight.arrivalCity}. 
         --> REGLA: El 'arrivalTime' de la primera parada DEBE ser ${prefs.existingFlight.arrivalTime}.
         --> REGLA DE NOCHE TARDÍA: Si el vuelo llega después de las 21:00 (9 PM), la primera noche en esa ciudad cuenta como NOCHE DE TRÁNSITO/AEROPUERTO (0 noches turísticas). El itinerario real comienza al día siguiente.

      2. VUELO DE VUELTA (Salida de Europa):
         - Ciudad: ${prefs.existingFlight.departureCity}
         - Fecha: ${prefs.existingFlight.departureDate}
         - HORA DESPEGUE: ${prefs.existingFlight.departureTime}
         --> REGLA: El itinerario debe terminar en ${prefs.existingFlight.departureCity}.
         --> REGLA: Calcula el traslado final para estar en el aeropuerto 3 horas antes de las ${prefs.existingFlight.departureTime}.

      NOTA: Las fechas provistas (YYYY-MM-DD) son FECHAS LOCALES. Úsalas exactamente como están. No ajustes zonas horarias.
    `;
  }

  // City Specific Constraints
  let cityRules = "";
  if (prefs.cityConstraints && prefs.cityConstraints.length > 0) {
     cityRules = "REGLAS OBLIGATORIAS POR CIUDAD (NOCHES Y ORDEN):\n";
     prefs.cityConstraints.forEach(c => {
        let nightsText = "";
        if (c.fixedNights === 0) {
            nightsText = "0 noches (TRÁNSITO). El usuario llega a esta ciudad pero NO duerme aquí. Debe salir hacia la siguiente ciudad el MISMO día o inmediatamente. Úsala como punto de conexión.";
        } else if (c.fixedNights !== null) {
            nightsText = `${c.fixedNights} noches fijas.`;
        } else {
            nightsText = "Noches flexibles (IA decide).";
        }

        let orderText = "";
        if (c.visitOrder === 'START') orderText = "DEBE ser la PRIMERA parada (o justo después de llegar).";
        if (c.visitOrder === 'END') orderText = "DEBE ser la ÚLTIMA parada (antes de volver).";
        
        cityRules += `- ${c.city}: ${nightsText} ${orderText}\n`;
     });
  }

  const prompt = `
    Actúa como un Arquitecto de Viajes Senior para un grupo argentino.
    
    PERFIL:
    - Origen: ${profile.originCity}
    - Grupo: ${profile.adults} Adultos, ${profile.children} Niños
    - FECHAS EXACTAS: Del ${prefs.startDate} al ${prefs.endDate}. (${prefs.durationDays} noches REALES para distribuir en ciudades).
    - Presupuesto: ${prefs.budgetLevel}
    - Intereses: ${prefs.interests.join(", ")}
    - Pedidos: "${prefs.specificRequests}"
    
    DESTINOS OBLIGATORIOS (Incluir todos):
    ${prefs.mustVisitCities.join(", ")}
    ${prefs.mustVisitCountries.join(", ")}

    ${cityRules}

    ${constraintInstruction}

    TU MISIÓN:
    Genera **3 OPCIONES DE RUTA** optimizadas.
    
    REGLAS CRÍTICAS:
    1. **Logística de Tránsito:** Si una ciudad tiene 0 noches, inclúyela en el array de 'stops' con nights: 0, pero deja claro en 'transportDescription' que es un traslado inmediato hacia la siguiente.
    2. **Presupuesto:** El 'totalEstimatedCostUSD' debe ser el costo TOTAL para TODO EL GRUPO (no por persona). Multiplica costos individuales por ${profile.adults + profile.children}.
    3. **Fechas y Horas:** Usa las fechas exactas provistas. StartDate es el Día 1. RESPETA los horarios de vuelo si existen para coordinar check-ins y traslados.
    
    1. OPCIÓN A: La más equilibrada.
    2. OPCIÓN B: Enfocada en precio o rutas alternativas.
    3. OPCIÓN C: Enfocada en experiencia/lujo o intensidad.

    Devuelve un JSON con la propiedad 'options' conteniendo las 3 rutas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: multiItinerarySchema,
        thinkingConfig: { thinkingBudget: 16384 },
      },
    });

    const text = response.text;
    if (!text) return null;
    const data = JSON.parse(text);
    return data.options as GeneratedItinerary[];
  } catch (error) {
    console.error("Error generating itineraries:", error);
    return null;
  }
};

export const regenerateDailyPlan = async (
  city: string,
  country: string,
  nights: number,
  userInterests: string,
  season: string
): Promise<DailyActivity[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  const prompt = `
    Eres un experto local en ${city}, ${country}.
    Tienes ${nights} días para armar una agenda increíble.
    Estación: ${season}.
    
    EL USUARIO QUIERE ESPECÍFICAMENTE: "${userInterests}".
    
    Genera una nueva lista de actividades (DailyActivity) que cubra ${nights} días, priorizando lo que pidió el usuario pero manteniendo un ritmo lógico.
    Incluye horarios específicos.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        time: { type: Type.STRING, description: "Horario ej: '10:00 - 13:00'" },
        activity: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["time", "activity", "description"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "[]") as DailyActivity[];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const analyzeTripImage = async (base64Image: string): Promise<any | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const prompt = `
    Analiza esta imagen de un pasaje aéreo, reserva o itinerario.
    
    TU OBJETIVO: Extraer TODA la logística exacta para configurar un viaje.
    
    Busca:
    1. Ciudad de Origen del viaje (Desde dónde sale el usuario inicialmente).
    2. Fechas de Inicio (Salida) y Fin (Regreso).
    3. **VUELOS ESPECÍFICOS (CRUCIAL):**
       - Vuelo de IDA: Fecha de llegada a Europa, Hora de llegada, Ciudad de llegada.
       - Vuelo de VUELTA: Fecha de salida de Europa, Hora de salida, Ciudad desde donde sale.
    4. Ciudades a visitar intermedias.
    
    IMPORTANTE:
    - 'startDate': Debe ser la FECHA DE SALIDA del primer vuelo (Día 1 del viaje).
    - 'endDate': Debe ser la FECHA DE LLEGADA del vuelo de vuelta a origen (Último día).
    
    Formato de fecha: YYYY-MM-DD (Estricto).
    Formato de hora: HH:MM (24hs).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      originCity: { type: Type.STRING, description: "Ciudad de donde parte el viajero (ej: Buenos Aires)" },
      startDate: { type: Type.STRING, description: "Fecha del primer vuelo de salida YYYY-MM-DD." },
      endDate: { type: Type.STRING, description: "Fecha de regreso final YYYY-MM-DD." },
      mustVisitCities: { type: Type.ARRAY, items: { type: Type.STRING } },
      mustVisitCountries: { type: Type.ARRAY, items: { type: Type.STRING } },
      
      // Detailed Flight Data
      flightDetails: {
        type: Type.OBJECT,
        properties: {
          hasFlight: { type: Type.BOOLEAN, description: "True si se detecta un vuelo confirmado" },
          outbound: {
            type: Type.OBJECT,
            properties: {
               arrivalCity: { type: Type.STRING, description: "Ciudad donde aterriza en destino (ej: Madrid)" },
               arrivalDate: { type: Type.STRING, description: "Fecha de aterrizaje YYYY-MM-DD" },
               arrivalTime: { type: Type.STRING, description: "Hora de aterrizaje HH:MM" },
            }
          },
          inbound: {
             type: Type.OBJECT,
             properties: {
                departureCity: { type: Type.STRING, description: "Ciudad desde donde regresa (ej: Roma)" },
                departureDate: { type: Type.STRING, description: "Fecha de despegue de vuelta YYYY-MM-DD" },
                departureTime: { type: Type.STRING, description: "Hora de despegue HH:MM" }
             }
          }
        }
      },
      
      detectedContext: { type: Type.STRING, description: "Breve frase de lo que encontraste. Ej: 'Detecté tu vuelo a Madrid saliendo el 1 de Mayo'" }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Error analyzing image:", e);
    return null;
  }
};

export const reconstructSessionFromDocument = async (base64Data: string, mimeType: string): Promise<TripSession | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const prompt = `
    Analiza este documento visual (puede ser un itinerario en PDF, una captura de pantalla de un plan, o una reserva).
    
    TU MISIÓN:
    Reconstruye el ESTADO COMPLETO de la aplicación "EuroPlanner" basado en lo que ves.
    Queremos que el usuario pueda "continuar" su viaje desde este documento.

    1. Extrae el perfil del viajero (si no dice, asume 2 adultos).
    2. Extrae las preferencias (fechas, destinos).
    3. **CRÍTICO:** Si es un itinerario detallado, reconstruye el objeto 'itinerary' completo con todas sus paradas, actividades, y coordenadas aproximadas.
       Si es solo una reserva simple (ej: un vuelo), crea un itinerario básico con esa información.
    
    El objetivo es devolver un objeto 'TripSession' válido.
  `;

  const sessionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      createdAt: { type: Type.NUMBER },
      lastModified: { type: Type.NUMBER },
      profile: {
         type: Type.OBJECT,
         properties: {
           adults: { type: Type.INTEGER },
           children: { type: Type.INTEGER },
           originCity: { type: Type.STRING },
           flexibleOrigin: { type: Type.BOOLEAN }
         },
         required: ["adults", "children", "originCity"]
      },
      preferences: {
         type: Type.OBJECT,
         properties: {
           startDate: { type: Type.STRING },
           endDate: { type: Type.STRING },
           durationDays: { type: Type.INTEGER },
           season: { type: Type.STRING, enum: ["Primavera", "Verano", "Otoño", "Invierno"] },
           style: { type: Type.STRING },
           mustVisitCountries: { type: Type.ARRAY, items: { type: Type.STRING } },
           mustVisitCities: { type: Type.ARRAY, items: { type: Type.STRING } },
           budgetLevel: { type: Type.STRING },
           interests: { type: Type.ARRAY, items: { type: Type.STRING } },
           specificRequests: { type: Type.STRING },
           creditCard: { type: Type.STRING }
         },
         required: ["startDate", "endDate", "mustVisitCountries"]
      },
      itinerary: singleItineraryStructure,
      version: { type: Type.STRING }
    },
    required: ["profile", "preferences", "itinerary"]
  };

  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL, 
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: sessionSchema,
        thinkingConfig: { thinkingBudget: 10000 },
      }
    });
    
    const data = JSON.parse(response.text || "{}");
    return data as TripSession;

  } catch (e) {
    console.error("Error reconstructing session:", e);
    return null;
  }
};

export const generateModificationOptions = async (
  currentItinerary: GeneratedItinerary,
  modificationRequest: string
): Promise<ModificationOption[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  const prompt = `
    Eres un Arquitecto de Viajes Experto. Tienes este itinerario ACTUAL:
    ${JSON.stringify(currentItinerary)}

    El usuario quiere hacer CAMBIOS: "${modificationRequest}"

    TU MISIÓN Y REGLA DE ORO:
    - Si el usuario dice "QUITAR", "ELIMINAR" o "SACAR" noches/ciudades, DEBES hacerlo. 
    - **IMPORTANTE:** NO intentes "equilibrar" el viaje agregando esas noches sobrantes a otro lado a menos que se pida expresamente. 
    - El objetivo es CUMPLIR la orden directa. Si el viaje se acorta, se acorta.
    - Recalcula 'efficiencyStats' (horas de viaje vs disfrute).
    - Recalcula la logística (transportDuration, transportTime) si cambias ciudades.
    
    Genera un Array JSON con las opciones.
  `;

  const optionsSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        impactOnBudget: { type: Type.STRING },
        impactOnPace: { type: Type.STRING },
        modifiedItinerary: singleItineraryStructure
      },
      required: ["id", "title", "description", "impactOnBudget", "impactOnPace", "modifiedItinerary"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: optionsSchema,
        thinkingConfig: { thinkingBudget: 16384 },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ModificationOption[];
  } catch (error) {
    console.error("Error generating modification options:", error);
    return [];
  }
};

export const generateFlightOptions = async (
  origin: string, 
  firstStop: string, 
  lastStop: string,
  budgetLevel: string,
  creditCard: string,
  isFlexibleOrigin: boolean = false
): Promise<FlightOption[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  const originInstructions = isFlexibleOrigin 
    ? `Origen: El usuario es FLEXIBLE. Considera vuelos saliendo de ${origin} (Probablemente ROS) O de Buenos Aires (EZE/AEP). Busca opciones desde ambos lugares y elige las mejores.`
    : `Origen: ${origin}.`;

  const prompt = `
    ${originInstructions}
    Ruta: -> ${firstStop} ... ${lastStop} -> Vuelta a origen (o BUE/ROS si es flexible).
    Presupuesto: ${budgetLevel}.
    Tarjeta/Banco del Usuario: ${creditCard || "Ninguna específica"}.

    TU MISIÓN:
    Busca simulando una comparación de precios real para vuelos (Open Jaw o Ida y Vuelta según corresponda).
    
    FUENTES:
    Busca y compara EQUITATIVAMENTE en **TurismoCity**, **Skyscanner**, **Kayak** y **Google Flights**.
    No priorices ninguna fuente sobre otra.
    
    PRECIO E IMPUESTOS ARGENTINA:
    Devuelve siempre el **PRECIO BASE EN USD** (Dólares). 
    NO agregues impuestos locales (PAIS/Percepción) en el número que devuelves, ya que la aplicación los calculará automáticamente sobre la base en USD.

    ANÁLISIS EXPERTO:
    1. **Quality Score (1-10):** Evalúa duración total y escalas.
    2. **Price Analysis:** Indica si es 'Bargain' (Ganga), 'Fair' (Justo) o 'Expensive' (Caro).
    3. **Emissions:** Estima eficiencia (ej: "-15% CO2").

    Devuelve JSON Array con 5 opciones variadas de aerolíneas y fuentes.
  `;

  const segmentSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      airline: { type: Type.STRING },
      flightNumber: { type: Type.STRING },
      departureCity: { type: Type.STRING },
      departureIata: { type: Type.STRING, description: "Código IATA REAL de salida (ej: ROS, EZE, AEP)" },
      arrivalCity: { type: Type.STRING },
      arrivalIata: { type: Type.STRING },
      duration: { type: Type.STRING }
    },
    required: ["airline", "departureCity", "departureIata", "arrivalCity", "arrivalIata", "duration"]
  };

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        airline: { type: Type.STRING },
        price: { type: Type.STRING, description: "Precio BASE en USD (ej: '1200 USD'). Sin impuestos locales." },
        agentTip: { type: Type.STRING, description: "Por qué conviene esta opción (ej: 'Ahorras $300 saliendo de EZE' o 'Mejor precio directo desde ROS')" },
        source: { type: Type.STRING, description: "Portal donde se encontró (TurismoCity, Skyscanner, Kayak)" },
        creditCardPerk: { type: Type.STRING, description: "Beneficio específico si aplica (ej: '6 Cuotas s/interés')" },
        
        qualityScore: { type: Type.NUMBER, description: "Puntaje 1-10 de calidad del vuelo" },
        priceAnalysis: { type: Type.STRING, enum: ["Bargain", "Fair", "Expensive"] },
        emissionsEstimate: { type: Type.STRING, description: "Ej: '-12% CO2'" },

        outbound: segmentSchema,
        inbound: segmentSchema
      },
      required: ["airline", "price", "outbound", "inbound", "agentTip", "source", "qualityScore", "priceAnalysis"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "[]") as FlightOption[];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchRealTimeAccommodations = async (
  city: string,
  country: string,
  dates: string, 
  budgetLevel: string,
  guests: number
): Promise<{ hotels: AccommodationOption[], airbnbs: AccommodationOption[], comparison: string } | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const prompt = `
    Busca en la web alojamiento REAL y disponible en ${city}, ${country} para estas fechas aproximadas: ${dates}.
    Viajeros: ${guests}. Presupuesto: ${budgetLevel}.
    
    TU MISIÓN:
    1. Encuentra 3 Hoteles reales con sus precios actuales.
    2. Encuentra 3 Airbnbs/Apartamentos reales con sus precios actuales.
    3. Compara brevemente qué conviene más en esta ciudad específica.

    IMPORTANTE:
    Devuelve JSON válido.
    {
      "hotels": [ { "id": "h1", "name": "Hotel X", "type": "HOTEL", "pricePerNight": "$120", "rating": "4.5", "description": "...", "matchScore": 90, "pros": ["..."], "cons": ["..."], "bookingLink": "..." } ],
      "airbnbs": [ { "id": "a1", "name": "Apt X", "type": "AIRBNB", "pricePerNight": "$100", ... } ],
      "comparison": "En esta ciudad los hoteles son un 20% más caros pero mejor ubicados..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text;
    if (!text) return null;

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    let jsonString = "";
    
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else {
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        jsonString = text.substring(start, end + 1);
      }
    }

    if (!jsonString) return null;

    const data = JSON.parse(jsonString);
    return data;

  } catch (e) {
    console.error("Error fetching real-time accommodations:", e);
    return null;
  }
};

export const generateCityDetails = async (
  city: string, 
  country: string, 
  nights: number, 
  profile: TravelerProfile,
  budgetLevel: string,
  season: TravelSeason,
  style: TripStyle
): Promise<CityDetails | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const prompt = `
    Guía detallada para ${city}, ${country}. ${nights} noches.
    Perfil: ${profile.adults} Adultos, ${profile.children} Niños.
    Estilo: ${style}. Presupuesto: ${budgetLevel}.

    TU MISION:
    1. Itinerario detallado (dayByDay).
    2. Packing advice.
    3. **COMPARATIVA INTELIGENTE DE ALOJAMIENTO:**
       - Para cada hotel/airbnb, calcula un **matchScore (0-100)** basado en el perfil del usuario.
       - Lista 2 **PROS** y 2 **CONS** honestos para cada opción.
       - Usa precios reales estimados.

    Devuelve JSON.
  `;

  const accommodationOptionSchema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      name: { type: Type.STRING },
      type: { type: Type.STRING, enum: ["HOTEL", "AIRBNB"] },
      description: { type: Type.STRING },
      pricePerNight: { type: Type.STRING },
      rating: { type: Type.STRING },
      matchScore: { type: Type.INTEGER, description: "Puntaje de afinidad 0-100 con el perfil del usuario" },
      pros: { type: Type.ARRAY, items: { type: Type.STRING } },
      cons: { type: Type.ARRAY, items: { type: Type.STRING } },
      features: { type: Type.ARRAY, items: { type: Type.STRING } },
      location: { type: Type.STRING },
      bookingLink: { type: Type.STRING }
    },
    required: ["name", "type", "pricePerNight", "rating", "bookingLink", "matchScore", "pros", "cons"]
  };

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      cityName: { type: Type.STRING },
      bestAreasToStay: { type: Type.STRING },
      transportationTips: { type: Type.STRING },
      dayByDay: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            morning: { type: Type.STRING },
            afternoon: { type: Type.STRING },
            evening: { type: Type.STRING }
          },
          required: ["day", "morning", "afternoon", "evening"]
        }
      },
      packingAdvice: {
        type: Type.OBJECT,
        properties: {
          clothing: { type: Type.ARRAY, items: { type: Type.STRING } },
          essentials: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["clothing", "essentials"]
      },
      accommodations: {
        type: Type.OBJECT,
        properties: {
          hotels: { type: Type.ARRAY, items: accommodationOptionSchema },
          airbnbs: { type: Type.ARRAY, items: accommodationOptionSchema }
        },
        required: ["hotels", "airbnbs"]
      }
    },
    required: ["cityName", "bestAreasToStay", "transportationTips", "dayByDay", "packingAdvice", "accommodations"]
  };

  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}") as CityDetails;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const generateTripRequirements = async (countries: string[], origin: string): Promise<TripRequirements | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const prompt = `
    Actúa como un experto en burocracia y logística de viajes.
    El usuario viaja desde ${origin} (Argentina) hacia: ${countries.join(", ")}.
    
    Genera guía de: Visas, Salud, Moneda, Tech, Idiomas (Survival Kit), Seguridad.
  `;

  const phraseSchema = {
    type: Type.OBJECT,
    properties: {
      original: { type: Type.STRING },
      translated: { type: Type.STRING },
      pronunciation: { type: Type.STRING }
    },
    required: ["original", "translated", "pronunciation"]
  };

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      visaInfo: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          details: { type: Type.STRING },
          isEtiasRequired: { type: Type.BOOLEAN }
        },
        required: ["title", "details", "isEtiasRequired"]
      },
      healthInfo: {
        type: Type.OBJECT,
        properties: {
          vaccinations: { type: Type.STRING },
          insuranceAdvice: { type: Type.STRING }
        },
        required: ["vaccinations", "insuranceAdvice"]
      },
      currencyStrategy: {
        type: Type.OBJECT,
        properties: {
          currencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.STRING }
        },
        required: ["currencies", "tips"]
      },
      techSpecs: {
        type: Type.OBJECT,
        properties: {
          plugTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
          voltage: { type: Type.STRING },
          adapterAdvice: { type: Type.STRING }
        },
        required: ["plugTypes", "voltage", "adapterAdvice"]
      },
      survivalPhrases: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
            phrases: { type: Type.ARRAY, items: phraseSchema }
          },
          required: ["language", "phrases"]
        }
      },
      safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["visaInfo", "healthInfo", "currencyStrategy", "techSpecs", "survivalPhrases", "safetyTips"]
  };

  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}") as TripRequirements;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const generateTravelerGuide = async (
  itinerary: GeneratedItinerary,
  profile: TravelerProfile,
  quizAnswers: { security: string; transport: string; food: string }
): Promise<TravelerGuide | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const cities = itinerary.stops.map(s => s.city + ", " + s.country).join("; ");

  const prompt = `
    Eres un Asesor Experto de Viajes (un local de confianza).
    Estás creando una "Guía de Supervivencia y Disfrute" personalizada para un grupo de argentinos.
    
    PERFIL:
    - Ciudades: ${cities}
    - Grupo: ${profile.adults} Adultos, ${profile.children} Niños.
    - PREFERENCIAS DEL USUARIO (Quiz):
       1. Seguridad: ${quizAnswers.security}
       2. Transporte: ${quizAnswers.transport}
       3. Comida: ${quizAnswers.food}
    
    TU MISIÓN:
    Genera una guía PRÁCTICA y TÁCTICA. No quiero historia, quiero datos útiles.
    
    Para cada ciudad:
    - App de transporte local exacta (ej: Citymapper vs Google Maps, FreeNow vs Uber).
    - Truco de boletos (ej: "No compres el ticket sencillo, compra el T-Casual").
    - Tipping: Cómo funciona la propina REALMENTE ahí.
    - Scam Alerts: Qué estafa es común HOY en día en esa ciudad.
    - Hidden Gems: Algo que encaje con sus gustos.
    
    Devuelve JSON.
  `;

  const cityGuideSchema = {
    type: Type.OBJECT,
    properties: {
      city: { type: Type.STRING },
      localTransport: {
        type: Type.OBJECT,
        properties: {
           bestApp: { type: Type.STRING },
           ticketTip: { type: Type.STRING },
           costEstimate: { type: Type.STRING }
        },
        required: ["bestApp", "ticketTip"]
      },
      moneyTactics: {
        type: Type.OBJECT,
        properties: {
          tipping: { type: Type.STRING },
          cashOrCard: { type: Type.STRING }
        },
        required: ["tipping", "cashOrCard"]
      },
      safetyAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
      hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING } },
      foodieTips: { type: Type.STRING }
    },
    required: ["city", "localTransport", "moneyTactics", "safetyAlerts", "hiddenGems", "foodieTips"]
  };

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      generalTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      cityGuides: { type: Type.ARRAY, items: cityGuideSchema }
    },
    required: ["generalTips", "cityGuides"]
  };

  try {
    const response = await ai.models.generateContent({
      model: PRO_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}") as TravelerGuide;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const modifyItineraryTool: FunctionDeclaration = {
  name: "modifyItinerary",
  description: "Modifies the current trip itinerary based on user instructions. Use this when the user wants to add cities, remove cities, change durations (increase/DECREASE nights), reorder stops, or change dates.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      instruction: {
        type: Type.STRING,
        description: "The specific instruction for modification (e.g., 'Add Paris for 2 nights', 'Remove Rome', 'Stay 1 night LESS in Madrid')."
      }
    },
    required: ["instruction"]
  }
};

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string,
  itineraryContext?: GeneratedItinerary
): Promise<{ text: string; sources: { title: string; url: string }[], functionCalls?: any[] }> => {
  const ai = getAIClient();
  if (!ai) return { text: "Error de configuración: Falta API Key.", sources: [] };

  try {
    // Inject itinerary context if available
    let contextInstruction = "";
    if (itineraryContext) {
      contextInstruction = `
      CURRENT ITINERARY CONTEXT (JSON):
      ${JSON.stringify(itineraryContext)}
      
      You are an AI Travel Agent for "EuroPlanner". You have full access to this itinerary.
      If the user asks to modify the plan (add/remove cities, change nights, etc.), YOU MUST CALL the 'modifyItinerary' tool with the specific instruction.
      Do not say "I can't do that". You have the tool. Use it.
      `;
    } else {
      contextInstruction = "You are an AI Travel Agent helping the user plan their trip. No itinerary is generated yet.";
    }

    // Transform internal ChatMessage to Gemini SDK format
    // We only take the last few messages to keep context window manageable if needed, but for now take all.
    // NOTE: For function calling to work effectively in a single-turn simulation (stateless service), 
    // we primarily rely on the system instruction and the current message.
    // However, to keep chat history, we need to pass previous turns. 
    // Since the ChatWidget manages history state, we really just need to send the correct structure here.
    
    const chat = ai.chats.create({
      model: FLASH_MODEL,
      config: {
        systemInstruction: `Eres un asistente de viaje experto de 'EuroPlanner'.
        ${contextInstruction}
        TOOLS: Google Maps, Google Search, Modify Itinerary.
        `,
        tools: [
          { googleMaps: {} }, 
          { googleSearch: {} },
          { functionDeclarations: [modifyItineraryTool] }
        ],
      },
      history: history.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });
    
    const response = await chat.sendMessage({ message: newMessage });
    
    if (!response) throw new Error("No response from AI");

    const text = response.text || "";
    const sources: { title: string; url: string }[] = [];
    let functionCalls: any[] = [];

    // Extract Function Calls
    if (response.functionCalls && response.functionCalls.length > 0) {
      functionCalls = response.functionCalls;
    }

    // Extract Grounding (Maps/Web)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps) {
          sources.push({ title: chunk.maps.title || "Mapa", url: chunk.maps.uri || "" });
        } else if (chunk.web) {
           sources.push({ title: chunk.web.title || "Web", url: chunk.web.uri || "" });
        }
      });
    }

    return { text, sources, functionCalls };
  } catch (e) {
    console.error("Chat Error:", e);
    return { text: "Tuve un problema de conexión momentáneo.", sources: [] };
  }
};

export const playTextAsSpeech = async (text: string): Promise<void> => {
  const ai = getAIClient();
  if (!ai) return;

  try {
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: { parts: [{ text }] },
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext({ sampleRate: 24000 });
    
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length / 1;
    const audioBuffer = ctx.createBuffer(1, frameCount, 24000);
    
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();

  } catch (e) {
    console.error("Error generating speech", e);
  }
};
