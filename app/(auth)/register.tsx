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
import { User, Mail, Lock, Phone, ArrowLeft } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useApp, UserMode } from '../../context/AppContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: UserMode }>();
  const { register } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isOwner = mode === 'owner';
  const accentColor = isOwner ? '#8B5CF6' : Colors.primary;

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Campos requeridos', 'Por favor completa nombre, email y contraseña');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, mode || 'user');
      router.replace(isOwner ? '/(owner)/dashboard' : '/(user)/explore');
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <ArrowLeft size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.titleSection}>
              <View style={[styles.modeBadge, { backgroundColor: `${accentColor}25` }]}>
                <Text style={[styles.modeBadgeText, { color: accentColor }]}>
                  {isOwner ? '🏟️ Cuenta de Dueño' : '⚽ Cuenta de Jugador'}
                </Text>
              </View>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>Es gratis y rápido. ¡Empieza a jugar!</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Nombre completo"
                placeholder="Tu nombre"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                leftIcon={<User size={18} color={Colors.textMuted} />}
              />
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
                label="Teléfono (opcional)"
                placeholder="+54 11 1234-5678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                leftIcon={<Phone size={18} color={Colors.textMuted} />}
              />
              <Input
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Lock size={18} color={Colors.textMuted} />}
              />
              <Input
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Lock size={18} color={Colors.textMuted} />}
              />

              <Text style={styles.terms}>
                Al registrarte aceptas nuestros{' '}
                <Text style={[styles.termsLink, { color: accentColor }]}>Términos de Uso</Text>
                {' '}y{' '}
                <Text style={[styles.termsLink, { color: accentColor }]}>Política de Privacidad</Text>
              </Text>

              <Button
                title="Crear cuenta"
                onPress={handleRegister}
                loading={loading}
                style={{ backgroundColor: accentColor } as any}
              />
            </View>

            <View style={styles.loginSection}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(auth)/login', params: { mode } })}
              >
                <Text style={[styles.loginLink, { color: accentColor }]}>Inicia sesión</Text>
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
  titleSection: { marginBottom: 28 },
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
  terms: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginBottom: 20,
    lineHeight: 18,
  },
  termsLink: { fontFamily: 'Inter_600SemiBold' },
  registerBtn: {},
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  loginText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular' },
  loginLink: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
