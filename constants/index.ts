export { Colors } from './colors';

export const SPORTS = [
  { id: 'soccer', label: 'Fútbol', emoji: '⚽', color: '#10B981' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀', color: '#F97316' },
  { id: 'padel', label: 'Pádel', emoji: '🎾', color: '#8B5CF6' },
];

export const AMENITIES_ICONS: Record<string, string> = {
  'Vestuarios': '🚿',
  'Estacionamiento': '🅿️',
  'Iluminación': '💡',
  'Agua': '💧',
  'WiFi': 'WiFi',
  'Bar/Cafetería': '☕',
  'Gradas': '🏟️',
  'Árbitro': '👨‍⚖️',
  'Equipamiento': '👟',
  'Duchas': '🚿',
};

export const CURRENCY = 'USD';
export const CURRENCY_SYMBOL = '$';

export const BOOKING_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00',
];

export const CANCELLATION_POLICY = 24; // hours before booking to cancel for full refund
