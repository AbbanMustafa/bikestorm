import { View } from 'react-native';
import MapView, { Polyline, Marker, Circle, UrlTile } from 'react-native-maps';
import type { BikeRoute } from '@/types/route';

const STADIA_KEY = process.env.EXPO_PUBLIC_STADIA_API_KEY;
const STADIA_TILES = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${STADIA_KEY}`;

interface Props {
  route: BikeRoute;
}

export function RouteMapView({ route }: Props) {
  return (
    <MapView
      style={{ width: '100%', height: 300 }}
      mapType="none"
      initialRegion={{
        latitude: route.centerCoordinate.latitude,
        longitude: route.centerCoordinate.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      }}
      showsCompass={false}
      showsPointsOfInterest={false}
      pitchEnabled={false}
    >
      <UrlTile
        urlTemplate={STADIA_TILES}
        maximumZ={19}
        tileSize={256}
      />
      {/* Glow layer underneath */}
      <Polyline
        coordinates={route.polyline}
        strokeColor="rgba(0,122,255,0.2)"
        strokeWidth={12}
      />
      {/* Main route line */}
      <Polyline
        coordinates={route.polyline}
        strokeColor="#007AFF"
        strokeWidth={4}
        lineJoin="round"
        lineCap="round"
      />
      {/* Start marker */}
      <Circle
        center={route.polyline[0]}
        radius={80}
        fillColor="rgba(52,199,89,0.25)"
        strokeColor="#34C759"
        strokeWidth={2}
      />
      <Marker
        coordinate={route.polyline[0]}
        title="Start"
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <MarkerDot color="#34C759" />
      </Marker>
      {/* End marker */}
      <Circle
        center={route.polyline[route.polyline.length - 1]}
        radius={80}
        fillColor="rgba(255,59,48,0.25)"
        strokeColor="#FF3B30"
        strokeWidth={2}
      />
      <Marker
        coordinate={route.polyline[route.polyline.length - 1]}
        title="End"
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <MarkerDot color="#FF3B30" />
      </Marker>
    </MapView>
  );
}

function MarkerDot({ color }: { color: string }) {
  return (
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: color,
        borderWidth: 3,
        borderColor: 'white',
        boxShadow: `0 2px 8px ${color}`,
      }}
    />
  );
}
