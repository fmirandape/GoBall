import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Building2, Phone, Mail, Settings, Bell, Shield,
  LogOut, ChevronRight, Star, BarChart2, Users,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';
import { MOCK_COURTS } from '../../data/courts';

function MenuItem({ icon, label, subtitle, onPress, danger = false }: {
  icon: React.ReactNode; label: string; subtitle?: string; onPress: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>{icon}</View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color={danger ? Colors.error : Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function OwnerProfileScreen() {
  const router = useRouter();
  const { user, logout } = useApp();
  const ownerCourts = MOCK_COURTS.filter(c => c.ownerId === 'owner1');

  const avgRating = ownerCourts.reduce((s, c) => s + c.rating, 0) / ownerCourts.length;
  const totalReviews = ownerCourts.reduce((s, c) => s + c.reviewCount, 0);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/welcome'); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView>
            <View style={styles.profileSection}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarText}>{user?.name?.[0] || 'C'}</Text>
              </View>
              <Text style={styles.userName}>{user?.name || 'Carlos Mendez'}</Text>
              <View style={styles.ownerBadge}>
                <Building2 size={12} color="#8B5CF6" />
                <Text style={styles.ownerBadgeText}>Dueño de canchas</Text>
              </View>
              <Text style={styles.userEmail}>{user?.email || 'carlos@canchas.com'}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{ownerCourts.length}</Text>
                <Text style={styles.statLabel}>Canchas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{avgRating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating ⭐</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalReviews}</Text>
                <Text style={styles.statLabel}>Reseñas</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Negocio</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<Building2 size={18} color="#8B5CF6" />}
                label="Mis canchas"
                subtitle={`${ownerCourts.length} canchas registradas`}
                onPress={() => router.push('/(owner)/courts')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<BarChart2 size={18} color="#8B5CF6" />}
                label="Finanzas"
                subtitle="Ingresos y reportes"
                onPress={() => router.push('/(owner)/finances')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Users size={18} color="#8B5CF6" />}
                label="Clientes"
                subtitle="Historial de reservas"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<Mail size={18} color={Colors.primary} />}
                label="Email"
                subtitle={user?.email}
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Phone size={18} color={Colors.primary} />}
                label="Teléfono"
                subtitle={user?.phone || 'No configurado'}
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuración</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<Bell size={18} color={Colors.primary} />}
                label="Notificaciones"
                subtitle="Alertas de nuevas reservas"
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Shield size={18} color={Colors.primary} />}
                label="Seguridad"
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Settings size={18} color={Colors.primary} />}
                label="Ajustes"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={[styles.section, styles.lastSection]}>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<LogOut size={18} color={Colors.error} />}
                label="Cerrar sesión"
                onPress={handleLogout}
                danger
              />
            </View>
          </View>

          <Text style={styles.version}>GoBall Pro v1.0.0 · Panel de Dueño</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: 24 },
  profileSection: { alignItems: 'center', paddingTop: 20, paddingHorizontal: 24, paddingBottom: 20 },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(139,92,246,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: 'rgba(139,92,246,0.4)',
  },
  avatarText: { fontSize: 36, fontFamily: 'Inter_700Bold', color: Colors.white },
  userName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.white, marginBottom: 6 },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(139,92,246,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  ownerBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#C4B5FD' },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.white },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  content: { padding: 20 },
  section: { marginBottom: 20 },
  lastSection: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: { backgroundColor: '#FEE2E2' },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  menuLabelDanger: { color: Colors.error },
  menuSubtitle: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular', marginTop: 8, marginBottom: 40 },
});
