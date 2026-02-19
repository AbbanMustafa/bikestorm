import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export function ThemeProvider(props: { children: React.ReactNode }) {
  return (
    <RNTheme value={DarkTheme}>
      {props.children}
    </RNTheme>
  );
}
