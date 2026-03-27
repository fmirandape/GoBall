import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, color, bgColor, size = 'md', style }: BadgeProps) {
  return (
    <View style={[
      styles.badge,
      size === 'sm' && styles.sm,
      bgColor ? { backgroundColor: bgColor } : styles.defaultBg,
      style,
    ]}>
      <Text style={[
        styles.text,
        size === 'sm' && styles.smText,
        color ? { color } : styles.defaultText,
      ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  defaultBg: { backgroundColor: Colors.primaryLight },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  smText: { fontSize: 10 },
  defaultText: { color: Colors.primary },
});
