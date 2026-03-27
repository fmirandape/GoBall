export interface Court {
  id: string;
  name: string;
  sport: 'soccer' | 'basketball' | 'padel';
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  openTime: string;
  closeTime: string;
  ownerId: string;
  ownerName: string;
  featured: boolean;
  available: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  courtImage: string;
  sport: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentId: string;
  createdAt: string;
  qrCode: string;
}

export const MOCK_COURTS: Court[] = [
  {
    id: '1',
    name: 'Cancha Central FC',
    sport: 'soccer',
    description: 'Cancha de fútbol 5 con césped sintético de última generación. Ideal para partidos y entrenamientos. Cuenta con vestuarios modernos e iluminación LED.',
    address: 'Av. Libertador 1234',
    city: 'Buenos Aires',
    latitude: -34.5989,
    longitude: -58.3744,
    pricePerHour: 45,
    rating: 4.8,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
    ],
    amenities: ['Vestuarios', 'Estacionamiento', 'Iluminación', 'Agua', 'Bar/Cafetería'],
    openTime: '08:00',
    closeTime: '23:00',
    ownerId: 'owner1',
    ownerName: 'Carlos Mendez',
    featured: true,
    available: true,
  },
  {
    id: '2',
    name: 'SportZone Basketball',
    sport: 'basketball',
    description: 'Cancha de basketball con piso de parquet profesional. Aros reglamentarios y líneas pintadas según normativa NBA. Perfecta para ligas y torneos.',
    address: 'Calle Corrientes 567',
    city: 'Buenos Aires',
    latitude: -34.6037,
    longitude: -58.3816,
    pricePerHour: 35,
    rating: 4.6,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1546519638405-a9f4d1f6b8c7?w=800&q=80',
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80',
    ],
    amenities: ['Vestuarios', 'Iluminación', 'Agua', 'Gradas', 'Árbitro'],
    openTime: '08:00',
    closeTime: '22:00',
    ownerId: 'owner2',
    ownerName: 'Ana García',
    featured: true,
    available: true,
  },
  {
    id: '3',
    name: 'Pádel Club Premium',
    sport: 'padel',
    description: 'Canchas de pádel indoor con cristales panorámicos y superficie de césped artificial de alta calidad. Club exclusivo con servicio personalizado.',
    address: 'Puerto Madero 890',
    city: 'Buenos Aires',
    latitude: -34.6121,
    longitude: -58.3653,
    pricePerHour: 60,
    rating: 4.9,
    reviewCount: 201,
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
      'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80',
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
    ],
    amenities: ['Vestuarios', 'Estacionamiento', 'Iluminación', 'Bar/Cafetería', 'WiFi', 'Duchas'],
    openTime: '07:00',
    closeTime: '23:00',
    ownerId: 'owner3',
    ownerName: 'Roberto Silva',
    featured: true,
    available: true,
  },
  {
    id: '4',
    name: 'La Bombonera Fútbol',
    sport: 'soccer',
    description: 'Cancha de fútbol 7 con vista al río. Césped natural de primera calidad, perfecta para partidos familiares y amateur.',
    address: 'Av. del Libertador 4500',
    city: 'Buenos Aires',
    latitude: -34.5861,
    longitude: -58.4191,
    pricePerHour: 40,
    rating: 4.5,
    reviewCount: 67,
    images: [
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
      'https://images.unsplash.com/photo-1510898628272-50f2a9b6a9a8?w=800&q=80',
    ],
    amenities: ['Estacionamiento', 'Iluminación', 'Agua', 'Vestuarios'],
    openTime: '09:00',
    closeTime: '21:00',
    ownerId: 'owner4',
    ownerName: 'Miguel Torres',
    featured: false,
    available: true,
  },
  {
    id: '5',
    name: 'Urban Courts Basketball',
    sport: 'basketball',
    description: 'Cancha outdoor con superficie profesional de hormigón. Ubicada en el corazón del barrio, ideal para partidos 3x3 y entrenamientos.',
    address: 'Villa Crespo 234',
    city: 'Buenos Aires',
    latitude: -34.5978,
    longitude: -58.4412,
    pricePerHour: 25,
    rating: 4.3,
    reviewCount: 45,
    images: [
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80',
      'https://images.unsplash.com/photo-1546519638405-a9f4d1f6b8c7?w=800&q=80',
    ],
    amenities: ['Iluminación', 'Estacionamiento'],
    openTime: '08:00',
    closeTime: '22:00',
    ownerId: 'owner5',
    ownerName: 'Laura Pérez',
    featured: false,
    available: true,
  },
  {
    id: '6',
    name: 'Pádel Palermo',
    sport: 'padel',
    description: 'Tres canchas de pádel outdoor con malla de alta resistencia. Ambiente amigable y clases disponibles para todos los niveles.',
    address: 'Palermo Soho 789',
    city: 'Buenos Aires',
    latitude: -34.5881,
    longitude: -58.4322,
    pricePerHour: 45,
    rating: 4.7,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    ],
    amenities: ['Vestuarios', 'Bar/Cafetería', 'Equipamiento', 'Iluminación'],
    openTime: '08:00',
    closeTime: '23:00',
    ownerId: 'owner6',
    ownerName: 'Sandra López',
    featured: true,
    available: true,
  },
  {
    id: '7',
    name: 'GoalMaster Fútbol 5',
    sport: 'soccer',
    description: 'Canchas techadas con sistema de riego automático. Césped sintético FIFA Quality. Equipamiento completo incluido en el precio.',
    address: 'Belgrano Norte 123',
    city: 'Buenos Aires',
    latitude: -34.5601,
    longitude: -58.4521,
    pricePerHour: 50,
    rating: 4.7,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80',
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
    ],
    amenities: ['Vestuarios', 'Estacionamiento', 'Iluminación', 'Equipamiento', 'Agua'],
    openTime: '08:00',
    closeTime: '23:00',
    ownerId: 'owner1',
    ownerName: 'Carlos Mendez',
    featured: false,
    available: true,
  },
  {
    id: '8',
    name: 'ElitePádel Club',
    sport: 'padel',
    description: 'El club de pádel más moderno de la zona. Canchas indoor con climatización y sonido ambiente. Restaurante y spa incluidos.',
    address: 'Recoleta Premium 456',
    city: 'Buenos Aires',
    latitude: -34.5875,
    longitude: -58.3936,
    pricePerHour: 75,
    rating: 5.0,
    reviewCount: 312,
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    ],
    amenities: ['Vestuarios', 'Estacionamiento', 'Iluminación', 'Bar/Cafetería', 'WiFi', 'Duchas', 'Árbitro'],
    openTime: '06:00',
    closeTime: '24:00',
    ownerId: 'owner3',
    ownerName: 'Roberto Silva',
    featured: true,
    available: true,
  },
  {
    id: '9',
    name: 'Hoops Academy',
    sport: 'basketball',
    description: 'Centro de entrenamiento de basketball con cancha de competición. Equipos disponibles, entrenadores certificados y análisis de rendimiento.',
    address: 'Núñez Deportivo 321',
    city: 'Buenos Aires',
    latitude: -34.5445,
    longitude: -58.4601,
    pricePerHour: 40,
    rating: 4.8,
    reviewCount: 73,
    images: [
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80',
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80',
    ],
    amenities: ['Vestuarios', 'Estacionamiento', 'Iluminación', 'Equipamiento', 'Árbitro', 'Gradas'],
    openTime: '07:00',
    closeTime: '22:00',
    ownerId: 'owner2',
    ownerName: 'Ana García',
    featured: false,
    available: true,
  },
  {
    id: '10',
    name: 'Parque Deportivo Sur',
    sport: 'soccer',
    description: 'Complejo deportivo con múltiples canchas. Fútbol 5, 7 y 11. Ambiente familiar, ideal para ligas y torneos barriales.',
    address: 'Av. Rivadavia 8900',
    city: 'Buenos Aires',
    latitude: -34.6289,
    longitude: -58.4701,
    pricePerHour: 30,
    rating: 4.4,
    reviewCount: 189,
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
    ],
    amenities: ['Estacionamiento', 'Iluminación', 'Agua', 'Bar/Cafetería', 'Vestuarios'],
    openTime: '08:00',
    closeTime: '23:00',
    ownerId: 'owner5',
    ownerName: 'Laura Pérez',
    featured: false,
    available: true,
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    courtId: '1',
    courtName: 'Cancha Central FC',
    courtImage: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80',
    sport: 'soccer',
    userId: 'user1',
    userName: 'Juan Pérez',
    userEmail: 'juan@example.com',
    date: '2026-03-08',
    startTime: '18:00',
    endTime: '19:00',
    hours: 1,
    totalPrice: 45,
    status: 'confirmed',
    paymentId: 'MP-123456',
    createdAt: '2026-03-05T10:30:00',
    qrCode: 'CANCHA-b1-2026-03-08-18:00',
  },
  {
    id: 'b2',
    courtId: '3',
    courtName: 'Pádel Club Premium',
    courtImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
    sport: 'padel',
    userId: 'user1',
    userName: 'Juan Pérez',
    userEmail: 'juan@example.com',
    date: '2026-03-10',
    startTime: '20:00',
    endTime: '21:00',
    hours: 1,
    totalPrice: 60,
    status: 'confirmed',
    paymentId: 'MP-789012',
    createdAt: '2026-03-05T11:00:00',
    qrCode: 'CANCHA-b2-2026-03-10-20:00',
  },
  {
    id: 'b3',
    courtId: '2',
    courtName: 'SportZone Basketball',
    courtImage: 'https://images.unsplash.com/photo-1546519638405-a9f4d1f6b8c7?w=800&q=80',
    sport: 'basketball',
    userId: 'user1',
    userName: 'Juan Pérez',
    userEmail: 'juan@example.com',
    date: '2026-02-20',
    startTime: '16:00',
    endTime: '18:00',
    hours: 2,
    totalPrice: 70,
    status: 'completed',
    paymentId: 'MP-345678',
    createdAt: '2026-02-18T09:00:00',
    qrCode: 'CANCHA-b3-2026-02-20-16:00',
  },
];

export function getTimeSlots(courtId: string, date: string): TimeSlot[] {
  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00',
  ];

  // Simulate some booked slots
  const bookedSlots: Record<string, string[]> = {
    '1': ['10:00', '11:00', '18:00', '19:00'],
    '2': ['09:00', '14:00', '15:00', '20:00'],
    '3': ['11:00', '12:00', '19:00', '20:00', '21:00'],
    '4': ['10:00', '18:00'],
    '5': ['09:00', '17:00'],
    '6': ['08:00', '12:00', '19:00'],
    '7': ['11:00', '20:00'],
    '8': ['09:00', '10:00', '18:00', '19:00', '20:00'],
    '9': ['14:00', '15:00', '16:00'],
    '10': ['10:00', '18:00', '19:00'],
  };

  const booked = bookedSlots[courtId] || [];

  return hours.map(time => ({
    time,
    available: !booked.includes(time),
  }));
}
