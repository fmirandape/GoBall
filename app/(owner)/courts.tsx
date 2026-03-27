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
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { Plus, Edit3, Star, MapPin, DollarSign, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MOCK_COURTS } from '../../data/courts';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const SPORT_COLORS: Record<string, string> = {
  soccer: Colors.soccer,
  basketball: Colors.basketball,
  padel: Colors.padel,
};
const SPORT_LABELS: Record<string, string> = {
  soccer: '⚽ Fútbol',
  basketball: '🏀 Basketball',
  padel: '🎾 Pádel',
};

export default function OwnerCourtsScreen() {
  const ownerCourts = MOCK_COURTS.filter(c => c.ownerId === 'owner1');
  const [courts, setCourts] = useState(ownerCourts.map(c => ({ ...c })));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourtName, setNewCourtName] = useState('');
  const [newCourtAddress, setNewCourtAddress] = useState('');
  const [newCourtPrice, setNewCourtPrice] = useState('');

  const toggleCourt = (id: string) => {
    setCourts(prev => prev.map(c => c.id === id ? { ...c, available: !c.available } : c));
  };

  const handleAddCourt = () => {
    if (!newCourtName || !newCourtAddress || !newCourtPrice) {
      Alert.alert('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }
    Alert.alert('Cancha agregada', `${newCourtName} fue agregada exitosamente (demo)`);
    setShowAddModal(false);
    setNewCourtName('');
    setNewCourtAddress('');
    setNewCourtPrice('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Mis Canchas</Text>
            <Text style={styles.headerSubtitle}>{courts.length} canchas registradas</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Plus size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {courts.map(court => (
            <View key={court.id} style={styles.courtCard}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: court.images[0] }} style={styles.courtImage} />
                <View style={[styles.sportTag, { backgroundColor: `${SPORT_COLORS[court.sport]}20` }]}>
                  <Text style={[styles.sportTagText, { color: SPORT_COLORS[court.sport] }]}>
                    {SPORT_LABELS[court.sport]}
                  </Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.courtName}>{court.name}</Text>
                  <Switch
                    value={court.available}
                    onValueChange={() => toggleCourt(court.id)}
                    trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                    thumbColor={court.available ? Colors.primary : Colors.textMuted}
                  />
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <MapPin size={13} color={Colors.textMuted} />
                    <Text style={styles.metaText} numberOfLines={1}>{court.address}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Star size={14} color={Colors.secondary} fill={Colors.secondary} />
                    <Text style={styles.statValue}>{court.rating}</Text>
                    <Text style={styles.statSub}>({court.reviewCount})</Text>
                  </View>
                  <View style={styles.statItem}>
                    <DollarSign size={14} color={Colors.primary} />
                    <Text style={styles.statValue}>${court.pricePerHour}/h</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statSub}>{court.openTime}–{court.closeTime}</Text>
                  </View>
                </View>

                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, court.available ? styles.statusActive : styles.statusInactive]}>
                    <Text style={[styles.statusText, court.available ? styles.statusTextActive : styles.statusTextInactive]}>
                      {court.available ? '● Activa' : '○ Inactiva'}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.editBtn}>
                    <Edit3 size={15} color={Colors.primary} />
                    <Text style={styles.editBtnText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Add court modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar cancha</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Nombre de la cancha"
              placeholder="Ej: Cancha Norte FC"
              value={newCourtName}
              onChangeText={setNewCourtName}
            />
            <Input
              label="Dirección"
              placeholder="Ej: Av. Corrientes 1234"
              value={newCourtAddress}
              onChangeText={setNewCourtAddress}
            />
            <Input
              label="Precio por hora ($)"
              placeholder="Ej: 45"
              value={newCourtPrice}
              onChangeText={setNewCourtPrice}
              keyboardType="numeric"
            />

            <Button title="Agregar cancha" onPress={handleAddCourt} style={styles.modalBtn} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  headerSubtitle: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', marginTop: 2 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scroll: { padding: 16, paddingBottom: 40 },
  courtCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { position: 'relative' },
  courtImage: { width: '100%', height: 140 },
  sportTag: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  sportTagText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  cardContent: { padding: 16, gap: 10 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courtName: { fontSize: 17, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, flex: 1 },
  metaRow: { gap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular', flex: 1 },
  statsRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  statSub: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusActive: { backgroundColor: Colors.primaryLight },
  statusInactive: { backgroundColor: Colors.background },
  statusText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  statusTextActive: { color: Colors.primary },
  statusTextInactive: { color: Colors.textMuted },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  editBtnText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  modalBtn: { marginTop: 8 },
});
