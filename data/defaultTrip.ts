export const defaultTripSession = {
  "createdAt": 1765755147872,
  "lastModified": 1767661495767,
  "profile": {
    "adults": 3,
    "children": 0,
    "originCity": "Buenos Aires",
    "flexibleOrigin": false
  },
  "preferences": {
    "startDate": "2026-05-01",
    "endDate": "2026-05-25",
    "durationDays": 23,
    "season": "Primavera",
    "style": "Cultural",
    "mustVisitCountries": [
      "España",
      "Francia",
      "Reino Unido",
      "Países Bajos",
      "Suiza"
    ],
    "mustVisitCities": [
      "Londres",
      "Paris",
      "Liverpool",
      "Bruselas",
      "Barcelona",
      "Dublin",
      "Amsterdam",
      "Madrid"
    ],
    "cityConstraints": [
      {
        "city": "Londres",
        "fixedNights": 4,
        "visitOrder": "ANY"
      },
      {
        "city": "Paris",
        "fixedNights": 4,
        "visitOrder": "ANY"
      },
      {
        "city": "Liverpool",
        "fixedNights": 3,
        "visitOrder": "ANY"
      },
      {
        "city": "Bruselas",
        "fixedNights": 2,
        "visitOrder": "ANY"
      },
      {
        "city": "Barcelona",
        "fixedNights": 3,
        "visitOrder": "ANY"
      },
      {
        "city": "Dublin",
        "fixedNights": 3,
        "visitOrder": "ANY"
      },
      {
        "city": "Amsterdam",
        "fixedNights": 2,
        "visitOrder": "ANY"
      },
      {
        "city": "Madrid",
        "fixedNights": 3,
        "visitOrder": "END"
      }
    ],
    "budgetLevel": "Medio",
    "interests": [
      "Historia y Museos",
      "Paisajes / Naturaleza",
      "Vida Nocturna",
      "Compras",
      "Gastronomía",
      "Fútbol / Deportes"
    ],
    "specificRequests": "La idea es llegar a madrid para ir directo a barcelona. Es decir, llegamos 23:30 a madrid, y nos vamos derecho a barcelona tipo 6 am en el primer tren.\n\nCAmp nou, Louvre, Arc de triumph, boreau, Jardin de tulipanes de amsterdam, torre eiffel, brujas, sacre cure, notredam, beatles, big ben, acantilados de dubilin, castillos, bernabeu, old traffor, anfield, chocolates",
    "creditCard": "",
    "existingFlight": {
      "hasFlight": true,
      "arrivalCity": "Madrid",
      "arrivalDate": "2026-05-01",
      "arrivalTime": "23:30",
      "departureCity": "Madrid",
      "departureDate": "2026-05-25",
      "departureTime": "09:40"
    }
  },
  "itinerary": {
    "id": "itin_may_25days_swap_ams_bru_v2",
    "comparisonLabel": "Orden AMS-BRU",
    "tripTitle": "Europa Mayo: Benelux Remix",
    "summary": "Se ha modificado el tramo central según tu solicitud: desde París viajarás directo al norte hacia Ámsterdam (2 noches), para luego descender a Bruselas (2 noches) y conectar finalmente con Londres. El resto de la ruta (España, UK, Irlanda) se mantiene idéntica, conservando las fechas y la estructura de 25 días.",
    "stops": [
      {
        "city": "Madrid",
        "country": "España",
        "nights": 0,
        "coordinates": {
          "lat": 40.4168,
          "lng": -3.7038
        },
        "highlights": [
          "Terminal T4",
          "Traslado Exprés",
          "Estación de Atocha"
        ],
        "keyMilestones": [
          "Aterrizaje puntual el 1 de Mayo a las 23:30",
          "Check-in rápido en hotel de tránsito zona Atocha",
          "Estar en andén del tren a las 06:40 AM del día 2"
        ],
        "transportToNext": "Tren Alta Velocidad",
        "transportDuration": "2h 30m",
        "transportTime": "07:00",
        "transportDescription": "Tren Madrid Atocha -> Barcelona Sants.",
        "dailyPlan": [
          {
            "activity": "Llegada y Logística",
            "description": "Aterrizaje 23:30 del 1 de Mayo.",
            "time": "23:30 - 06:00"
          }
        ],
        "estimatedCost": "50",
        "arrivalTime": "23:30",
        "departureTime": "07:00",
        "arrivalDay": 1,
        "departureDay": 2,
        "transportDetails": "Vuelo Llegada -> Tren Salida"
      },
      {
        "city": "Barcelona",
        "country": "España",
        "nights": 3,
        "coordinates": {
          "lat": 41.3851,
          "lng": 2.1734
        },
        "highlights": [
          "Sagrada Familia",
          "Parc Güell",
          "Barceloneta"
        ],
        "keyMilestones": [
          "Comprar tickets Sagrada Familia 1 mes antes",
          "Reservar acceso a Zona Monumental Parc Güell",
          "Cena de tapas en el barrio del Born"
        ],
        "transportToNext": "Tren TGV / Alta Velocidad",
        "transportDuration": "6h 30m",
        "transportTime": "09:00",
        "transportDescription": "Sants -> Paris Gare de Lyon.",
        "dailyPlan": [],
        "estimatedCost": "600",
        "arrivalTime": "09:30",
        "departureTime": "09:00",
        "arrivalDay": 2,
        "departureDay": 5,
        "transportDetails": "Tren Alta Velocidad"
      },
      {
        "city": "París",
        "country": "Francia",
        "nights": 4,
        "coordinates": {
          "lat": 48.8566,
          "lng": 2.3522
        },
        "highlights": [
          "Louvre",
          "Torre Eiffel",
          "Montmartre"
        ],
        "keyMilestones": [
          "Reservar entrada al Louvre (horario mañana)",
          "Comprar tickets Torre Eiffel o Tour Montparnasse",
          "Reservar crucero nocturno por el Sena"
        ],
        "transportToNext": "Tren Thalys",
        "transportDuration": "3h 20m",
        "transportTime": "09:00",
        "transportDescription": "Paris Nord -> Amsterdam Centraal (Directo).",
        "dailyPlan": [],
        "estimatedCost": "750",
        "arrivalTime": "15:30",
        "departureTime": "09:00",
        "arrivalDay": 5,
        "departureDay": 9,
        "transportDetails": "TGV"
      },
      {
        "city": "Ámsterdam",
        "country": "Países Bajos",
        "nights": 2,
        "coordinates": {
          "lat": 52.3676,
          "lng": 4.9041
        },
        "highlights": [
          "Museo Van Gogh",
          "Rijksmuseum",
          "Barrio Rojo"
        ],
        "keyMilestones": [
          "Reserva Van Gogh obligatoria (3-4 semanas antes)",
          "Tickets Casa de Ana Frank (6 semanas antes)",
          "Alquiler de bicicleta en Vondelpark"
        ],
        "transportToNext": "Tren Thalys / IC",
        "transportDuration": "1h 50m",
        "transportTime": "10:00",
        "transportDescription": "Amsterdam Centraal -> Bruxelles-Midi.",
        "dailyPlan": [],
        "estimatedCost": "700",
        "arrivalTime": "12:20",
        "departureTime": "10:00",
        "arrivalDay": 9,
        "departureDay": 11,
        "transportDetails": "Tren Rápido"
      },
      {
        "city": "Bruselas",
        "country": "Bélgica",
        "nights": 2,
        "coordinates": {
          "lat": 50.8503,
          "lng": 4.3517
        },
        "highlights": [
          "Grand Place",
          "Manneken Pis",
          "Chocolate Tour"
        ],
        "keyMilestones": [
          "Probar Waffles en Maison Dandoy",
          "Ruta de los murales de Cómics (Tintín)",
          "Cata de cervezas en Delirium Café"
        ],
        "transportToNext": "Tren Eurostar",
        "transportDuration": "2h 05m",
        "transportTime": "14:00",
        "transportDescription": "Bruxelles-Midi -> Londres St Pancras.",
        "dailyPlan": [],
        "estimatedCost": "550",
        "arrivalTime": "11:50",
        "departureTime": "14:00",
        "arrivalDay": 11,
        "departureDay": 13,
        "transportDetails": "Eurostar"
      },
      {
        "city": "Londres",
        "country": "Reino Unido",
        "nights": 4,
        "coordinates": {
          "lat": 51.5074,
          "lng": -0.1278
        },
        "highlights": [
          "Big Ben",
          "London Eye",
          "Soho"
        ],
        "keyMilestones": [
          "Comprar Oyster Card o usar Contactless",
          "Reservar entrada gratuita Sky Garden",
          "Ver Cambio de Guardia en Buckingham (11:00 AM)"
        ],
        "transportToNext": "Tren Avanti",
        "transportDuration": "2h 20m",
        "transportTime": "10:00",
        "transportDescription": "Euston a Liverpool Lime St.",
        "dailyPlan": [],
        "estimatedCost": "800",
        "arrivalTime": "15:05",
        "departureTime": "10:00",
        "arrivalDay": 13,
        "departureDay": 17,
        "transportDetails": "Tren Rápido"
      },
      {
        "city": "Liverpool",
        "country": "Reino Unido",
        "nights": 2,
        "coordinates": {
          "lat": 53.4084,
          "lng": -2.9916
        },
        "highlights": [
          "The Beatles Story (Museo)",
          "Anfield Road (Estadio)",
          "Royal Albert Dock"
        ],
        "keyMilestones": [
          "Día 1: Tour Beatles completo (Magical Mystery Tour)",
          "Día 2: Visita guiada Estadio Anfield",
          "Foto en estatua de The Beatles en Pier Head"
        ],
        "transportToNext": "Vuelo Corto",
        "transportDuration": "50m",
        "transportTime": "16:00",
        "transportDescription": "Vuelo tarde a Dublín.",
        "dailyPlan": [
          {
            "activity": "Día Completo Beatles",
            "description": "Dedicar el primer día entero a la zona de Mathew St y el museo.",
            "time": "10:00 - 22:00"
          }
        ],
        "estimatedCost": "500",
        "arrivalTime": "12:30",
        "departureTime": "16:00",
        "arrivalDay": 17,
        "departureDay": 19,
        "transportDetails": "Avión"
      },
      {
        "city": "Dublín",
        "country": "Irlanda",
        "nights": 3,
        "coordinates": {
          "lat": 53.3498,
          "lng": -6.2603
        },
        "highlights": [
          "Temple Bar",
          "Trinity College",
          "St Patrick's Cathedral"
        ],
        "keyMilestones": [
          "Reservar tour Guinness Storehouse",
          "Ver Book of Kells en Trinity College",
          "Cena con música folk en vivo en Temple Bar"
        ],
        "transportToNext": "Vuelo Internacional",
        "transportDuration": "2h 40m",
        "transportTime": "14:00",
        "transportDescription": "Vuelo Dublín a Madrid.",
        "dailyPlan": [],
        "estimatedCost": "600",
        "arrivalTime": "17:00",
        "departureTime": "14:00",
        "arrivalDay": 19,
        "departureDay": 22,
        "transportDetails": "Vuelo"
      },
      {
        "city": "Madrid",
        "country": "España",
        "nights": 3,
        "coordinates": {
          "lat": 40.4168,
          "lng": -3.7038
        },
        "highlights": [
          "Gran Vía",
          "Palacio Real",
          "Chueca"
        ],
        "keyMilestones": [
          "Desayuno de Churros en San Ginés",
          "Gestión de Tax Free en aeropuerto",
          "Regreso 25 de Mayo (Vuelo de vuelta)"
        ],
        "transportToNext": "VUELO DE VUELTA",
        "transportDuration": "N/A",
        "transportTime": "09:40",
        "transportDescription": "Fin del viaje el 25 de Mayo.",
        "dailyPlan": [],
        "estimatedCost": "550",
        "arrivalTime": "17:40",
        "departureTime": "09:40",
        "arrivalDay": 22,
        "departureDay": 25,
        "transportDetails": "Vuelo Regreso"
      }
    ],
    "tipsForArgentinians": [
      "El cambio de orden (París -> Ámsterdam -> Bruselas) implica un poco más de tiempo en tren inicialmente, pero conecta muy bien Bruselas con Londres.",
      "Aprovecha que llegas a Londres desde Bruselas en Eurostar: es el cruce más icónico del canal.",
      "El presupuesto se mantiene casi idéntico al original."
    ],
    "totalEstimatedCostUSD": "15950",
    "budgetBreakdown": {
      "accommodation": 7050,
      "food": 4700,
      "transport": 2500,
      "activities": 1200,
      "shopping": 500,
      "currency": "USD",
      "explanation": "Costos mantenidos igual que la versión anterior; el cambio de orden de trenes tiene impacto marginal en el precio global."
    },
    "efficiencyStats": {
      "enjoymentTimeHours": 307,
      "transitPercentage": 17,
      "transitTimeHours": 53
    }
  },
  "availableRoutes": [
    {
      "id": "OPT_A_CLASICA_TREN",
      "comparisonLabel": "Ruta Lógica Ferroviaria",
      "tripTitle": "La Gran Vuelta Europea: Trenes y Leyendas",
      "summary": "Esta ruta optimiza los traslados en tren de alta velocidad (TGV/Eurostar) para minimizar el estrés de aeropuertos, conectando Barcelona hacia el norte hasta Ámsterdam y bajando por Reino Unido. Ideal para ver la transición de paisajes y arquitectura. Se prioriza el orden geográfico lógico.",
      "stops": [
        {
          "city": "Barcelona",
          "country": "España",
          "nights": 3,
          "coordinates": {
            "lat": 41.3851,
            "lng": 2.1734
          },
          "highlights": [
            "Sagrada Familia (Interior)",
            "Camp Nou (Spotify Camp Nou Experience)",
            "Barrio Gótico y Born"
          ],
          "keyMilestones": [
            "Reservar Sagrada Familia 2 meses antes",
            "Comprar billete AVE Madrid-Barcelona con 3 meses de antelación"
          ],
          "transportToNext": "Tren TGV / Alta Velocidad",
          "transportDuration": "6h 30m",
          "transportTime": "09:00",
          "transportDescription": "Tren directo TGV Inoui desde Barcelona Sants a Paris Gare de Lyon. Ruta escénica.",
          "dailyPlan": [
            {
              "activity": "Llegada Táctica",
              "description": "Llegada a MAD 23:30 (Día 1). Espera en cafetería 24h/VIP lounge Atocha. Tren 06:00 a BCN.",
              "time": "00:00 - 09:00"
            },
            {
              "activity": "Check-in y Siesta",
              "description": "Dejar maletas, siesta reparadora post-viaje transatlántico.",
              "time": "10:00 - 14:00"
            },
            {
              "activity": "Paseo Tardes",
              "description": "Ramblas y Mercado de la Boquería.",
              "time": "16:00 - 19:00"
            }
          ],
          "estimatedCost": "600",
          "arrivalTime": "23:30",
          "departureTime": "09:00",
          "arrivalDay": 1,
          "departureDay": 4,
          "transportDetails": "Tren AVE desde Madrid Atocha (traslado inmediato al llegar)"
        },
        {
          "city": "París",
          "country": "Francia",
          "nights": 4,
          "coordinates": {
            "lat": 48.8566,
            "lng": 2.3522
          },
          "highlights": [
            "Museo del Louvre",
            "Torre Eiffel y Trocadero",
            "Montmartre y Sacré-Cœur"
          ],
          "keyMilestones": [
            "Entrada al Louvre (horario exacto) 3 meses antes",
            "Reserva cena en barco por el Sena"
          ],
          "transportToNext": "Tren Thalys",
          "transportDuration": "1h 22m",
          "transportTime": "10:00",
          "transportDescription": "Tren alta velocidad Thalys desde Paris Nord a Bruxelles-Midi.",
          "dailyPlan": [
            {
              "activity": "Iconos Clásicos",
              "description": "Arco del Triunfo y Campos Elíseos.",
              "time": "10:00"
            },
            {
              "activity": "Museo del Louvre",
              "description": "Recorrido enfocado en obras maestras.",
              "time": "14:00"
            }
          ],
          "estimatedCost": "750",
          "arrivalTime": "15:30",
          "departureTime": "10:00",
          "arrivalDay": 4,
          "departureDay": 8,
          "transportDetails": "TGV Inoui Directo"
        },
        {
          "city": "Bruselas",
          "country": "Bélgica",
          "nights": 2,
          "coordinates": {
            "lat": 50.8503,
            "lng": 4.3517
          },
          "highlights": [
            "Grand Place",
            "Atomium",
            "Ruta del Chocolate y Cerveza"
          ],
          "keyMilestones": [
            "No requiere reservas críticas, ideal para relax"
          ],
          "transportToNext": "Tren Thalys / Eurostar",
          "transportDuration": "1h 50m",
          "transportTime": "11:00",
          "transportDescription": "Tren rápido hacia Ámsterdam Central.",
          "dailyPlan": [
            {
              "activity": "Centro Histórico",
              "description": "Manneken Pis y Waffles en Grand Place.",
              "time": "15:00"
            }
          ],
          "estimatedCost": "550",
          "arrivalTime": "11:30",
          "departureTime": "11:00",
          "arrivalDay": 8,
          "departureDay": 10,
          "transportDetails": "Thalys"
        },
        {
          "city": "Ámsterdam",
          "country": "Países Bajos",
          "nights": 2,
          "coordinates": {
            "lat": 52.3676,
            "lng": 4.9041
          },
          "highlights": [
            "Museo Van Gogh",
            "Canales de Ámsterdam",
            "Keukenhof (Últimos días de tulipanes)"
          ],
          "keyMilestones": [
            "Casa de Ana Frank: 6 semanas antes EXACTAS (se agotan en minutos)",
            "Keukenhof: Verificar cierre temporada (aprox 12 mayo)"
          ],
          "transportToNext": "Tren Eurostar",
          "transportDuration": "4h 10m",
          "transportTime": "13:00",
          "transportDescription": "Tren directo a Londres St Pancras. Cruza el canal.",
          "dailyPlan": [
            {
              "activity": "Tulipanes",
              "description": "Excursión medio día a Keukenhof (si está abierto).",
              "time": "09:00"
            }
          ],
          "estimatedCost": "700",
          "arrivalTime": "13:00",
          "departureTime": "13:00",
          "arrivalDay": 10,
          "departureDay": 12,
          "transportDetails": "Thalys/IC"
        },
        {
          "city": "Londres",
          "country": "Reino Unido",
          "nights": 4,
          "coordinates": {
            "lat": 51.5074,
            "lng": -0.1278
          },
          "highlights": [
            "Big Ben y Westminster",
            "British Museum",
            "Camden Town"
          ],
          "keyMilestones": [
            "London Eye Fast Track",
            "Oyster Cards o Contactless"
          ],
          "transportToNext": "Tren Avanti West Coast",
          "transportDuration": "2h 20m",
          "transportTime": "10:00",
          "transportDescription": "Tren rápido desde London Euston a Liverpool Lime St.",
          "dailyPlan": [
            {
              "activity": "Cultura Pop",
              "description": "Foto en Abbey Road y compras en Oxford St.",
              "time": "15:00"
            }
          ],
          "estimatedCost": "800",
          "arrivalTime": "16:15",
          "departureTime": "10:00",
          "arrivalDay": 12,
          "departureDay": 16,
          "transportDetails": "Eurostar Directo"
        },
        {
          "city": "Liverpool",
          "country": "Reino Unido",
          "nights": 3,
          "coordinates": {
            "lat": 53.4084,
            "lng": -2.9916
          },
          "highlights": [
            "Anfield Stadium Tour",
            "The Cavern Club (Beatles)",
            "Royal Albert Dock"
          ],
          "keyMilestones": [
            "Tour de Anfield (reservar con antelación si no hay partido)",
            "Magical Mystery Tour bus"
          ],
          "transportToNext": "Vuelo Corto",
          "transportDuration": "50m",
          "transportTime": "11:00",
          "transportDescription": "Vuelo directo Liverpool (LPL) o Manchester (MAN) a Dublin.",
          "dailyPlan": [
            {
              "activity": "Fútbol y Música",
              "description": "Visita a Anfield y noche de música en vivo en The Cavern.",
              "time": "10:00 - 23:00"
            }
          ],
          "estimatedCost": "500",
          "arrivalTime": "12:30",
          "departureTime": "11:00",
          "arrivalDay": 16,
          "departureDay": 19,
          "transportDetails": "Tren Avanti West Coast"
        },
        {
          "city": "Dublín",
          "country": "Irlanda",
          "nights": 3,
          "coordinates": {
            "lat": 53.3498,
            "lng": -6.2603
          },
          "highlights": [
            "Temple Bar",
            "Guinness Storehouse",
            "Acantilados de Moher (Day trip)"
          ],
          "keyMilestones": [
            "Reservar tour a Cliffs of Moher (día completo)",
            "Guinness Storehouse tickets"
          ],
          "transportToNext": "Vuelo Internacional",
          "transportDuration": "2h 40m",
          "transportTime": "14:00",
          "transportDescription": "Vuelo directo Dublín a Madrid (Iberia/Aer Lingus/Ryanair).",
          "dailyPlan": [
            {
              "activity": "Naturaleza",
              "description": "Excursión full day a los Acantilados (Moher).",
              "time": "08:00 - 19:00"
            }
          ],
          "estimatedCost": "600",
          "arrivalTime": "12:00",
          "departureTime": "14:00",
          "arrivalDay": 19,
          "departureDay": 22,
          "transportDetails": "Vuelo Ryanair/AerLingus"
        },
        {
          "city": "Madrid",
          "country": "España",
          "nights": 3,
          "coordinates": {
            "lat": 40.4168,
            "lng": -3.7038
          },
          "highlights": [
            "Estadio Santiago Bernabéu",
            "Museo del Prado",
            "Gran Vía (Compras)"
          ],
          "keyMilestones": [
            "Tour Bernabéu",
            "Reservar taxi/transfer para aeropuerto día de salida (06:40 AM)"
          ],
          "transportToNext": "VUELO DE VUELTA",
          "transportDuration": "N/A",
          "transportTime": "09:40",
          "transportDescription": "Traslado al aeropuerto Barajas T4.",
          "dailyPlan": [
            {
              "activity": "Despedida",
              "description": "Cena de tapas en La Latina y compras finales.",
              "time": "20:00"
            }
          ],
          "estimatedCost": "550",
          "arrivalTime": "17:40",
          "departureTime": "09:40",
          "arrivalDay": 22,
          "departureDay": 25,
          "transportDetails": "Vuelo DUB-MAD"
        }
      ],
      "tipsForArgentinians": [
        "Usar tarjeta de débito/crédito para casi todo (dólar tarjeta es más barato que blue a veces, chequear cotización).",
        "Tax Free (DIVA) en España: Pedí el formulario en compras >€0. Se valida digitalmente en el aeropuerto de salida (Madrid) antes de despachar.",
        "El agua de la canilla es potable en todas estas ciudades. Llevad botella recargable.",
        "Propinas: No son obligatorias como en USA, pero dejar un 10% en cenas se aprecia."
      ],
      "totalEstimatedCostUSD": "16200",
      "budgetBreakdown": {
        "accommodation": 7200,
        "food": 4800,
        "transport": 2500,
        "activities": 1200,
        "shopping": 500,
        "currency": "USD",
        "explanation": "Cálculo para 3 adultos x 24 días. Promedio $225/día por persona todo incluido (nivel medio/confort)."
      },
      "efficiencyStats": {
        "enjoymentTimeHours": 340,
        "transitPercentage": 12,
        "transitTimeHours": 35
      }
    },
    {
      "id": "OPT_B_TULIPANES_PRIORITY",
      "comparisonLabel": "Ruta de las Flores (Ordenado por Clima)",
      "tripTitle": "Primavera en el Norte: Tulipanes y Fútbol",
      "summary": "Esta ruta altera el orden para llegar a Ámsterdam lo antes posible (principios de mayo), maximizando las chances de ver los campos de tulipanes en flor antes de que los corten a mediados de mes. Luego desciende hacia UK y finaliza en el sur.",
      "stops": [
        {
          "city": "Barcelona",
          "country": "España",
          "nights": 3,
          "coordinates": {
            "lat": 41.3851,
            "lng": 2.1734
          },
          "highlights": [
            "Parc Güell",
            "Casa Batlló",
            "Playa de la Barceloneta"
          ],
          "keyMilestones": [
            "Entradas Parc Güell anticipadas",
            "Vuelo a Ámsterdam reservado con equipaje"
          ],
          "transportToNext": "Vuelo Low Cost",
          "transportDuration": "2h 15m",
          "transportTime": "10:00",
          "transportDescription": "Vuelo directo BCN a AMS (Vueling/Transavia).",
          "dailyPlan": [
            {
              "activity": "Llegada y Tren",
              "description": "Aterrizaje MAD 23:30 (Día 1). Traslado inmediato a estación. Tren 06:00 a BCN.",
              "time": "00:00 - 09:00"
            }
          ],
          "estimatedCost": "600",
          "arrivalTime": "23:30",
          "departureTime": "10:00",
          "arrivalDay": 1,
          "departureDay": 4,
          "transportDetails": "Tren AVE desde Madrid"
        },
        {
          "city": "Ámsterdam",
          "country": "Países Bajos",
          "nights": 2,
          "coordinates": {
            "lat": 52.3676,
            "lng": 4.9041
          },
          "highlights": [
            "Jardines Keukenhof (PRIORIDAD)",
            "Barrio Rojo",
            "Heineken Experience"
          ],
          "keyMilestones": [
            "Keukenhof entradas día 1",
            "Ferry a Amsterdam Noord"
          ],
          "transportToNext": "Tren Thalys",
          "transportDuration": "1h 50m",
          "transportTime": "14:00",
          "transportDescription": "Tren rápido a Bruselas.",
          "dailyPlan": [
            {
              "activity": "Tulipanes Full",
              "description": "Día entero en los campos de flores (Lisse).",
              "time": "09:00 - 16:00"
            }
          ],
          "estimatedCost": "750",
          "arrivalTime": "13:00",
          "departureTime": "14:00",
          "arrivalDay": 4,
          "departureDay": 6,
          "transportDetails": "Vuelo BCN-AMS"
        },
        {
          "city": "Bruselas",
          "country": "Bélgica",
          "nights": 2,
          "coordinates": {
            "lat": 50.8503,
            "lng": 4.3517
          },
          "highlights": [
            "Parlamento Europeo",
            "Cervecería Delirium",
            "Galerías Reales"
          ],
          "keyMilestones": [
            "Comer Mejillones con papas fritas"
          ],
          "transportToNext": "Tren Thalys",
          "transportDuration": "1h 22m",
          "transportTime": "11:00",
          "transportDescription": "Tren a Paris Nord.",
          "dailyPlan": [
            {
              "activity": "Gastronomía",
              "description": "Tour de cerveza y chocolate belga.",
              "time": "18:00"
            }
          ],
          "estimatedCost": "550",
          "arrivalTime": "16:00",
          "departureTime": "11:00",
          "arrivalDay": 6,
          "departureDay": 8,
          "transportDetails": "Tren desde AMS"
        },
        {
          "city": "París",
          "country": "Francia",
          "nights": 4,
          "coordinates": {
            "lat": 48.8566,
            "lng": 2.3522
          },
          "highlights": [
            "Versalles (Excursión)",
            "Barrio Latino",
            "Catacumbas"
          ],
          "keyMilestones": [
            "Pasaporte para Versalles",
            "Entrada Catacumbas (se compra 7 días antes)"
          ],
          "transportToNext": "Tren Eurostar",
          "transportDuration": "2h 16m",
          "transportTime": "10:00",
          "transportDescription": "Tren por debajo del canal a Londres St Pancras.",
          "dailyPlan": [
            {
              "activity": "Rey Sol",
              "description": "Visita a Palacio de Versalles.",
              "time": "09:00 - 15:00"
            }
          ],
          "estimatedCost": "800",
          "arrivalTime": "12:30",
          "departureTime": "10:00",
          "arrivalDay": 8,
          "departureDay": 12,
          "transportDetails": "Thalys"
        },
        {
          "city": "Londres",
          "country": "Reino Unido",
          "nights": 4,
          "coordinates": {
            "lat": 51.5074,
            "lng": -0.1278
          },
          "highlights": [
            "Torre de Londres",
            "Covent Garden",
            "Soho Nocturno"
          ],
          "keyMilestones": [
            "Reservar Sky Garden (gratis pero con turno)",
            "Musical en West End"
          ],
          "transportToNext": "Tren Avanti",
          "transportDuration": "2h 30m",
          "transportTime": "09:00",
          "transportDescription": "Tren a Liverpool.",
          "dailyPlan": [
            {
              "activity": "Historia Real",
              "description": "Joyas de la Corona en la Torre de Londres.",
              "time": "10:00"
            }
          ],
          "estimatedCost": "850",
          "arrivalTime": "11:30",
          "departureTime": "09:00",
          "arrivalDay": 12,
          "departureDay": 16,
          "transportDetails": "Eurostar"
        },
        {
          "city": "Liverpool",
          "country": "Reino Unido",
          "nights": 3,
          "coordinates": {
            "lat": 53.4084,
            "lng": -2.9916
          },
          "highlights": [
            "Beatles Story Museum",
            "Catedral de Liverpool",
            "Old Trafford (Excursión a Manchester)"
          ],
          "keyMilestones": [
            "Tren a Manchester (40 min) para ver Old Trafford"
          ],
          "transportToNext": "Vuelo",
          "transportDuration": "45m",
          "transportTime": "14:00",
          "transportDescription": "Vuelo corto a Dublín.",
          "dailyPlan": [
            {
              "activity": "Manchester Day Trip",
              "description": "Tren ida y vuelta para visitar Old Trafford.",
              "time": "10:00 - 16:00"
            }
          ],
          "estimatedCost": "500",
          "arrivalTime": "11:30",
          "departureTime": "14:00",
          "arrivalDay": 16,
          "departureDay": 19,
          "transportDetails": "Tren Avanti"
        },
        {
          "city": "Dublín",
          "country": "Irlanda",
          "nights": 3,
          "coordinates": {
            "lat": 53.3498,
            "lng": -6.2603
          },
          "highlights": [
            "Trinity College (Book of Kells)",
            "Destilería Jameson",
            "St Stephen's Green"
          ],
          "keyMilestones": [
            "Reservar tour literario o de pubs"
          ],
          "transportToNext": "Vuelo",
          "transportDuration": "2h 30m",
          "transportTime": "10:00",
          "transportDescription": "Vuelo a Madrid.",
          "dailyPlan": [
            {
              "activity": "Historia",
              "description": "Biblioteca del Trinity College.",
              "time": "10:00"
            }
          ],
          "estimatedCost": "600",
          "arrivalTime": "15:00",
          "departureTime": "10:00",
          "arrivalDay": 19,
          "departureDay": 22,
          "transportDetails": "Vuelo"
        },
        {
          "city": "Madrid",
          "country": "España",
          "nights": 3,
          "coordinates": {
            "lat": 40.4168,
            "lng": -3.7038
          },
          "highlights": [
            "Palacio Real",
            "Parque del Retiro",
            "Mercado de San Miguel"
          ],
          "keyMilestones": [
            "Cena final de despedida"
          ],
          "transportToNext": "VUELO SALIDA",
          "transportDuration": "N/A",
          "transportTime": "09:40",
          "transportDescription": "Vuelo de regreso.",
          "dailyPlan": [
            {
              "activity": "Relax",
              "description": "Botes en el Retiro y tapas.",
              "time": "16:00"
            }
          ],
          "estimatedCost": "500",
          "arrivalTime": "13:30",
          "departureTime": "09:40",
          "arrivalDay": 22,
          "departureDay": 25,
          "transportDetails": "Vuelo DUB-MAD"
        }
      ],
      "tipsForArgentinians": [
        "En Ámsterdam, cuidado con las bicis, tienen prioridad sobre el peatón.",
        "Para Liverpool: Si quieren ver un partido real, las entradas se compran con membresía meses antes, o reventa segura (muy cara).",
        "Llevad adaptador de enchufe: Reino Unido/Irlanda usan Tipo G (el de tres patas rectangulares), Europa continental usa Tipo C/F."
      ],
      "totalEstimatedCostUSD": "15800",
      "budgetBreakdown": {
        "accommodation": 7000,
        "food": 4800,
        "transport": 2800,
        "activities": 1000,
        "shopping": 200,
        "currency": "USD",
        "explanation": "Más vuelos internos pueden encarecer el transporte pero se ahorra tiempo."
      },
      "efficiencyStats": {
        "enjoymentTimeHours": 345,
        "transitPercentage": 14,
        "transitTimeHours": 40
      }
    },
    {
      "id": "OPT_C_FUTBOL_INTENSO",
      "comparisonLabel": "Ruta Futbolera y Nocturna",
      "tripTitle": "Estadios, Pubs y Vida Nocturna",
      "summary": "Enfoque en la pasión del grupo: Fútbol y Noche. Se priorizan los fines de semana en ciudades grandes (Londres/Liverpool) para maximizar ambiente de partido y vida nocturna. Suiza se omite por falta de noches asignadas en el itinerario obligatorio.",
      "stops": [
        {
          "city": "Barcelona",
          "country": "España",
          "nights": 3,
          "coordinates": {
            "lat": 41.3851,
            "lng": 2.1734
          },
          "highlights": [
            "Vida nocturna Puerto Olímpico",
            "Camp Nou",
            "Barceloneta"
          ],
          "keyMilestones": [
            "Reservar mesa VIP si salen a discoteca"
          ],
          "transportToNext": "Vuelo",
          "transportDuration": "2h 30m",
          "transportTime": "11:00",
          "transportDescription": "Vuelo a Liverpool/Manchester para iniciar tramo UK.",
          "dailyPlan": [
            {
              "activity": "Llegada forzosa",
              "description": "Llegada MAD 23:30. Tren a BCN 06:00.",
              "time": "00:00 - 08:00"
            }
          ],
          "estimatedCost": "650",
          "arrivalTime": "23:30",
          "departureTime": "11:00",
          "arrivalDay": 1,
          "departureDay": 4,
          "transportDetails": "Tren AVE"
        },
        {
          "city": "Liverpool",
          "country": "Reino Unido",
          "nights": 3,
          "coordinates": {
            "lat": 53.4084,
            "lng": -2.9916
          },
          "highlights": [
            "Anfield Road",
            "Mathew Street (Noche)",
            "Museo Marítimo"
          ],
          "keyMilestones": [
            "Foto estatua Beatles"
          ],
          "transportToNext": "Tren / Ferry",
          "transportDuration": "3h 30m",
          "transportTime": "10:00",
          "transportDescription": "Tren y Ferry a Dublín (Holyhead). Experiencia clásica.",
          "dailyPlan": [
            {
              "activity": "The Cavern",
              "description": "Noche de música en vivo.",
              "time": "21:00"
            }
          ],
          "estimatedCost": "550",
          "arrivalTime": "13:00",
          "departureTime": "10:00",
          "arrivalDay": 4,
          "departureDay": 7,
          "transportDetails": "Vuelo BCN-MAN/LPL"
        },
        {
          "city": "Dublín",
          "country": "Irlanda",
          "nights": 3,
          "coordinates": {
            "lat": 53.3498,
            "lng": -6.2603
          },
          "highlights": [
            "Temple Bar (Pub crawl)",
            "Jameson Distillery Bow St",
            "Castillo de Dublín"
          ],
          "keyMilestones": [
            "Cata de Whisky"
          ],
          "transportToNext": "Vuelo",
          "transportDuration": "1h 15m",
          "transportTime": "12:00",
          "transportDescription": "Vuelo a Londres.",
          "dailyPlan": [
            {
              "activity": "Pubs",
              "description": "Recorrido nocturno por Temple Bar.",
              "time": "20:00"
            }
          ],
          "estimatedCost": "650",
          "arrivalTime": "14:00",
          "departureTime": "12:00",
          "arrivalDay": 7,
          "departureDay": 10,
          "transportDetails": "Ferry"
        },
        {
          "city": "Londres",
          "country": "Reino Unido",
          "nights": 4,
          "coordinates": {
            "lat": 51.5074,
            "lng": -0.1278
          },
          "highlights": [
            "Estadio Wembley o Emirates",
            "Piccadilly Circus",
            "Shoreditch (Noche)"
          ],
          "keyMilestones": [
            "Reservar restaurantes de moda en Soho"
          ],
          "transportToNext": "Tren Eurostar",
          "transportDuration": "4h 00m",
          "transportTime": "09:00",
          "transportDescription": "Tren a Ámsterdam directo.",
          "dailyPlan": [
            {
              "activity": "Estadio",
              "description": "Tour de un estadio (Arsenal/Chelsea).",
              "time": "11:00"
            }
          ],
          "estimatedCost": "900",
          "arrivalTime": "13:30",
          "departureTime": "09:00",
          "arrivalDay": 10,
          "departureDay": 14,
          "transportDetails": "Vuelo DUB-LON"
        },
        {
          "city": "Ámsterdam",
          "country": "Países Bajos",
          "nights": 2,
          "coordinates": {
            "lat": 52.3676,
            "lng": 4.9041
          },
          "highlights": [
            "Leidseplein (Noche)",
            "Coffeeshops",
            "Crucero con pizza/bebida"
          ],
          "keyMilestones": [
            "No comprar nada ilegal para llevar fuera del país"
          ],
          "transportToNext": "Tren Thalys",
          "transportDuration": "1h 50m",
          "transportTime": "12:00",
          "transportDescription": "Tren a Bruselas.",
          "dailyPlan": [
            {
              "activity": "Noche",
              "description": "Explorar vida nocturna.",
              "time": "22:00"
            }
          ],
          "estimatedCost": "700",
          "arrivalTime": "14:00",
          "departureTime": "12:00",
          "arrivalDay": 14,
          "departureDay": 16,
          "transportDetails": "Eurostar"
        },
        {
          "city": "Bruselas",
          "country": "Bélgica",
          "nights": 2,
          "coordinates": {
            "lat": 50.8503,
            "lng": 4.3517
          },
          "highlights": [
            "Museo del Cómic",
            "Bares de Cerveza Artesanal",
            "Palacio de Justicia"
          ],
          "keyMilestones": [
            "Comprar chocolates para regalo"
          ],
          "transportToNext": "Tren Thalys",
          "transportDuration": "1h 22m",
          "transportTime": "11:00",
          "transportDescription": "Tren a Paris.",
          "dailyPlan": [
            {
              "activity": "Cerveza",
              "description": "Delirium Café.",
              "time": "19:00"
            }
          ],
          "estimatedCost": "500",
          "arrivalTime": "14:00",
          "departureTime": "11:00",
          "arrivalDay": 16,
          "departureDay": 18,
          "transportDetails": "Thalys"
        },
        {
          "city": "París",
          "country": "Francia",
          "nights": 4,
          "coordinates": {
            "lat": 48.8566,
            "lng": 2.3522
          },
          "highlights": [
            "Moulin Rouge (Show)",
            "Parc des Princes (PSG)",
            "Barrio de Le Marais"
          ],
          "keyMilestones": [
            "Entradas Moulin Rouge (caras, reservar antes)"
          ],
          "transportToNext": "Tren/Vuelo",
          "transportDuration": "2h 00m",
          "transportTime": "10:00",
          "transportDescription": "Vuelo a Madrid o Tren (largo). Vuelo recomendado.",
          "dailyPlan": [
            {
              "activity": "Show",
              "description": "Noche de Cabaret o cena en Montmartre.",
              "time": "21:00"
            }
          ],
          "estimatedCost": "850",
          "arrivalTime": "12:30",
          "departureTime": "10:00",
          "arrivalDay": 18,
          "departureDay": 22,
          "transportDetails": "Thalys"
        },
        {
          "city": "Madrid",
          "country": "España",
          "nights": 3,
          "coordinates": {
            "lat": 40.4168,
            "lng": -3.7038
          },
          "highlights": [
            "Tour Bernabéu",
            "Chueca/Malasaña (Noche)",
            "Compras Salamanca"
          ],
          "keyMilestones": [
            "Últimas compras Zara/Mango (más barato en España)"
          ],
          "transportToNext": "VUELO FINAL",
          "transportDuration": "N/A",
          "transportTime": "09:40",
          "transportDescription": "Fin del viaje.",
          "dailyPlan": [
            {
              "activity": "Fiesta Final",
              "description": "Cena y copas en Malasaña.",
              "time": "21:00"
            }
          ],
          "estimatedCost": "600",
          "arrivalTime": "13:00",
          "departureTime": "09:40",
          "arrivalDay": 22,
          "departureDay": 25,
          "transportDetails": "Vuelo PAR-MAD"
        }
      ],
      "tipsForArgentinians": [
        "Ojo con los horarios de cena: En UK y Holanda las cocinas cierran a las 21:00 (o antes). Solo España cena a las 22:00.",
        "Para entrar a boliches/clubs, mejor ir vestidos 'Smart Casual' (camisa, zapato no deportivo a veces).",
        "El duty free de Barajas T4 es enorme, dejad tiempo antes de subir al avión de vuelta."
      ],
      "totalEstimatedCostUSD": "16500",
      "budgetBreakdown": {
        "accommodation": 7500,
        "food": 5000,
        "transport": 2500,
        "activities": 1000,
        "shopping": 500,
        "currency": "USD",
        "explanation": "Costos aumentados por vida nocturna (alcohol/entradas) y ciudades caras en fin de semana."
      },
      "efficiencyStats": {
        "enjoymentTimeHours": 330,
        "transitPercentage": 13,
        "transitTimeHours": 38
      }
    }
  ],
  "travelerGuide": {
    "generalTips": [
      "Descarguen mapas offline en Google Maps para ahorrar datos.",
      "Lleven adaptadores universales: UK e Irlanda tienen enchufes tipo G (tres patas planas), el resto de Europa tipo C/F.",
      "El agua de la canilla (grifo) es potable en todas estas ciudades. Lleven botella recargable y ahórrense esos euros.",
      "Tax Free: Como argentinos, pidan el formulario de devolución de impuestos (DIVA en España) en compras superiores a cierto monto. ¡Es plata que vuelve!",
      "Caminen: Europa se ve mejor a pie y es gratis. El transporte público úsenlo solo para distancias largas."
    ],
    "cityGuides": [
      {
        "city": "Madrid",
        "localTransport": {
          "bestApp": "Citymapper (infalible para Metro y Bus)",
          "ticketTip": "Compren una sola tarjeta 'Multi' (2,50€) y cárguenle el 'Metrobús' (10 viajes). La pueden usar los tres a la vez pasando la tarjeta uno por uno.",
          "costEstimate": "1,22€ por viaje con el bono de 10"
        },
        "moneyTactics": {
          "tipping": "No es obligatoria. Si el servicio fue excelente, dejen el cambio o 1-2 euros. Nadie los va a mirar mal si no dejan nada.",
          "cashOrCard": "Aceptan tarjeta hasta para un café, pero tengan algo de efectivo para bares muy viejos."
        },
        "safetyAlerts": [
          "Pickpockets (carteristas) en Puerta del Sol y Gran Vía.",
          "La estafa del romero: señoras que te ofrecen una ramita 'gratis' y luego te exigen dinero montando un escándalo."
        ],
        "hiddenGems": [
          "Jardines del Príncipe de Anglona (un oasis secreto en La Latina).",
          "Ermita de San Antonio de la Florida (frescos de Goya gratis)."
        ],
        "foodieTips": "Bocadillo de calamares en 'La Campana' (Plaza Mayor) por menos de 4€. Mercado de San Miguel para ver, Mercado de Antón Martín para comer barato."
      },
      {
        "city": "Barcelona",
        "localTransport": {
          "bestApp": "Citymapper o TMB App",
          "ticketTip": "La T-Casual (10 viajes) es personal e intransferible (no la pueden compartir). Si van a moverse poco, compren la T-Familiar (8 viajes, multipersonal) para compartir entre los 3.",
          "costEstimate": "Aprox 1,20€ por viaje con tarjeta"
        },
        "moneyTactics": {
          "tipping": "Igual que Madrid. Redondeo del cambio.",
          "cashOrCard": "Tarjeta reina, pero ojo en kioskos pequeños."
        },
        "safetyAlerts": [
          "Las Ramblas y el Metro son zona roja de carteristas. Mochila siempre adelante.",
          "Juego de los trileros (bolita y vasos): no se detengan ni a mirar, es para robarles mientras se distraen."
        ],
        "hiddenGems": [
          "Bunkers del Carmel (la mejor vista panorámica gratis, lleven picnic).",
          "Recinto Modernista de Sant Pau (menos lleno que la Sagrada Familia)."
        ],
        "foodieTips": "Carrer de Blai para ruta de pinchos baratos (1€ o 1,50€ cada uno). La Boquería es cara, vayan al Mercado de Santa Caterina."
      },
      {
        "city": "París",
        "localTransport": {
          "bestApp": "Citymapper o Bonjour RATP",
          "ticketTip": "Compren la tarjeta 'Navigo Easy' (2€) y cárguenle un 'Carnet' (pack de 10 viajes digitales). Sale mucho más barato que comprar tickets sueltos de papel.",
          "costEstimate": "1,73€ por viaje con el pack de 10"
        },
        "moneyTactics": {
          "tipping": "El servicio ('Service Compris') ya está incluido en la cuenta (15%). Dejar propina es solo si el mozo fue un genio.",
          "cashOrCard": "Tarjeta en todos lados. Visa y Mastercard sin problema."
        },
        "safetyAlerts": [
          "Estafa del anillo de oro: alguien 'encuentra' un anillo en el piso y te lo quiere vender/regalar.",
          "La 'pulserita' en Sacré-Cœur: tipos que te atan una cuerda al dedo a la fuerza y te piden plata."
        ],
        "hiddenGems": [
          "Promenade Plantée (Coulée verte): un parque lineal elevado, gratis y hermoso.",
          "Las Arenas de Lutecia (ruinas romanas gratis donde juegan a la petanca)."
        ],
        "foodieTips": "Falafel en 'L'As du Fallafel' (Le Marais) para comer parado. Crêpes en puestos callejeros del Barrio Latino."
      },
      {
        "city": "Ámsterdam",
        "localTransport": {
          "bestApp": "9292 o Google Maps",
          "ticketTip": "Usen OVpay: pasen directamente su tarjeta de crédito/débito contactless o el celular por el lector al entrar y salir (check-in/check-out). Es la tarifa más justa sin comprar tarjetas extra.",
          "costEstimate": "Depende la distancia, base aprox 1,08€ + km"
        },
        "moneyTactics": {
          "tipping": "No se espera. Redondear la cuenta es suficiente.",
          "cashOrCard": "Muchos lugares son 'Pin Only' (SOLO tarjeta). El efectivo a veces no te lo aceptan."
        },
        "safetyAlerts": [
          "No caminen por la bicisenda (carril rojo). Los ciclistas los atropellarán sin piedad.",
          "Vendedores callejeros de 'bicicletas baratas' (son robadas y es delito comprarles)."
        ],
        "hiddenGems": [
          "Begijnhof: un patio interior medieval escondido y silencioso en pleno centro.",
          "Biblioteca OBA (cerca de la estación central): suban gratis al último piso para una vista genial."
        ],
        "foodieTips": "Arenque crudo (Haring) en los puestos callejeros (Frens Haringhandel). Papas fritas en 'Vleminckx'. Comida de pared en FEBO."
      },
      {
        "city": "Bruselas",
        "localTransport": {
          "bestApp": "STIB-MIVB",
          "ticketTip": "Usen el pago contactless (tarjeta o celular) directamente en los validadores grises del metro/bus. Es más barato que el ticket de papel.",
          "costEstimate": "2,10€ por viaje (tope diario de 7,50€)"
        },
        "moneyTactics": {
          "tipping": "Servicio incluido. Redondeo opcional.",
          "cashOrCard": "Tarjeta ampliamente aceptada."
        },
        "safetyAlerts": [
          "Eviten la zona alrededor de la estación Gare du Midi (Brussel-Zuid) tarde a la noche.",
          "Ojo con dejar celulares en la mesa de las terrazas."
        ],
        "hiddenGems": [
          "El ascensor de Poelaert (vistas gratis de la ciudad baja).",
          "Parque del Cincuentenario para picnic."
        ],
        "foodieTips": "Frites (papas) en 'Maison Antoine' (Place Jourdan). Waffles callejeros (el 'Gaufre de Liège' es el dulce, el de Bruselas es el rectangular)."
      },
      {
        "city": "Londres",
        "localTransport": {
          "bestApp": "Citymapper (Es Dios acá)",
          "ticketTip": "NO compren tickets de papel ni la tarjeta Oyster física (cuesta 7£). Usen su tarjeta de débito/crédito contactless directamente en los molinetes. El sistema calcula automáticamente el 'Daily Cap' (tope diario) y no les cobra de más.",
          "costEstimate": "Tope diario zona 1-2 aprox 8,50£ (viajes ilimitados)"
        },
        "moneyTactics": {
          "tipping": "Cuidado: revisen la cuenta. A menudo ya suman un 12.5% de 'Service Charge'. Si está, no dejen más.",
          "cashOrCard": "Londres es casi 100% Cashless. Muchos cafés y bares NO aceptan efectivo."
        },
        "safetyAlerts": [
          "Motochorros (Moped gangs): roban celulares a peatones distraídos cerca del cordón de la vereda.",
          "Falsos policías que piden revisar tu billetera."
        ],
        "hiddenGems": [
          "Leadenhall Market (arquitectura increíble, escenario de Harry Potter).",
          "Sky Garden (vistas gratis, pero hay que reservar entrada online con semanas de antelación)."
        ],
        "foodieTips": "Borough Market para muestras gratis y comida al paso. Beigel Bake en Brick Lane (abierto 24hs, barato y mítico)."
      },
      {
        "city": "Liverpool",
        "localTransport": {
          "bestApp": "Merseytravel o Google Maps",
          "ticketTip": "El centro es muy caminable. Si van a Anfield o Everton, el bus es barato. El 'Saveaway ticket' sirve para tren y bus fuera de hora pico.",
          "costEstimate": "Aprox 2.20£ bus individual"
        },
        "moneyTactics": {
          "tipping": "10% en restaurantes si no está incluido.",
          "cashOrCard": "Tarjeta preferida."
        },
        "safetyAlerts": [
          "Zonas de fiesta (Concert Square) pueden ponerse muy intensas con borrachos a la noche, pero suelen ser amigables.",
          "Eviten callejones oscuros fuera del centro."
        ],
        "hiddenGems": [
          "La sala de lectura Picton en la Biblioteca Central (parece Hogwarts).",
          "Baltic Triangle (arte callejero y bares hipsters)."
        ],
        "foodieTips": "Prueben el 'Scouse' (guiso local). Baltic Market es ideal para comida callejera variada bajo techo."
      },
      {
        "city": "Dublín",
        "localTransport": {
          "bestApp": "TFI Live",
          "ticketTip": "El efectivo en buses NO da cambio (se quedan con la diferencia). Compren una 'Leap Card' (Visitor o normal) en un kiosco para tener descuento en las tarifas.",
          "costEstimate": "2,00€ tarifa plana con TFI 90 min (usando Leap Card)"
        },
        "moneyTactics": {
          "tipping": "10-15% en pubs con servicio a la mesa y restaurantes.",
          "cashOrCard": "Tarjeta en casi todos lados, pero efectivo útil en pubs rurales (no tanto en Dublín centro)."
        },
        "safetyAlerts": [
          "Grupos de adolescentes ('chavs') buscando problemas, ignórenlos.",
          "Temple Bar a la noche es caro y caótico, cuiden sus pertenencias entre la multitud."
        ],
        "hiddenGems": [
          "Chester Beatty Library (museo gratis increíble detrás del castillo).",
          "Phoenix Park (busquen los ciervos salvajes)."
        ],
        "foodieTips": "Fish and Chips en 'Leo Burdock'. Burritos gigantes en 'Boojum' (favorito estudiantil barato)."
      }
    ]
  },
  "tripRequirements": {
    "visaInfo": {
      "title": "Requisitos de Visa y Entrada para Ciudadanos Argentinos en Europa",
      "details": "Como ciudadano argentino, disfrutas de acceso sin visa a la Zona Schengen (España, Francia, Países Bajos, Bélgica) por hasta 90 días dentro de un período de 180 días con fines turísticos o de negocios. Sin embargo, a partir de mediados de 2025, será obligatorio obtener una autorización de viaje ETIAS (Sistema Europeo de Información y Autorización de Viajes) antes de tu viaje a la Zona Schengen. Para el Reino Unido, no se requiere visa para estancias turísticas de hasta 6 meses. Para Irlanda, no se requiere visa para estancias turísticas de hasta 90 días. Asegúrate de que tu pasaporte tenga una validez mínima de 6 meses a partir de la fecha prevista de salida del último país, y ten a mano pruebas de fondos suficientes y un billete de regreso o de continuación.",
      "isEtiasRequired": true
    },
    "healthInfo": {
      "vaccinations": "Se recomiendan las vacunas de rutina (sarampión, paperas, rubéola, tétanos, difteria, tos ferina). No hay vacunas obligatorias específicas para viajeros provenientes de Argentina a estos países europeos. Consulta a tu médico al menos 4-6 semanas antes de viajar para cualquier recomendación personalizada.",
      "insuranceAdvice": "Es fundamental contar con un seguro de viaje integral que cubra gastos médicos, hospitalización y repatriación. Aunque algunos países europeos tienen sistemas de salud públicos, como no eres ciudadano de la UE, no eres elegible para la Tarjeta Sanitaria Europea (EHIC). Un buen seguro te proporcionará tranquilidad ante cualquier emergencia de salud."
    },
    "currencyStrategy": {
      "currencies": [
        "EUR",
        "GBP"
      ],
      "tips": "En España, Francia, Países Bajos, Bélgica e Irlanda, la moneda es el Euro (EUR). En el Reino Unido, la moneda es la Libra Esterlina (GBP). Es recomendable utilizar tarjetas de crédito/débito para la mayoría de las transacciones y llevar una pequeña cantidad de efectivo para gastos menores o lugares que no acepten tarjeta. Informa a tu banco sobre tus fechas y destinos de viaje para evitar bloqueos de tarjeta. Evita cambiar grandes sumas de dinero en aeropuertos, ya que suelen ofrecer tipos de cambio menos favorables."
    },
    "techSpecs": {
      "plugTypes": [
        "Type C",
        "Type F",
        "Type G"
      ],
      "voltage": "230V, 50Hz",
      "adapterAdvice": "En España, Francia, Países Bajos y Bélgica se utilizan enchufes tipo C y F. En el Reino Unido e Irlanda se utiliza el enchufe tipo G. Necesitarás un adaptador universal que sea compatible con estos tipos de enchufes para cargar tus dispositivos. Asegúrate de que tus aparatos electrónicos sean compatibles con un voltaje de 230V; la mayoría de los cargadores modernos (teléfonos, laptops) son multivoltaje (100-240V)."
    },
    "survivalPhrases": [
      {
        "language": "Francés",
        "phrases": [
          {
            "original": "Bonjour",
            "translated": "Hola / Buenos días",
            "pronunciation": "bon-shoor"
          },
          {
            "original": "S'il vous plaît",
            "translated": "Por favor",
            "pronunciation": "seel voo pleh"
          },
          {
            "original": "Merci",
            "translated": "Gracias",
            "pronunciation": "mer-see"
          },
          {
            "original": "Oui / Non",
            "translated": "Sí / No",
            "pronunciation": "wee / non"
          },
          {
            "original": "Combien ça coûte ?",
            "translated": "¿Cuánto cuesta?",
            "pronunciation": "kom-byen sa koot"
          },
          {
            "original": "Au secours",
            "translated": "Ayuda",
            "pronunciation": "o-sek-oor"
          }
        ]
      },
      {
        "language": "Neerlandés",
        "phrases": [
          {
            "original": "Hallo / Goedendag",
            "translated": "Hola / Buenos días",
            "pronunciation": "hah-low / khoo-duh-dakh"
          },
          {
            "original": "Alstublieft",
            "translated": "Por favor",
            "pronunciation": "als-too-bleeft"
          },
          {
            "original": "Dank u wel",
            "translated": "Gracias",
            "pronunciation": "dank oo vel"
          },
          {
            "original": "Ja / Nee",
            "translated": "Sí / No",
            "pronunciation": "yah / nay"
          },
          {
            "original": "Hoeveel kost het?",
            "translated": "¿Cuánto cuesta?",
            "pronunciation": "hoo-veel kost het"
          },
          {
            "original": "Help",
            "translated": "Ayuda",
            "pronunciation": "help"
          }
        ]
      },
      {
        "language": "Inglés",
        "phrases": [
          {
            "original": "Hello / Good morning",
            "translated": "Hola / Buenos días",
            "pronunciation": "he-loh / good mor-ning"
          },
          {
            "original": "Please",
            "translated": "Por favor",
            "pronunciation": "pleez"
          },
          {
            "original": "Thank you",
            "translated": "Gracias",
            "pronunciation": "thank yoo"
          },
          {
            "original": "Yes / No",
            "translated": "Sí / No",
            "pronunciation": "yes / noh"
          },
          {
            "original": "How much does it cost?",
            "translated": "¿Cuánto cuesta?",
            "pronunciation": "how much duz it kost"
          },
          {
            "original": "Help",
            "translated": "Ayuda",
            "pronunciation": "help"
          }
        ]
      }
    ],
    "safetyTips": [
      "Mantén tus pertenencias seguras en todo momento, especialmente en zonas turísticas concurridas y en el transporte público, para evitar carteristas.",
      "Haz fotocopias de tus documentos importantes (pasaporte, visas, billetes) o guárdalas digitalmente en la nube. Lleva contigo solo una fotocopia y deja los originales en un lugar seguro en tu alojamiento.",
      "Familiarízate con los números de emergencia locales (generalmente 112 en la UE y 999/112 en el Reino Unido e Irlanda).",
      "Sé consciente de tu entorno, especialmente por la noche, y evita caminar solo por áreas poco iluminadas o desconocidas.",
      "Utiliza cajeros automáticos en lugares bien iluminados y concurridos. Cúbrete al introducir tu PIN.",
      "Respeta las costumbres y leyes locales. Bebe alcohol con moderación y evita situaciones de riesgo."
    ]
  },
  "version": "1.6"
};
