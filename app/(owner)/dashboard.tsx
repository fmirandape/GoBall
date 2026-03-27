import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Calendar, DollarSign, Users, Bell, ChevronRight, Clock } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MOCK_BOOKINGS, MOCK_COURTS } from '../../data/courts';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const WEEKLY_DATA = [
  { day: 'Lun', amount: 280 },
  { day: 'Mar', amount: 420 },
  { day: 'Mié', amount: 190 },
  { day: 'Jue', amount: 560 },
  { day: 'Vie', amount: 380 },
  { day: 'Sáb', amount: 720 },
  { day: 'Dom', amount: 340 },
];

function MiniChart({ data }: { data: typeof WEEKLY_DATA }) {
  const max = Math.max(...data.map(d => d.amount));
  const chartHeight = 60;

  return (
    <View style={chartStyles.container}>
      {data.map((item, i) => (
        <View key={i} style={chartStyles.barContainer}>
          <View style={chartStyles.barWrapper}>
            <View
              style={[
                chartStyles.bar,
                { height: (item.amount / max) * chartHeight },
                i === 5 && chartStyles.barHighlight,
              ]}
            />
          </View>
          <Text style={chartStyles.label}>{item.day}</Text>
        </View>
      ))}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 80 },
  barContainer: { flex: 1, alignItems: 'center', gap: 4 },
  barWrapper: { flex: 1, justifyContent: 'flex-end' },
  bar: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 4,
  },
  barHighlight: { backgroundColor: Colors.white },
  label: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
});

export default function OwnerDashboard() {
  const router = useRouter();
  const { user, bookings } = useApp();

  const ownerBookings = MOCK_BOOKINGS.filter(b => b.status === 'confirmed');
  const todayIncome = ownerBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const ownerCourts = MOCK_COURTS.filter(c => c.ownerId === 'owner1');
  const weeklyTotal = WEEKLY_DATA.reduce((sum, d) => sum + d.amount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header gradient */}
        <LinearGradient
          colors={['#0F172A', '#1E3A5F']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Panel de Control</Text>
                <Text style={styles.ownerName}>{user?.name || 'Carlos Mendez'} 👋</Text>
              </View>
              <TouchableOpacity style={styles.notifBtn}>
                <Bell size={22} color={Colors.white} />
                <View style={styles.notifDot} />
              </TouchableOpacity>
            </View>

            {/* Weekly chart */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartLabel}>Ingresos esta semana</Text>
                  <Text style={styles.chartTotal}>${weeklyTotal.toLocaleString()}</Text>
                </View>
                <View style={styles.trendBadge}>
                  <TrendingUp size={14} color={Colors.primary} />
                  <Text style={styles.trendText}>+23%</Text>
                </View>
              </View>
              <MiniChart data={WEEKLY_DATA} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Stats cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <View style={styles.statIconBg}>
              <DollarSign size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>${todayIncome}</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <View style={[styles.statIconBg, styles.statIconBlue]}>
              <Calendar size={20} color='#3B82F6' />
            </View>
            <Text style={styles.statValue}>{ownerBookings.length}</Text>
            <Text style={styles.statLabel}>Reservas hoy</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <View style={[styles.statIconBg, styles.statIconPurple]}>
              <Users size={20} color='#8B5CF6' />
            </View>
            <Text style={styles.statValue}>89%</Text>
            <Text style={styles.statLabel}>Ocupación</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <View style={[styles.statIconBg, styles.statIconOrange]}>
              <Clock size={20} color='#F97316' />
            </View>
            <Text style={styles.statValue}>{ownerCourts.length}</Text>
            <Text style={styles.statLabel}>Mis canchas</Text>
          </View>
        </View>

        {/* Recent bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reservas de hoy</Text>
            <TouchableOpacity onPress={() => router.push('/(owner)/calendar')}>
              <Text style={styles.seeAll}>Ver calendario</Text>
            </TouchableOpacity>
          </View>

          {MOCK_BOOKINGS.slice(0, 3).map((booking, i) => (
            <TouchableOpacity key={booking.id} style={styles.bookingItem} activeOpacity={0.8}>
              <View style={styles.bookingTime}>
                <Text style={styles.bookingTimeText}>{booking.startTime}</Text>
              </View>
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingCourt}>{booking.courtName}</Text>
                <Text style={styles.bookingUser}>{booking.userName}</Text>
                <Text style={styles.bookingDuration}>{booking.hours}h · {booking.sport === 'soccer' ? '⚽' : booking.sport === 'basketball' ? '🏀' : '🎾'}</Text>
              </View>
              <View style={styles.bookingRight}>
                <Text style={styles.bookingPrice}>${booking.totalPrice}</Text>
                <View style={styles.confirmedBadge}>
                  <Text style={styles.confirmedText}>Conf.</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* My courts summary */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis canchas</Text>
            <TouchableOpacity onPress={() => router.push('/(owner)/courts')}>
              <Text style={styles.seeAll}>Gestionar</Text>
            </TouchableOpacity>
          </View>

          {ownerCourts.slice(0, 2).map(court => (
            <TouchableOpacity key={court.id} style={styles.courtItem} activeOpacity={0.8}>
              <View style={[styles.courtSportDot, {
                backgroundColor: court.sport === 'soccer' ? Colors.soccer : court.sport === 'basketball' ? Colors.basketball : Colors.padel
              }]} />
              <View style={styles.courtInfo}>
                <Text style={styles.courtName}>{court.name}</Text>
                <Text style={styles.courtAddress}>{court.address}</Text>
              </View>
              <View style={styles.courtStats}>
                <Text style={styles.courtPrice}>${court.pricePerHour}/h</Text>
                <View style={[styles.activeDot, court.available && styles.activeDotGreen]} />
              </View>
              <ChevronRight size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerGradient: { paddingBottom: 30 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  ownerName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.white, marginTop: 2 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  chartCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  chartTotal: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.white, marginTop: 2 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  trendText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.primary },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    marginTop: -16,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    gap: 8,
  },
  statCardGreen: {},
  statCardBlue: {},
  statCardPurple: {},
  statCardOrange: {},
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBlue: { backgroundColor: '#EFF6FF' },
  statIconPurple: { backgroundColor: '#F5F3FF' },
  statIconOrange: { backgroundColor: '#FFF7ED' },
  statValue: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  section: { paddingHorizontal: 20, marginTop: 24 },
  lastSection: { marginBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  seeAll: { fontSize: 13, color: Colors.primary, fontFamily: 'Inter_600SemiBold' },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingTime: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bookingTimeText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: Colors.primary },
  bookingInfo: { flex: 1 },
  bookingCourt: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  bookingUser: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginTop: 2 },
  bookingDuration: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: 2 },
  bookingRight: { alignItems: 'flex-end', gap: 4 },
  bookingPrice: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.primary },
  confirmedBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confirmedText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  courtItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  courtSportDot: { width: 12, height: 12, borderRadius: 6 },
  courtInfo: { flex: 1 },
  courtName: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  courtAddress: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginTop: 2 },
  courtStats: { alignItems: 'flex-end', gap: 4 },
  courtPrice: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  activeDotGreen: { backgroundColor: Colors.primary },
});
