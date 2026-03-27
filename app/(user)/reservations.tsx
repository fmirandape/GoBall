import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, QrCode, XCircle, CheckCircle, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../data/courts';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmada', color: '#10B981', bg: '#D1FAE5' },
  pending: { label: 'Pendiente', color: '#F59E0B', bg: '#FEF3C7' },
  cancelled: { label: 'Cancelada', color: '#EF4444', bg: '#FEE2E2' },
  completed: { label: 'Completada', color: '#6B7280', bg: '#F3F4F6' },
};

const SPORT_EMOJIS: Record<string, string> = {
  soccer: '⚽',
  basketball: '🏀',
  padel: '🎾',
};

function BookingCard({ booking, onCancel, onQR }: { booking: Booking; onCancel: () => void; onQR: () => void }) {
  const status = STATUS_CONFIG[booking.status];
  const isActive = booking.status === 'confirmed';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: booking.courtImage }} style={styles.courtImage} />
        <View style={styles.cardHeaderInfo}>
          <View style={styles.sportBadge}>
            <Text style={styles.sportEmoji}>{SPORT_EMOJIS[booking.sport]}</Text>
            <Text style={styles.sportLabel}>{booking.sport === 'soccer' ? 'Fútbol' : booking.sport === 'basketball' ? 'Basketball' : 'Pádel'}</Text>
          </View>
          <Text style={styles.courtName} numberOfLines={2}>{booking.courtName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Calendar size={14} color={Colors.primary} />
          <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={14} color={Colors.primary} />
          <Text style={styles.detailText}>{booking.startTime} – {booking.endTime} ({booking.hours}h)</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total pagado</Text>
          <Text style={styles.price}>${booking.totalPrice}</Text>
        </View>
      </View>

      {isActive && (
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.qrBtn} onPress={onQR}>
            <QrCode size={16} color={Colors.primary} />
            <Text style={styles.qrBtnText}>Ver QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <XCircle size={16} color={Colors.error} />
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function ReservationsScreen() {
  const { bookings, cancelBooking } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [qrBooking, setQrBooking] = useState<Booking | null>(null);

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const historyBookings = bookings.filter(b => b.status === 'cancelled' || b.status === 'completed');

  const shown = activeTab === 'active' ? activeBookings : historyBookings;

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Cancelar reserva',
      `¿Estás seguro que deseas cancelar la reserva en ${booking.courtName}? Se procesará el reembolso según las políticas del local.`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => cancelBooking(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis Reservas</Text>
          <Text style={styles.headerSubtitle}>{activeBookings.length} activas</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Activas ({activeBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              Historial ({historyBookings.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {shown.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'active' ? 'No tienes reservas activas' : 'Sin historial'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'active'
                  ? 'Explora las canchas disponibles y realiza tu primera reserva'
                  : 'Tus reservas pasadas aparecerán aquí'}
              </Text>
            </View>
          ) : (
            shown.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={() => handleCancel(booking)}
                onQR={() => setQrBooking(booking)}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>

      {/* QR Modal */}
      <Modal visible={!!qrBooking} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Código QR</Text>
            <Text style={styles.modalSubtitle}>Muestra este código al llegar a la cancha</Text>

            <View style={styles.qrCard}>
              <View style={styles.qrGrid}>
                {Array.from({ length: 64 }).map((_, i) => (
                  <View
                    key={i}
                    style={[styles.qrCell, Math.random() > 0.4 && styles.qrCellFilled]}
                  />
                ))}
              </View>
              <Text style={styles.qrText}>{qrBooking?.qrCode}</Text>
            </View>

            <View style={styles.qrDetails}>
              <Text style={styles.qrCourtName}>{qrBooking?.courtName}</Text>
              <Text style={styles.qrDateTime}>
                {qrBooking?.date} · {qrBooking?.startTime} – {qrBooking?.endTime}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setQrBooking(null)}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
  },
  headerTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primaryLight },
  tabText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary },
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  activeCard: {
    borderWidth: 1.5,
    borderColor: `${Colors.primary}40`,
  },
  cardHeader: { flexDirection: 'row', padding: 16, gap: 14 },
  courtImage: { width: 80, height: 80, borderRadius: 12 },
  cardHeaderInfo: { flex: 1, gap: 4 },
  sportBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sportEmoji: { fontSize: 14 },
  sportLabel: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  courtName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, lineHeight: 22 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
  cardDetails: { padding: 16, gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  priceLabel: { fontSize: 13, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  price: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.primary },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  qrBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRightWidth: 0.5,
    borderRightColor: Colors.border,
  },
  qrBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  cancelBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.error },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginBottom: 24 },
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  qrGrid: {
    width: 160,
    height: 160,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  qrCell: { width: 16, height: 16, borderRadius: 2, backgroundColor: Colors.white },
  qrCellFilled: { backgroundColor: Colors.black },
  qrText: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  qrDetails: { alignItems: 'center', marginBottom: 24, gap: 4 },
  qrCourtName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  qrDateTime: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  closeBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.white },
});
