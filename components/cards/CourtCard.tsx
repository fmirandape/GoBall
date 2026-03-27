import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MapPin, Star, Clock } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Court } from '../../data/courts';
import { Badge } from '../ui/Badge';

interface CourtCardProps {
  court: Court;
  onPress: () => void;
  horizontal?: boolean;
  distance?: string;
}

const SPORT_COLORS: Record<string, string> = {
  soccer: Colors.soccer,
  basketball: Colors.basketball,
  padel: Colors.padel,
};

const SPORT_LABELS: Record<string, string> = {
  soccer: 'Fútbol',
  basketball: 'Basketball',
  padel: 'Pádel',
};

export function CourtCard({ court, onPress, horizontal = false, distance }: CourtCardProps) {
  const sportColor = SPORT_COLORS[court.sport];

  if (horizontal) {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.9}>
        <Image source={{ uri: court.images[0] }} style={styles.horizontalImage} />
        <View style={[styles.sportDot, { backgroundColor: sportColor }]} />
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalHeader}>
            <Text style={styles.name} numberOfLines={1}>{court.name}</Text>
            <View style={styles.ratingRow}>
              <Star size={12} color={Colors.secondary} fill={Colors.secondary} />
              <Text style={styles.rating}>{court.rating}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={11} color={Colors.textMuted} />
            <Text style={styles.address} numberOfLines={1}>{court.address}</Text>
          </View>
          <View style={styles.horizontalFooter}>
            <Badge
              label={SPORT_LABELS[court.sport]}
              bgColor={`${sportColor}20`}
              color={sportColor}
              size="sm"
            />
            <Text style={styles.price}>
              <Text style={styles.priceAmount}>${court.pricePerHour}</Text>
              <Text style={styles.priceUnit}>/hr</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: court.images[0] }} style={styles.image} />
        <View style={styles.overlay} />
        <View style={styles.imageTopRow}>
          <Badge
            label={SPORT_LABELS[court.sport]}
            bgColor={`${sportColor}DD`}
            color={Colors.white}
            size="sm"
          />
          {court.featured && (
            <Badge label="⭐ Destacado" bgColor="rgba(245,158,11,0.9)" color={Colors.white} size="sm" />
          )}
        </View>
        <View style={styles.imageBottomRow}>
          <View style={styles.ratingPill}>
            <Star size={12} color={Colors.secondary} fill={Colors.secondary} />
            <Text style={styles.ratingText}>{court.rating}</Text>
            <Text style={styles.reviewCount}>({court.reviewCount})</Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{court.name}</Text>
        <View style={styles.infoRow}>
          <MapPin size={13} color={Colors.textMuted} />
          <Text style={styles.address} numberOfLines={1}>{court.address}</Text>
          {distance && <Text style={styles.distance}>· {distance}</Text>}
        </View>
        <View style={styles.amenitiesRow}>
          {court.amenities.slice(0, 3).map((a, i) => (
            <Text key={i} style={styles.amenityTag}>{a}</Text>
          ))}
        </View>
        <View style={styles.footer}>
          <View style={styles.hoursRow}>
            <Clock size={12} color={Colors.textMuted} />
            <Text style={styles.hours}>{court.openTime} - {court.closeTime}</Text>
          </View>
          <Text style={styles.price}>
            <Text style={styles.priceAmount}>${court.pricePerHour}</Text>
            <Text style={styles.priceUnit}>/hr</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 180 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  imageTopRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  imageBottomRow: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  ratingText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  reviewCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  content: { padding: 16 },
  name: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  address: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  distance: {
    fontSize: 13,
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  amenityTag: {
    fontSize: 11,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hours: { fontSize: 12, color: Colors.textMuted, fontFamily: 'Inter_400Regular' },
  price: {},
  priceAmount: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
  },
  // Horizontal card
  horizontalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  horizontalImage: { width: 90, height: 90 },
  sportDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  horizontalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportChip: {},
  sportLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
