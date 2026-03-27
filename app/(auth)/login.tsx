import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useApp, UserMode } from '../../context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: UserMode }>();
  const { login, loginWithGoogle, loginWithApple } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const isOwner = mode === 'owner';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await login(email, password, mode || 'user');
      router.replace(isOwner ? '/(owner)/dashboard' : '/(user)/explore');
    } catch (e) {
      Alert.alert('Error', 'Credenciales incorrectas. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle(mode || 'user');
      router.replace(isOwner ? '/(owner)/dashboard' : '/(user)/explore');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleApple = async () => {
    setAppleLoading(true);
    try {
      await loginWithApple(mode || 'user');
      router.replace(isOwner ? '/(owner)/dashboard' : '/(user)/explore');
    } finally {
      setAppleLoading(false);
    }
  };

  const accentColor = isOwner ? '#8B5CF6' : Colors.primary;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={isOwner ? ['#0F172A', '#1a0a3d'] : ['#0F172A', '#0a2a1a']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <ArrowLeft size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.titleSection}>
              <View style={[styles.modeBadge, { backgroundColor: `${accentColor}25` }]}>
                <Text style={[styles.modeBadgeText, { color: accentColor }]}>
                  {isOwner ? '🏟️ Dueño de cancha' : '⚽ Jugador'}
                </Text>
              </View>
              <Text style={styles.title}>Bienvenido de vuelta</Text>
              <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={18} color={Colors.textMuted} />}
              />
              <Input
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Lock size={18} color={Colors.textMuted} />}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[styles.forgotText, { color: accentColor }]}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                loading={loading}
                style={{ marginBottom: 0, backgroundColor: accentColor } as any}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continuar con</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social buttons */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={handleGoogle}
                  activeOpacity={0.8}
                >
                  {googleLoading
                    ? <Text style={styles.socialBtnText}>...</Text>
                    : <><Text style={styles.socialIcon}>G</Text><Text style={styles.socialBtnText}>Google</Text></>
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={handleApple}
                  activeOpacity={0.8}
                >
                  {appleLoading
                    ? <Text style={styles.socialBtnText}>...</Text>
                    : <><Text style={styles.socialIcon}>🍎</Text><Text style={styles.socialBtnText}>Apple</Text></>
                  }
                </TouchableOpacity>
              </View>
            </View>

            {/* Register */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>¿No tienes cuenta?</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(auth)/register', params: { mode } })}
              >
                <Text style={[styles.registerLink, { color: accentColor }]}>Regístrate gratis</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: { marginBottom: 32 },
  modeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  modeBadgeText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: 'Inter_400Regular',
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  loginBtn: { marginBottom: 0 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 13, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 8,
    backgroundColor: Colors.background,
  },
  socialIcon: { fontSize: 16 },
  socialBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textPrimary,
  },
  registerSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  registerText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  registerLink: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
