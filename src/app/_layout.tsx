import { ThemeProvider } from "@/components/theme-provider";
import Stack from "expo-router/stack";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Colors } from "@/utils/colors";

const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : isLiquidGlassAvailable()
    ? {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          color: Colors.label,
        },
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      }
    : {
        headerTransparent: true,
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerBlurEffect: "systemChromeMaterial",
        headerBackButtonDisplayMode: "default",
      };

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={AppleStackPreset}>
        <Stack.Screen
          name="index"
          options={{
            title: "Pokédex",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="pokemon/[id]"
          options={{
            title: "",
          }}
        />
        <Stack.Screen
          name="generation/[id]"
          options={{
            title: "",
            headerLargeTitle: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
