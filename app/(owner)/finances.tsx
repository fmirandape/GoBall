import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, DollarSign, ArrowDownLeft } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MOCK_BOOKINGS } from '../../data/courts';

const { width } = Dimensions.get('window');

const PERIOD_OPTIONS = ['Día', 'Semana', 'Mes'];

const INCOME_DATA = {
  Día: { total: 285, bookings: 6, chart: [40, 80, 60, 120, 90, 70, 110] },
  Semana: { total: 1890, bookings: 38, chart: [280, 420, 190, 560, 380, 720, 340] },
  Mes: { total: 7420, bookings: 156, chart: [1200, 1650, 890, 2100, 1580] },
};

function SimpleBarChart({ data, maxHeight = 80 }: { data: number[]; maxHeight?: number }) {
  const max = Math.max(...data);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: maxHeight + 20 }}>
      {data.map((val, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={{
              width: '100%',
              height: (val / max) * maxHeight,
              borderRadius: 6,
            }}
          />
        </View>
      ))}
    </View>
  );
}

const TRANSACTION_LABELS: Record<string, string> = {
  soccer: '⚽',
  basketball: '🏀',
  padel: '🎾',
};

export default function OwnerFinancesScreen() {
  const [period, setPeriod] = useState<'Día' | 'Semana' | 'Mes'>('Semana');
  const periodData = INCOME_DATA[period];

  const completedBookings = MOCK_BOOKINGS.filter(b => b.status !== 'cancelled');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finanzas</Text>
          <Text style={styles.headerSubtitle}>Historial de ingresos</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Period selector */}
          <View style={styles.periodRow}>
            {PERIOD_OPTIONS.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                onPress={() => setPeriod(p as any)}
              >
                <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Main income card */}
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.incomeCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.incomeLabel}>Ingresos · {period}</Text>
            <Text style={styles.incomeTotal}>${periodData.total.toLocaleString()}</Text>
            <View style={styles.incomeMeta}>
              <TrendingUp size={14} color={Colors.white} />
              <Text style={styles.incomeGrowth}>+18% vs período anterior</Text>
            </View>

            <View style={styles.chartArea}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 70 }}>
                {periodData.chart.map((val, i) => {
                  const max = Math.max(...periodData.chart);
                  return (
                    <View key={i} style={{ flex: 1, justifyContent: 'flex-end', height: '100%' }}>
                      <View
                        style={{
                          width: '100%',
                          height: (val / max) * 60,
                          backgroundColor: i === periodData.chart.length - 1
                            ? Colors.white
                            : 'rgba(255,255,255,0.35)',
                          borderRadius: 4,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          </LinearGradient>

          {/* Summary cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: Colors.primaryLight }]}>
                <DollarSign size={18} color={Colors.primary} />
              </View>
              <Text style={styles.summaryValue}>{periodData.bookings}</Text>
              <Text style={styles.summaryLabel}>Reservas</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#EFF6FF' }]}>
                <TrendingUp size={18} color="#3B82F6" />
              </View>
              <Text style={styles.summaryValue}>
                ${Math.round(periodData.total / periodData.bookings)}
              </Text>
              <Text style={styles.summaryLabel}>Promedio/reserva</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: '#FFF7ED' }]}>
                <ArrowDownLeft size={18} color="#F97316" />
              </View>
              <Text style={styles.summaryValue}>0</Text>
              <Text style={styles.summaryLabel}>Reembolsos</Text>
            </View>
          </View>

          {/* Breakdown by sport */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Por deporte</Text>
            <View style={styles.sectionCard}>
              {[
                { sport: 'soccer', label: 'Fútbol', amount: Math.round(periodData.total * 0.45), pct: 45 },
                { sport: 'padel', label: 'Pádel', amount: Math.round(periodData.total * 0.35), pct: 35 },
                { sport: 'basketball', label: 'Basketball', amount: Math.round(periodData.total * 0.20), pct: 20 },
              ].map(item => (
                <View key={item.sport} style={styles.sportRow}>
                  <Text style={styles.sportEmoji}>{TRANSACTION_LABELS[item.sport]}</Text>
                  <View style={styles.sportInfo}>
                    <View style={styles.sportLabelRow}>
                      <Text style={styles.sportLabel}>{item.label}</Text>
                      <Text style={styles.sportAmount}>${item.amount}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${item.pct}%`,
                            backgroundColor: item.sport === 'soccer' ? Colors.soccer
                              : item.sport === 'basketball' ? Colors.basketball
                              : Colors.padel
                          }
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.pct}>{item.pct}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent transactions */}
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Últimos pagos recibidos</Text>
            <View style={styles.sectionCard}>
              {completedBookings.map((booking, i) => (
                <View key={booking.id}>
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionIcon}>
                      <Text style={styles.transactionEmoji}>{TRANSACTION_LABELS[booking.sport]}</Text>
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{booking.courtName}</Text>
                      <Text style={styles.transactionSub}>{booking.date} · {booking.startTime}</Text>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text style={styles.transactionAmount}>+${booking.totalPrice}</Text>
                      <Text style={styles.transactionId}>#{booking.paymentId.slice(-6)}</Text>
                    </View>
                  </View>
                  {i < completedBookings.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>
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
  scroll: { padding: 16, paddingBottom: 40 },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  periodBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  periodBtnActive: { backgroundColor: Colors.primary },
  periodText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  periodTextActive: { color: Colors.white },
  incomeCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  incomeLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' },
  incomeTotal: { fontSize: 36, fontFamily: 'Inter_700Bold', color: Colors.white, marginTop: 4, marginBottom: 6 },
  incomeMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  incomeGrowth: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  chartArea: {},
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  section: { marginBottom: 16 },
  lastSection: { marginBottom: 0 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 12 },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sportRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  sportEmoji: { fontSize: 22, width: 28, textAlign: 'center' },
  sportInfo: { flex: 1, gap: 4 },
  sportLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sportLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  sportAmount: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.primary },
  progressBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3 },
  progressFill: { height: '100%', borderRadius: 3 },
  pct: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_600SemiBold', width: 32, textAlign: 'right' },
  transactionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionEmoji: { fontSize: 20 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  transactionSub: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: 2 },
  transactionRight: { alignItems: 'flex-end' },
  transactionAmount: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.primary },
  transactionId: { fontSize: 11, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  rowDivider: { height: 1, backgroundColor: Colors.border },
});
