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
  User, Phone, Mail, Settings, Bell, Shield, HelpCircle,
  LogOut, ChevronRight, Star, Trophy, Calendar,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

function MenuItem({
  icon, label, subtitle, onPress, danger = false, badge,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  badge?: string;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        {icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <ChevronRight size={18} color={danger ? Colors.error : Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { user, logout, bookings } = useApp();

  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalPrice, 0);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/welcome'); } },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView>
            <View style={styles.profileSection}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
              </View>
              <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Editar perfil</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{bookings.filter(b => b.status === 'confirmed').length}</Text>
                <Text style={styles.statLabel}>Activas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedBookings}</Text>
                <Text style={styles.statLabel}>Jugadas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>${totalSpent}</Text>
                <Text style={styles.statLabel}>Invertido</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Menu sections */}
        <View style={styles.content}>
          {/* Account */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mi cuenta</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<User size={18} color={Colors.primary} />}
                label="Información personal"
                subtitle={user?.name}
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Phone size={18} color={Colors.primary} />}
                label="Teléfono"
                subtitle={user?.phone || 'No configurado'}
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Mail size={18} color={Colors.primary} />}
                label="Email"
                subtitle={user?.email}
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Actividad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actividad</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<Calendar size={18} color={Colors.basketball} />}
                label="Mis reservas"
                subtitle="Ver todas mis reservas"
                onPress={() => router.push('/(user)/reservations')}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Star size={18} color={Colors.secondary} />}
                label="Canchas favoritas"
                subtitle="Tus canchas guardadas"
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Trophy size={18} color="#8B5CF6" />}
                label="Mis logros"
                subtitle={`${completedBookings} partidos jugados`}
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Ajustes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ajustes</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<Bell size={18} color={Colors.primary} />}
                label="Notificaciones"
                subtitle="Push, email y más"
                onPress={() => {}}
                badge="3"
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Shield size={18} color={Colors.primary} />}
                label="Privacidad y seguridad"
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Settings size={18} color={Colors.primary} />}
                label="Preferencias"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Soporte */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soporte</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon={<HelpCircle size={18} color={Colors.primary} />}
                label="Centro de ayuda"
                onPress={() => {}}
              />
              <View style={styles.menuDivider} />
              <MenuItem
                icon={<Star size={18} color={Colors.primary} />}
                label="Calificar la app"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Logout */}
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

          <Text style={styles.version}>GoBall v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: 24 },
  profileSection: { alignItems: 'center', paddingTop: 20, paddingBottom: 20, paddingHorizontal: 24 },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 36, fontFamily: 'Inter_700Bold', color: Colors.white },
  userName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.white, marginBottom: 4 },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', marginBottom: 14 },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editBtnText: { color: Colors.white, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.white },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  content: { padding: 20 },
  section: { marginBottom: 20 },
  lastSection: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 14,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
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
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 4,
  },
  badgeText: { color: Colors.white, fontSize: 11, fontFamily: 'Inter_700Bold' },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
    marginBottom: 40,
  },
});
