import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Building2, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { UserMode } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

type ModeOption = { id: UserMode; label: string; subtitle: string; icon: React.ReactNode; color: string };

const MODES: ModeOption[] = [
  {
    id: 'user',
    label: 'Soy Jugador',
    subtitle: 'Reserva canchas cerca de ti',
    icon: <Users size={32} color={Colors.white} />,
    color: Colors.primary,
  },
  {
    id: 'owner',
    label: 'Soy Dueño',
    subtitle: 'Gestiona tus canchas',
    icon: <Building2 size={32} color={Colors.white} />,
    color: '#8B5CF6',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<UserMode | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSelectMode = (mode: UserMode) => {
    setSelectedMode(mode);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleContinue = () => {
    if (!selectedMode) return;
    router.push({ pathname: '/(auth)/login', params: { mode: selectedMode } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0F172A', '#1E3A5F', '#0F172A']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Background decoration */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.logoBg}
            >
              <Text style={styles.logoEmoji}>⚽</Text>
            </LinearGradient>
            <Text style={styles.appName}>GoBall</Text>
            <Text style={styles.tagline}>Reserva tu cancha en segundos</Text>
          </View>

          {/* Mode selector */}
          <View style={styles.modeSection}>
            <Text style={styles.sectionTitle}>¿Cómo quieres ingresar?</Text>

            {MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeCard,
                  selectedMode === mode.id && [styles.modeCardSelected, { borderColor: mode.color }],
                ]}
                onPress={() => handleSelectMode(mode.id)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[`${mode.color}30`, `${mode.color}10`]}
                  style={styles.modeIconBg}
                >
                  {mode.icon}
                </LinearGradient>
                <View style={styles.modeText}>
                  <Text style={styles.modeLabel}>{mode.label}</Text>
                  <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                </View>
                {selectedMode === mode.id && (
                  <View style={[styles.checkDot, { backgroundColor: mode.color }]}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA */}
          <View style={styles.cta}>
            <TouchableOpacity
              style={[styles.continueBtn, !selectedMode && styles.continueBtnDisabled]}
              onPress={handleContinue}
              disabled={!selectedMode}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={selectedMode ? [Colors.primary, Colors.primaryDark] : ['#374151', '#374151']}
                style={styles.continueBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueBtnText}>Continuar</Text>
                <ChevronRight size={20} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(auth)/register', params: { mode: selectedMode || 'user' } })}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                ¿No tienes cuenta? <Text style={styles.registerHighlight}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  safe: { flex: 1 },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${Colors.primary}15`,
    top: -100,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#8B5CF615',
    bottom: 50,
    left: -60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: { alignItems: 'center', paddingTop: 20 },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: { fontSize: 40 },
  appName: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
  modeSection: { gap: 12 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 16,
  },
  modeCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  modeIconBg: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: { flex: 1 },
  modeLabel: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 3,
  },
  modeSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'Inter_400Regular',
  },
  checkDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: Colors.white, fontSize: 14, fontFamily: 'Inter_700Bold' },
  cta: { gap: 16 },
  continueBtn: { borderRadius: 16, overflow: 'hidden' },
  continueBtnDisabled: { opacity: 0.6 },
  continueBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  continueBtnText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },
  registerLink: { alignItems: 'center' },
  registerText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'Inter_400Regular',
  },
  registerHighlight: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
});
