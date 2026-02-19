import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as AC from "@bacons/apple-colors";
import { WeatherBanner } from "@/components/weather-banner";
import { RouteCard } from "@/components/route-card";
import { useWeather } from "@/hooks/use-weather";
import { useScoredRoutes } from "@/hooks/use-scored-routes";
import type { SortMode } from "@/types/route";

const SORT_OPTIONS: { mode: SortMode; label: string }[] = [
  { mode: "best", label: "🔥 Best" },
  { mode: "easiest", label: "😎 Easiest" },
  { mode: "shortest", label: "⚡ Shortest" },
];

export default function IndexScreen() {
  const { weather, loading, error, refetch } = useWeather();
  const { sortedRoutes, sortMode, setSortMode } = useScoredRoutes(weather);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0A0A0F' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 16 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="white" />
      }
      stickyHeaderIndices={[1]}
    >
      {/* Weather banner */}
      <View style={{ paddingTop: insets.top }}>
        {loading && !weather && (
          <View
            style={{
              backgroundColor: "#0A0A0F",
              paddingTop: 20,
              paddingBottom: 32,
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              minHeight: 160,
            }}
          >
            <ActivityIndicator size="large" color="white" />
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
              Fetching NYC weather…
            </Text>
          </View>
        )}
        {error && (
          <View style={{ backgroundColor: "#0A0A0F", padding: 20, paddingTop: 24 }}>
            <Text style={{ color: "#FF9500", fontSize: 13 }}>
              ⚠️ Could not load weather — showing estimated conditions.
            </Text>
          </View>
        )}
        {weather && <WeatherBanner weather={weather} />}
      </View>

      {/* Sticky sort bar */}
      <View style={{ backgroundColor: '#0A0A0F', paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          {SORT_OPTIONS.map(({ mode, label }) => (
            <Pressable
              key={mode}
              testID={`sort-button-${mode}`}
              onPress={() => setSortMode(mode)}
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor:
                  sortMode === mode
                    ? (AC.systemBlue as unknown as string)
                    : '#1C1C1E',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color:
                    sortMode === mode
                      ? "white"
                      : 'rgba(235,235,245,0.6)',
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Route list */}
      <View>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: 'rgba(235,235,245,0.6)',
            paddingHorizontal: 4,
            paddingBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {sortedRoutes.length} routes · New York City
        </Text>
        {sortedRoutes.map((route, index) => (
          <RouteCard key={route.id} route={route} testID={`route-card-${index}`} />
        ))}
      </View>
    </ScrollView>
  );
}
