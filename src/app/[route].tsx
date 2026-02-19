import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { NYC_BIKE_ROUTES } from "@/lib/routes-data";
import { RouteMapView } from "@/components/map-view";
import { ConditionsScore } from "@/components/conditions-score";
import { getScoreColor } from "@/lib/scoring";
import { useWeather } from "@/hooks/use-weather";
import { scoreRoute } from "@/lib/scoring";

const DIFFICULTY_STYLES: Record<string, { bg: string; text: string }> = {
  Easy:     { bg: "rgba(52,199,89,0.15)",  text: "#34C759" },
  Moderate: { bg: "rgba(255,149,0,0.15)",  text: "#FF9500" },
  Hard:     { bg: "rgba(255,59,48,0.15)",  text: "#FF3B30" },
};

export default function RouteDetailScreen() {
  const { route: routeId } = useLocalSearchParams<{ route: string }>();
  const { weather } = useWeather();

  const bikeRoute = NYC_BIKE_ROUTES.find((r) => r.id === routeId);

  if (!bikeRoute) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: AC.secondaryLabel as unknown as string }}>Route not found.</Text>
      </View>
    );
  }

  const scored = scoreRoute(bikeRoute, weather?.conditionsScore ?? 75);
  const diff = DIFFICULTY_STYLES[bikeRoute.difficulty];
  const scoreColor = getScoreColor(scored.weatherSuitabilityScore);

  return (
    <>
      <Stack.Screen options={{ title: bikeRoute.name }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: AC.systemGroupedBackground as unknown as string }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Map */}
        <RouteMapView route={bikeRoute} />

        {/* Content */}
        <View style={{ padding: 20, gap: 16 }}>
          {/* Title + score */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: "700", color: AC.label as unknown as string }}>
                {bikeRoute.name}
              </Text>
              <Text style={{ fontSize: 14, color: AC.secondaryLabel as unknown as string }}>
                {bikeRoute.neighborhood}
              </Text>
            </View>
            <View style={{ alignItems: "center", gap: 4 }}>
              <ConditionsScore score={scored.weatherSuitabilityScore} size={64} />
              <Text style={{ fontSize: 11, color: AC.secondaryLabel as unknown as string }}>
                Conditions
              </Text>
            </View>
          </View>

          {/* Badges row */}
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <View style={{ backgroundColor: diff.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: diff.text }}>
                {bikeRoute.difficulty}
              </Text>
            </View>
            <View style={{ backgroundColor: AC.secondarySystemBackground as unknown as string, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: AC.label as unknown as string }}>
                {bikeRoute.distanceMiles} miles
              </Text>
            </View>
            <View style={{ backgroundColor: AC.secondarySystemBackground as unknown as string, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: scoreColor }} />
              <Text style={{ fontSize: 13, fontWeight: "600", color: AC.label as unknown as string }}>
                {scored.suitabilityLabel} conditions
              </Text>
            </View>
          </View>

          {/* Description card */}
          <View
            style={{
              backgroundColor: AC.secondarySystemBackground as unknown as string,
              borderRadius: 14,
              padding: 16,
              borderCurve: "continuous",
            }}
          >
            <Text style={{ fontSize: 15, color: AC.label as unknown as string, lineHeight: 22 }}>
              {bikeRoute.description}
            </Text>
          </View>

          {/* Route stats card */}
          <View
            style={{
              backgroundColor: AC.secondarySystemBackground as unknown as string,
              borderRadius: 14,
              overflow: "hidden",
              borderCurve: "continuous",
            }}
          >
            <StatRow label="Distance" value={`${bikeRoute.distanceMiles} miles`} showBorder />
            <StatRow label="Difficulty" value={bikeRoute.difficulty} showBorder />
            <StatRow label="Neighborhood" value={bikeRoute.neighborhood} showBorder />
            <StatRow label="Weather Score" value={`${scored.weatherSuitabilityScore}/100`} showBorder={false} />
          </View>

          {/* Weather tip */}
          {weather && (
            <View
              style={{
                backgroundColor:
                  scored.weatherSuitabilityScore >= 80
                    ? "rgba(52,199,89,0.1)"
                    : scored.weatherSuitabilityScore >= 50
                    ? "rgba(255,149,0,0.1)"
                    : "rgba(255,59,48,0.1)",
                borderRadius: 14,
                padding: 14,
                borderCurve: "continuous",
                borderWidth: 1,
                borderColor:
                  scored.weatherSuitabilityScore >= 80
                    ? "rgba(52,199,89,0.3)"
                    : scored.weatherSuitabilityScore >= 50
                    ? "rgba(255,149,0,0.3)"
                    : "rgba(255,59,48,0.3)",
              }}
            >
              <Text style={{ fontSize: 13, color: AC.label as unknown as string, lineHeight: 20 }}>
                {scored.weatherSuitabilityScore >= 80
                  ? `✅ Great conditions! ${weather.temperature}°F, ${weather.label.toLowerCase()} with ${weather.windSpeed} mph winds. This route is highly recommended right now.`
                  : scored.weatherSuitabilityScore >= 50
                  ? `⚠️ Fair conditions. ${weather.temperature}°F with ${weather.label.toLowerCase()}. This route is rideable but take extra care.`
                  : `❌ Poor conditions today. ${weather.temperature}°F, ${weather.label.toLowerCase()} with ${weather.windSpeed} mph winds. Consider a different day.`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function StatRow({ label, value, showBorder }: { label: string; value: string; showBorder: boolean }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: showBorder ? 0.5 : 0,
        borderBottomColor: AC.separator as unknown as string,
      }}
    >
      <Text style={{ fontSize: 15, color: AC.secondaryLabel as unknown as string }}>
        {label}
      </Text>
      <Text style={{ fontSize: 15, fontWeight: "500", color: AC.label as unknown as string }}>
        {value}
      </Text>
    </View>
  );
}
