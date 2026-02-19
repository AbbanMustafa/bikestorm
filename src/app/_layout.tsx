import { ThemeProvider } from "@/components/theme-provider";
import { Stack, router } from "expo-router";
import * as AC from "@bacons/apple-colors";
import { Pressable, Text } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0A0A0F" },
          headerTintColor: AC.systemBlue as unknown as string,
          headerTitleStyle: { color: "white" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="[route]"
          options={{
            headerBackTitle: "Routes",
            headerStyle: {
              backgroundColor: '#0A0A0F',
            },
            headerTitleStyle: {
              color: '#FFFFFF',
            },
            headerTintColor: AC.systemBlue as unknown as string,
            headerLeft: () => (
              <Pressable testID="back-button" onPress={() => router.back()}>
                <Text style={{ color: AC.systemBlue as unknown as string, fontSize: 17 }}>
                  {"‹ Routes"}
                </Text>
              </Pressable>
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
