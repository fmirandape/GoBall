import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, MapPin, SlidersHorizontal, Star, Bell, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MOCK_COURTS } from '../../data/courts';
import { CourtCard } from '../../components/cards/CourtCard';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const SPORTS_FILTERS = [
  { id: 'all', label: 'Todos', emoji: '🏆' },
  { id: 'soccer', label: 'Fútbol', emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'padel', label: 'Pádel', emoji: '🎾' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredCourts = useMemo(() => {
    let courts = MOCK_COURTS;
    if (selectedSport !== 'all') {
      courts = courts.filter(c => c.sport === selectedSport);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      courts = courts.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.sport.toLowerCase().includes(q)
      );
    }
    return courts;
  }, [selectedSport, searchQuery]);

  const featured = MOCK_COURTS.filter(c => c.featured);

  const getFirstName = (name: string) => name.split(' ')[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hola, {getFirstName(user?.name || 'Jugador')} 👋</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.primary} />
                <Text style={styles.location}>Buenos Aires, Argentina</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notifBtn}>
                <Bell size={22} color={Colors.textPrimary} />
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => router.push('/(user)/profile')}
              >
                <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sticky Search */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Search size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Busca por deporte, cancha..."
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <SlidersHorizontal size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Sports filter */}
          <View style={styles.sportsSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sportsScroll}>
              {SPORTS_FILTERS.map(sport => (
                <TouchableOpacity
                  key={sport.id}
                  style={[styles.sportChip, selectedSport === sport.id && styles.sportChipActive]}
                  onPress={() => setSelectedSport(sport.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                  <Text style={[styles.sportLabel, selectedSport === sport.id && styles.sportLabelActive]}>
                    {sport.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Featured banner */}
          {selectedSport === 'all' && !searchQuery && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Destacadas</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>Ver todas</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
                {featured.map(court => (
                  <TouchableOpacity
                    key={court.id}
                    style={styles.featuredCard}
                    onPress={() => router.push({ pathname: '/court/[id]', params: { id: court.id } })}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: court.images[0] }} style={styles.featuredImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.featuredGradient}
                    />
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredSport}>
                        {court.sport === 'soccer' ? '⚽' : court.sport === 'basketball' ? '🏀' : '🎾'}
                      </Text>
                      <Text style={styles.featuredName} numberOfLines={1}>{court.name}</Text>
                      <View style={styles.featuredMeta}>
                        <Star size={11} color={Colors.secondary} fill={Colors.secondary} />
                        <Text style={styles.featuredRating}>{court.rating}</Text>
                        <Text style={styles.featuredPrice}>${court.pricePerHour}/hr</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Courts list */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? `Resultados (${filteredCourts.length})` : 'Canchas cercanas'}
              </Text>
              <Text style={styles.countText}>{filteredCourts.length} canchas</Text>
            </View>

            {filteredCourts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyTitle}>Sin resultados</Text>
                <Text style={styles.emptySubtitle}>Prueba con otros filtros o términos de búsqueda</Text>
              </View>
            ) : (
              filteredCourts.map(court => (
                <CourtCard
                  key={court.id}
                  court={court}
                  onPress={() => router.push({ pathname: '/court/[id]', params: { id: court.id } })}
                  distance={`${(Math.random() * 4 + 0.5).toFixed(1)} km`}
                />
              ))
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  greeting: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  location: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportsSection: { paddingBottom: 8, backgroundColor: Colors.background },
  sportsScroll: { paddingHorizontal: 20, gap: 10 },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: Colors.white,
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sportChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sportEmoji: { fontSize: 16 },
  sportLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textSecondary,
  },
  sportLabelActive: { color: Colors.white },
  section: { paddingHorizontal: 20, marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  countText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  featuredScroll: { gap: 12, paddingBottom: 4 },
  featuredCard: {
    width: 200,
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredGradient: { ...StyleSheet.absoluteFillObject },
  featuredInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  featuredSport: { fontSize: 20, marginBottom: 2 },
  featuredName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
    marginBottom: 4,
  },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featuredRating: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  featuredPrice: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});
