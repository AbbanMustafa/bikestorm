import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import * as AC from '@bacons/apple-colors';
import { ConditionsScore } from './conditions-score';
import { getScoreColor } from '@/lib/scoring';
import type { ScoredRoute } from '@/types/route';

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  Easy:     { bg: 'rgba(52,199,89,0.15)',  text: '#34C759' },
  Moderate: { bg: 'rgba(255,149,0,0.15)',  text: '#FF9500' },
  Hard:     { bg: 'rgba(255,59,48,0.15)',  text: '#FF3B30' },
};

interface Props {
  route: ScoredRoute;
}

export function RouteCard({ route }: Props) {
  const diff = DIFFICULTY_STYLES[route.difficulty];
  const scoreColor = getScoreColor(route.weatherSuitabilityScore);

  return (
    <Link href={`/${route.id}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: AC.secondarySystemBackground as unknown as string,
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 16,
          marginBottom: 12,
          gap: 10,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderCurve: 'continuous',
        })}
      >
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: AC.label as unknown as string,
              }}
              numberOfLines={1}
            >
              {route.name}
            </Text>
            <Text style={{ fontSize: 13, color: AC.secondaryLabel as unknown as string }}>
              {route.neighborhood}
            </Text>
          </View>
          <ConditionsScore score={route.weatherSuitabilityScore} size={52} />
        </View>

        {/* Description */}
        <Text
          style={{ fontSize: 14, color: AC.secondaryLabel as unknown as string, lineHeight: 20 }}
          numberOfLines={2}
        >
          {route.description}
        </Text>

        {/* Footer row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Difficulty badge */}
          <View style={{ backgroundColor: diff.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: diff.text }}>{route.difficulty}</Text>
          </View>

          {/* Distance */}
          <Text style={{ fontSize: 13, color: AC.secondaryLabel as unknown as string }}>
            {route.distanceMiles} mi
          </Text>

          {/* Dot separator */}
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: AC.tertiaryLabel as unknown as string }} />

          {/* Suitability dot + label */}
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: scoreColor }} />
          <Text style={{ fontSize: 13, color: AC.secondaryLabel as unknown as string }}>
            {route.suitabilityLabel} conditions
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
