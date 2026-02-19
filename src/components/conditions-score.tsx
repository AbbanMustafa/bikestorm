import { View, Text } from 'react-native';
import { getScoreColor } from '@/lib/scoring';

interface Props {
  score: number;
  size?: number;
}

export function ConditionsScore({ score, size = 64 }: Props) {
  const color = getScoreColor(score);
  const fontSize = size * 0.3;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Text
        style={{
          color,
          fontSize,
          fontWeight: '700',
          fontVariant: ['tabular-nums'],
          lineHeight: fontSize * 1.2,
        }}
      >
        {score}
      </Text>
    </View>
  );
}
