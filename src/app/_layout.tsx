import { ThemeProvider } from "@/components/theme-provider";
import { Stack } from "expo-router";
import * as AC from "@bacons/apple-colors";

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
              backgroundColor: AC.systemBackground as unknown as string,
            },
            headerTitleStyle: {
              color: AC.label as unknown as string,
            },
            headerTintColor: AC.systemBlue as unknown as string,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
