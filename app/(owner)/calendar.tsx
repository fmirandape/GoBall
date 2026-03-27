import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ChevronLeft, ChevronRight, Clock, User, Phone } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MOCK_BOOKINGS } from '../../data/courts';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const SPORT_COLORS: Record<string, string> = {
  soccer: Colors.soccer,
  basketball: Colors.basketball,
  padel: Colors.padel,
};

export default function OwnerCalendarScreen() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(now.getDate());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const today = now.getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  // Get bookings for selected day (mock)
  const selectedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
  const dayBookings = MOCK_BOOKINGS.filter(b => {
    // Show some bookings for demo
    const dayNum = selectedDay % 3;
    return dayNum !== 2;
  });

  // Days with bookings (for dots)
  const daysWithBookings = [3, 5, 7, 8, 10, 12, 14, 15, today, today + 1, today + 2, today + 3];

  const calendarDays = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);
    return cells;
  }, [firstDay, daysInMonth]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendario</Text>
          <Text style={styles.headerSubtitle}>Vista de reservas</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Calendar */}
          <View style={styles.calendar}>
            {/* Month nav */}
            <View style={styles.monthNav}>
              <TouchableOpacity style={styles.navBtn} onPress={prevMonth}>
                <ChevronLeft size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.monthYear}>{MONTHS[currentMonth]} {currentYear}</Text>
              <TouchableOpacity style={styles.navBtn} onPress={nextMonth}>
                <ChevronRight size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Day names */}
            <View style={styles.dayNames}>
              {DAYS.map(d => (
                <Text key={d} style={styles.dayName}>{d}</Text>
              ))}
            </View>

            {/* Days grid */}
            <View style={styles.daysGrid}>
              {calendarDays.map((day, i) => {
                if (!day) return <View key={`empty-${i}`} style={styles.dayCell} />;
                const isToday = day === today && currentMonth === now.getMonth() && currentYear === now.getFullYear();
                const isSelected = day === selectedDay;
                const hasDot = daysWithBookings.includes(day);

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      isToday && !isSelected && styles.dayCellToday,
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.dayNum,
                      isSelected && styles.dayNumSelected,
                      isToday && !isSelected && styles.dayNumToday,
                    ]}>
                      {day}
                    </Text>
                    {hasDot && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bookings for selected day */}
          <View style={styles.bookingsSection}>
            <Text style={styles.sectionTitle}>
              {selectedDay} {MONTHS[currentMonth].slice(0, 3)} · {dayBookings.length} reservas
            </Text>

            {dayBookings.length === 0 ? (
              <View style={styles.emptyDay}>
                <Text style={styles.emptyEmoji}>📅</Text>
                <Text style={styles.emptyText}>Sin reservas para este día</Text>
              </View>
            ) : (
              dayBookings.map(booking => (
                <View key={booking.id} style={styles.bookingCard}>
                  <View style={[styles.sportStripe, { backgroundColor: SPORT_COLORS[booking.sport] }]} />
                  <View style={styles.bookingContent}>
                    <View style={styles.bookingHeader}>
                      <View style={styles.timeTag}>
                        <Clock size={12} color={Colors.primary} />
                        <Text style={styles.timeText}>{booking.startTime} – {booking.endTime}</Text>
                      </View>
                      <Text style={styles.bookingPrice}>${booking.totalPrice}</Text>
                    </View>
                    <Text style={styles.bookingCourt}>{booking.courtName}</Text>
                    <View style={styles.clientRow}>
                      <User size={13} color={Colors.textMuted} />
                      <Text style={styles.clientName}>{booking.userName}</Text>
                      <View style={styles.dot2} />
                      <Phone size={13} color={Colors.textMuted} />
                      <Text style={styles.clientEmail}>{booking.userEmail}</Text>
                    </View>
                    <View style={styles.bookingFooter}>
                      <Text style={styles.sportLabel}>
                        {booking.sport === 'soccer' ? '⚽ Fútbol' : booking.sport === 'basketball' ? '🏀 Basketball' : '🎾 Pádel'}
                      </Text>
                      <View style={styles.confirmedBadge}>
                        <Text style={styles.confirmedText}>Confirmada</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginTop: 2 },
  calendar: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYear: { fontSize: 17, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  dayNames: { flexDirection: 'row', marginBottom: 8 },
  dayName: { flex: 1, textAlign: 'center', fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.textMuted },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 2,
  },
  dayCellSelected: { backgroundColor: Colors.primary },
  dayCellToday: { backgroundColor: Colors.primaryLight },
  dayNum: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textPrimary },
  dayNumSelected: { color: Colors.white, fontFamily: 'Inter_700Bold' },
  dayNumToday: { color: Colors.primary, fontFamily: 'Inter_700Bold' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  dotSelected: { backgroundColor: Colors.white },
  bookingsSection: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 12 },
  emptyDay: { alignItems: 'center', paddingVertical: 32 },
  emptyEmoji: { fontSize: 32, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sportStripe: { width: 5 },
  bookingContent: { flex: 1, padding: 14, gap: 6 },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  bookingPrice: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.primary },
  bookingCourt: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clientName: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  clientEmail: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular', flex: 1 },
  dot2: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.textMuted },
  bookingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sportLabel: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  confirmedBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  confirmedText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
});
