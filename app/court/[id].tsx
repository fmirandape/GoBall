import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, MapPin, Clock, Heart, Share2, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { MOCK_COURTS } from '../../data/courts';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const { width } = Dimensions.get('window');

const SPORT_LABELS: Record<string, string> = {
  soccer: 'Fútbol',
  basketball: 'Basketball',
  padel: 'Pádel',
};
const SPORT_COLORS: Record<string, string> = {
  soccer: Colors.soccer,
  basketball: Colors.basketball,
  padel: Colors.padel,
};

export default function CourtDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  const court = MOCK_COURTS.find(c => c.id === id);
  if (!court) return null;

  const sportColor = SPORT_COLORS[court.sport];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image gallery */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: court.images[currentImage] }} style={styles.mainImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent', 'rgba(0,0,0,0.4)']}
            style={StyleSheet.absoluteFill}
          />

          {/* Nav */}
          <SafeAreaView style={styles.imageNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
              <ArrowLeft size={22} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.navRight}>
              <TouchableOpacity style={styles.navBtn} onPress={() => setLiked(!liked)}>
                <Heart size={22} color={liked ? '#EF4444' : Colors.white} fill={liked ? '#EF4444' : 'none'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <Share2 size={22} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Thumbnails */}
          {court.images.length > 1 && (
            <View style={styles.thumbnails}>
              {court.images.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.thumb, i === currentImage && styles.thumbActive]}
                  onPress={() => setCurrentImage(i)}
                >
                  <Image source={{ uri: img }} style={styles.thumbImage} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Dots */}
          <View style={styles.dots}>
            {court.images.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentImage && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Badge
                label={SPORT_LABELS[court.sport]}
                bgColor={`${sportColor}20`}
                color={sportColor}
              />
              <Text style={styles.courtName}>{court.name}</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceAmount}>${court.pricePerHour}</Text>
              <Text style={styles.priceUnit}>/hora</Text>
            </View>
          </View>

          {/* Rating & location */}
          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              <Star size={16} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.ratingText}>{court.rating}</Text>
              <Text style={styles.reviewCount}>({court.reviewCount} reseñas)</Text>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color={Colors.primary} />
              <Text style={styles.locationText}>{court.address}, {court.city}</Text>
            </View>
          </View>

          {/* Hours */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Clock size={16} color={Colors.primary} />
              <Text style={styles.infoLabel}>Horario:</Text>
              <Text style={styles.infoValue}>{court.openTime} – {court.closeTime}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{court.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {court.amenities.map((a, i) => (
                <View key={i} style={styles.amenityItem}>
                  <View style={styles.amenityIcon}>
                    <Text style={styles.amenityEmoji}>✓</Text>
                  </View>
                  <Text style={styles.amenityLabel}>{a}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Owner */}
          <View style={styles.ownerCard}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>{court.ownerName[0]}</Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerLabel}>Administrado por</Text>
              <Text style={styles.ownerName}>{court.ownerName}</Text>
            </View>
            <ChevronRight size={18} color={Colors.textMuted} />
          </View>
        </View>
      </ScrollView>

      {/* Book button */}
      <View style={styles.bookingBar}>
        <View style={styles.bookingPrice}>
          <Text style={styles.bookingPriceAmount}>${court.pricePerHour}</Text>
          <Text style={styles.bookingPriceUnit}>/hora</Text>
        </View>
        <Button
          title="Reservar ahora"
          onPress={() => router.push({ pathname: '/booking/[id]', params: { id: court.id } })}
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  imageContainer: { width: '100%', height: 300, position: 'relative' },
  mainImage: { width: '100%', height: '100%' },
  imageNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRight: { flexDirection: 'row', gap: 10 },
  thumbnails: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    gap: 6,
  },
  thumb: {
    width: 48,
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: { borderColor: Colors.white },
  thumbImage: { width: '100%', height: '100%' },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: Colors.white, width: 18 },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
  },
  titleLeft: { flex: 1, gap: 6 },
  courtName: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  priceBox: { alignItems: 'flex-end', paddingLeft: 12 },
  priceAmount: { fontSize: 28, fontFamily: 'Inter_700Bold', color: Colors.primary },
  priceUnit: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  metaRow: { gap: 8, marginBottom: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  reviewCount: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  amenityIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityEmoji: { fontSize: 10, color: Colors.primary, fontFamily: 'Inter_700Bold' },
  amenityLabel: { fontSize: 13, color: Colors.textPrimary, fontFamily: 'Inter_600SemiBold' },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 100,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  ownerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerAvatarText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
  ownerInfo: { flex: 1 },
  ownerLabel: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  ownerName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    gap: 16,
  },
  bookingPrice: { flex: 0 },
  bookingPriceAmount: { fontSize: 24, fontFamily: 'Inter_700Bold', color: Colors.primary },
  bookingPriceUnit: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter_400Regular' },
  bookBtn: { flex: 1 },
});
