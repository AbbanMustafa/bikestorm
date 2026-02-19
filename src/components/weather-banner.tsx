import { View, Text, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as AC from '@bacons/apple-colors';
import { ConditionsScore } from './conditions-score';
import type { WeatherConditions } from '@/types/weather';

interface Props {
  weather: WeatherConditions;
}

function WeatherIcon({ sfSymbol, emoji, size = 32 }: { sfSymbol: string; emoji: string; size?: number }) {
  if (process.env.EXPO_OS === 'ios') {
    return (
      <Image
        source={`sf:${sfSymbol}`}
        style={{ width: size, height: size, tintColor: 'white' }}
        contentFit="contain"
      />
    );
  }
  return <Text style={{ fontSize: size * 0.85 }}>{emoji}</Text>;
}

export function WeatherBanner({ weather }: Props) {
  const { temperature, apparentTemperature, windSpeed, precipitation, label, sfSymbol, emoji, conditionsScore } = weather;

  const scoreLabel =
    conditionsScore >= 80 ? 'Great day to ride!' :
    conditionsScore >= 50 ? 'Rideable conditions' :
    'Rough conditions today';

  return (
    <View style={{ backgroundColor: '#0A0A0F', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 16 }}>
      {/* Top row: icon + temp + score */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <WeatherIcon sfSymbol={sfSymbol} emoji={emoji} size={52} />
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 42, fontWeight: '700', color: 'white', lineHeight: 48 }}>
              {temperature}°F
            </Text>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
              Feels like {apparentTemperature}°F · {label}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', gap: 4 }}>
          <ConditionsScore score={conditionsScore} size={72} />
          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 72 }}>
            Cycling Score
          </Text>
        </View>
      </View>

      {/* Score label */}
      <Text style={{ fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
        {scoreLabel}
      </Text>

      {/* Stats row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingTop: 12,
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(255,255,255,0.15)',
        }}
      >
        <StatItem sfSymbol="wind" emoji="💨" value={`${windSpeed} mph`} label="Wind" />
        <StatItem sfSymbol="drop.fill" emoji="💧" value={`${precipitation.toFixed(1)} mm`} label="Precip" />
        <StatItem sfSymbol="thermometer.medium" emoji="🌡️" value={`${temperature}°F`} label="Temp" />
        <StatItem
          sfSymbol={conditionsScore >= 80 ? 'bicycle' : conditionsScore >= 50 ? 'exclamationmark.triangle' : 'xmark.circle'}
          emoji={conditionsScore >= 80 ? '🚴' : conditionsScore >= 50 ? '⚠️' : '❌'}
          value={conditionsScore >= 80 ? 'Good' : conditionsScore >= 50 ? 'Fair' : 'Poor'}
          label="Riding"
        />
      </View>
    </View>
  );
}

function StatItem({ sfSymbol, emoji, value, label }: { sfSymbol: string; emoji: string; value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      {process.env.EXPO_OS === 'ios' ? (
        <Image
          source={`sf:${sfSymbol}`}
          style={{ width: 18, height: 18, tintColor: 'rgba(255,255,255,0.7)' }}
          contentFit="contain"
        />
      ) : (
        <Text style={{ fontSize: 16 }}>{emoji}</Text>
      )}
      <Text style={{ fontSize: 13, fontWeight: '600', color: 'white' }}>{value}</Text>
      <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{label}</Text>
    </View>
  );
}
