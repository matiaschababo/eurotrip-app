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
                    "transportDetails": "Vuelo"
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
                        "Parque del Cincuentenario",
                        "Comer Mejillones con Papas Fritas"
                    ],
                    "keyMilestones": [
                        "Visita guiada al Parlamento",
                        "Tren Eurostar a Londres reservado"
                    ],
                    "transportToNext": "Tren Eurostar",
                    "transportDuration": "2h 05m",
                    "transportTime": "15:00",
                    "transportDescription": "Bruxelles-Midi a Londres St Pancras.",
                    "dailyPlan": [],
                    "estimatedCost": "550",
                    "arrivalTime": "15:50",
                    "departureTime": "15:00",
                    "arrivalDay": 6,
                    "departureDay": 8,
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
                        "Tower Bridge",
                        "Tate Modern",
                        "Covent Garden"
                    ],
                    "keyMilestones": [
                        "Musical en West End",
                        "Torre de Londres entradas"
                    ],
                    "transportToNext": "Tren Avanti",
                    "transportDuration": "2h 20m",
                    "transportTime": "10:00",
                    "transportDescription": "Euston a Liverpool Lime St.",
                    "dailyPlan": [],
                    "estimatedCost": "800",
                    "arrivalTime": "16:05",
                    "departureTime": "10:00",
                    "arrivalDay": 8,
                    "departureDay": 12,
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
                        "Beatles Statue",
                        "Liverpool Cathedral",
                        "Baltic Triangle"
                    ],
                    "keyMilestones": [
                        "Tour guiado Beatles",
                        "Cena en zona portuaria"
                    ],
                    "transportToNext": "Vuelo Corto",
                    "transportDuration": "50m",
                    "transportTime": "12:00",
                    "transportDescription": "Vuelo a Dublín.",
                    "dailyPlan": [],
                    "estimatedCost": "500",
                    "arrivalTime": "12:30",
                    "departureTime": "12:00",
                    "arrivalDay": 12,
                    "departureDay": 15,
                    "transportDetails": "Tren"
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
                        "Dublin Castle",
                        "Grafton Street",
                        "Phoenix Park"
                    ],
                    "keyMilestones": [
                        "Pub Crawl histórico",
                        "Visita destilería Jameson"
                    ],
                    "transportToNext": "Vuelo a Francia",
                    "transportDuration": "1h 45m",
                    "transportTime": "10:00",
                    "transportDescription": "Vuelo Dublín a París (CDG/Orly).",
                    "dailyPlan": [],
                    "estimatedCost": "600",
                    "arrivalTime": "12:45",
                    "departureTime": "10:00",
                    "arrivalDay": 15,
                    "departureDay": 18,
                    "transportDetails": "Vuelo Corto"
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
                        "Museo D'Orsay",
                        "Sainte-Chapelle",
                        "Barrio Latino"
                    ],
                    "keyMilestones": [
                        "Museo D'Orsay entradas jueves noche",
                        "Picnic en Campos de Marte"
                    ],
                    "transportToNext": "Tren TGV",
                    "transportDuration": "6h 30m",
                    "transportTime": "09:00",
                    "transportDescription": "Tren a Madrid (Largo) o Vuelo. Asumimos Tren vía Barcelona o Vuelo directo.",
                    "dailyPlan": [],
                    "estimatedCost": "750",
                    "arrivalTime": "15:30",
                    "departureTime": "09:00",
                    "arrivalDay": 18,
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
                        "Parque del Retiro",
                        "Puerta de Alcalá",
                        "Malasaña (Vida nocturna)"
                    ],
                    "keyMilestones": [
                        "Compras últimas",
                        "Regreso 25 de Mayo"
                    ],
                    "transportToNext": "VUELO DE VUELTA",
                    "transportDuration": "N/A",
                    "transportTime": "09:40",
                    "transportDescription": "Fin del viaje.",
                    "dailyPlan": [],
                    "estimatedCost": "550",
                    "arrivalTime": "16:00",
                    "departureTime": "09:40",
                    "arrivalDay": 22,
                    "departureDay": 25,
                    "transportDetails": "Vuelo"
                }
            ],
            "tipsForArgentinians": [
                "Priorizar Ámsterdam a principios de mayo es clave para ver tulipanes.",
                "Dublín está conectado con vuelos muy baratos (Ryanair) a casi toda Europa."
            ],
            "totalEstimatedCostUSD": "16100",
            "budgetBreakdown": {
                "accommodation": 7100,
                "food": 4800,
                "transport": 2600,
                "activities": 1100,
                "shopping": 500,
                "currency": "USD",
                "explanation": "Similar cost structure, slightly higher transport due to flight inclusions."
            },
            "efficiencyStats": {
                "enjoymentTimeHours": 320,
                "transitPercentage": 14,
                "transitTimeHours": 45
            }
        }
    ],
    "version": "1.6"
};
