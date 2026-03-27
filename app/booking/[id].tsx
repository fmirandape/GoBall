import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Clock, CreditCard, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MOCK_COURTS, getTimeSlots, Booking } from '../../data/courts';
import { Button } from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(date: Date): string {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addBooking, user } = useApp();

  const court = MOCK_COURTS.find(c => c.id === id);

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [hours, setHours] = useState(1);
  const [step, setStep] = useState<'select' | 'confirm' | 'payment' | 'success'>('select');
  const [processing, setProcessing] = useState(false);
  const [bookingId] = useState(() => `b${Date.now()}`);

  const slots = useMemo(() =>
    getTimeSlots(id || '', formatDate(selectedDate)),
    [id, selectedDate]
  );

  if (!court) return null;

  const totalPrice = court.pricePerHour * hours;

  const handleBook = async () => {
    if (!selectedTime) {
      Alert.alert('Selecciona un horario', 'Por favor elige un horario disponible');
      return;
    }
    setStep('confirm');
  };

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const endHour = parseInt(selectedTime!.split(':')[0]) + hours;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    const booking: Booking = {
      id: bookingId,
      courtId: court.id,
      courtName: court.name,
      courtImage: court.images[0],
      sport: court.sport,
      userId: user?.id || 'user1',
      userName: user?.name || 'Usuario',
      userEmail: user?.email || '',
      date: formatDate(selectedDate),
      startTime: selectedTime!,
      endTime,
      hours,
      totalPrice,
      status: 'confirmed',
      paymentId: `MP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      qrCode: `CANCHA-${bookingId}-${formatDate(selectedDate)}-${selectedTime}`,
    };

    addBooking(booking);
    setProcessing(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <View style={styles.successContainer}>
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.successSafe}>
          <View style={styles.successContent}>
            <View style={styles.successIcon}>
              <CheckCircle2 size={64} color={Colors.white} />
            </View>
            <Text style={styles.successTitle}>¡Reserva confirmada!</Text>
            <Text style={styles.successSubtitle}>Tu cancha está reservada. Muestra el QR al llegar.</Text>

            <View style={styles.successCard}>
              <Text style={styles.successCourtName}>{court.name}</Text>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Fecha</Text>
                <Text style={styles.successValue}>{formatDisplayDate(selectedDate)}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Horario</Text>
                <Text style={styles.successValue}>{selectedTime} – {(parseInt(selectedTime!.split(':')[0]) + hours).toString().padStart(2, '0')}:00</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Total pagado</Text>
                <Text style={[styles.successValue, styles.successPrice]}>${totalPrice}</Text>
              </View>
              <View style={styles.qrContainer}>
                <Text style={styles.qrCode}>📱 QR: CANCHA-{bookingId.slice(-6).toUpperCase()}</Text>
              </View>
            </View>

            <Button
              title="Ver mis reservas"
              onPress={() => router.replace('/(user)/reservations')}
              style={styles.successBtn}
            />
            <TouchableOpacity onPress={() => router.replace('/(user)/explore')}>
              <Text style={styles.successHomeLink}>Volver al inicio</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => step === 'confirm' ? setStep('select') : router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === 'select' ? 'Seleccionar horario' : 'Confirmar reserva'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {['Horario', 'Confirmación', 'Pago'].map((s, i) => {
            const stepIndex = step === 'select' ? 0 : step === 'confirm' ? 1 : 2;
            const isActive = i <= stepIndex;
            return (
              <React.Fragment key={s}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepDot, isActive && styles.stepDotActive]}>
                    <Text style={[styles.stepNum, isActive && styles.stepNumActive]}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{s}</Text>
                </View>
                {i < 2 && <View style={[styles.stepLine, i < stepIndex && styles.stepLineActive]} />}
              </React.Fragment>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {step === 'select' && (
            <>
              {/* Court summary */}
              <View style={styles.courtSummary}>
                <Text style={styles.courtSummaryName}>{court.name}</Text>
                <Text style={styles.courtSummaryPrice}>${court.pricePerHour}/hora</Text>
              </View>

              {/* Date picker */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Calendar size={18} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Selecciona la fecha</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
                  {dates.map((date, i) => {
                    const isSelected = formatDate(date) === formatDate(selectedDate);
                    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[styles.dateChip, isSelected && styles.dateChipActive]}
                        onPress={() => { setSelectedDate(date); setSelectedTime(null); }}
                      >
                        <Text style={[styles.dateDayName, isSelected && styles.dateTextActive]}>
                          {dayNames[date.getDay()]}
                        </Text>
                        <Text style={[styles.dateNum, isSelected && styles.dateTextActive]}>
                          {date.getDate()}
                        </Text>
                        {i === 0 && <Text style={[styles.todayLabel, isSelected && styles.dateTextActive]}>Hoy</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Time slots */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={18} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Horarios disponibles</Text>
                </View>
                <View style={styles.slotsGrid}>
                  {slots.map(slot => (
                    <TouchableOpacity
                      key={slot.time}
                      style={[
                        styles.slot,
                        !slot.available && styles.slotBooked,
                        selectedTime === slot.time && styles.slotSelected,
                      ]}
                      onPress={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                    >
                      <Text style={[
                        styles.slotText,
                        !slot.available && styles.slotBookedText,
                        selectedTime === slot.time && styles.slotSelectedText,
                      ]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border }]} />
                    <Text style={styles.legendText}>Disponible</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                    <Text style={styles.legendText}>Seleccionado</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border }]} />
                    <Text style={styles.legendText}>Ocupado</Text>
                  </View>
                </View>
              </View>

              {/* Duration */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Duración</Text>
                <View style={styles.durationRow}>
                  <TouchableOpacity
                    style={[styles.durationBtn, hours <= 1 && styles.durationBtnDisabled]}
                    onPress={() => hours > 1 && setHours(h => h - 1)}
                  >
                    <Text style={styles.durationBtnText}>−</Text>
                  </TouchableOpacity>
                  <View style={styles.durationDisplay}>
                    <Text style={styles.durationNum}>{hours}</Text>
                    <Text style={styles.durationUnit}>{hours === 1 ? 'hora' : 'horas'}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.durationBtn, hours >= 4 && styles.durationBtnDisabled]}
                    onPress={() => hours < 4 && setHours(h => h + 1)}
                  >
                    <Text style={styles.durationBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {step === 'confirm' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen de reserva</Text>
              <View style={styles.confirmCard}>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Cancha</Text>
                  <Text style={styles.confirmValue}>{court.name}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Fecha</Text>
                  <Text style={styles.confirmValue}>{formatDisplayDate(selectedDate)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Hora inicio</Text>
                  <Text style={styles.confirmValue}>{selectedTime}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Duración</Text>
                  <Text style={styles.confirmValue}>{hours} {hours === 1 ? 'hora' : 'horas'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Precio/hora</Text>
                  <Text style={styles.confirmValue}>${court.pricePerHour}</Text>
                </View>
                <View style={[styles.divider, styles.totalDivider]} />
                <View style={styles.confirmRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>${totalPrice}</Text>
                </View>
              </View>

              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Método de pago</Text>
                <View style={styles.mercadoPagoCard}>
                  <View style={styles.mpLogo}>
                    <Text style={styles.mpLogoText}>MP</Text>
                  </View>
                  <View style={styles.mpInfo}>
                    <Text style={styles.mpTitle}>MercadoPago</Text>
                    <Text style={styles.mpSubtitle}>Pago seguro y protegido</Text>
                  </View>
                  <View style={styles.mpCheck}>
                    <Text style={styles.mpCheckText}>✓</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom action */}
        <View style={styles.bottomBar}>
          {step === 'select' ? (
            <View style={styles.bottomContent}>
              <View>
                <Text style={styles.totalSmall}>Total estimado</Text>
                <Text style={styles.totalBig}>${totalPrice}</Text>
              </View>
              <Button
                title={selectedTime ? 'Continuar' : 'Selecciona un horario'}
                onPress={handleBook}
                disabled={!selectedTime}
                style={styles.bottomBtn}
              />
            </View>
          ) : (
            <View style={styles.bottomContent}>
              <View>
                <Text style={styles.totalSmall}>Total a pagar</Text>
                <Text style={styles.totalBig}>${totalPrice}</Text>
              </View>
              <Button
                title="Pagar con MercadoPago"
                onPress={handlePayment}
                loading={processing}
                style={styles.bottomBtn}
                icon={<CreditCard size={18} color={Colors.white} />}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepNum: { fontSize: 12, fontFamily: 'Inter_700Bold', color: Colors.textMuted },
  stepNumActive: { color: Colors.white },
  stepLabel: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  stepLabelActive: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginBottom: 16 },
  stepLineActive: { backgroundColor: Colors.primary },
  scroll: { padding: 20, paddingBottom: 40 },
  courtSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  courtSummaryName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  courtSummaryPrice: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 0,
  },
  datesScroll: { gap: 8, paddingVertical: 4 },
  dateChip: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 56,
  },
  dateChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateDayName: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_600SemiBold' },
  dateNum: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginTop: 2 },
  todayLabel: { fontSize: 9, color: Colors.primary, fontFamily: 'Inter_600SemiBold', marginTop: 1 },
  dateTextActive: { color: Colors.white },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  slot: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 68,
    alignItems: 'center',
  },
  slotBooked: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  slotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  slotBookedText: { color: Colors.textMuted },
  slotSelectedText: { color: Colors.white },
  legend: { flexDirection: 'row', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  durationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  durationBtnDisabled: { opacity: 0.4 },
  durationBtnText: { fontSize: 24, color: Colors.primary, fontFamily: 'Inter_700Bold' },
  durationDisplay: { alignItems: 'center' },
  durationNum: { fontSize: 36, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  durationUnit: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  confirmCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  confirmLabel: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  confirmValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border },
  totalDivider: { marginVertical: 4 },
  totalLabel: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  totalValue: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.primary },
  paymentSection: {},
  mercadoPagoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginTop: 12,
  },
  mpLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#009ee3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mpLogoText: { color: Colors.white, fontSize: 14, fontFamily: 'Inter_700Bold' },
  mpInfo: { flex: 1 },
  mpTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  mpSubtitle: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  mpCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mpCheckText: { color: Colors.white, fontSize: 13, fontFamily: 'Inter_700Bold' },
  bottomBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  totalSmall: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  totalBig: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.primary },
  bottomBtn: { flex: 1 },
  // Success
  successContainer: { flex: 1 },
  successSafe: { flex: 1 },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIcon: {
    marginBottom: 24,
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 28,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  successCourtName: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  successLabel: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  successValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  successPrice: { color: Colors.primary, fontSize: 16, fontFamily: 'Inter_700Bold' },
  qrContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 10,
    alignItems: 'center',
  },
  qrCode: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  successBtn: { width: '100%', marginBottom: 12 },
  successHomeLink: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
