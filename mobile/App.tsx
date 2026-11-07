import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { Film, BookOpen, Compass, User } from "lucide-react-native";

import { ReelsScreen } from "./src/screens/ReelsScreen";
import { LibraryScreen } from "./src/screens/LibraryScreen";
import { RoadmapScreen } from "./src/screens/RoadmapScreen";
import { CreatorScreen } from "./src/screens/CreatorScreen";
import { colors } from "./src/lib/theme";

const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: Platform.OS === "ios" ? 84 : 64,
            paddingBottom: Platform.OS === "ios" ? 28 : 10,
            paddingTop: 8,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.2,
          },
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === "Reels") {
              return <Film size={22} color={color} strokeWidth={focused ? 2.5 : 2} />;
            } else if (route.name === "Library") {
              return <BookOpen size={22} color={color} strokeWidth={focused ? 2.5 : 2} />;
            } else if (route.name === "Roadmap") {
              return <Compass size={22} color={color} strokeWidth={focused ? 2.5 : 2} />;
            } else if (route.name === "Creator") {
              return <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />;
            }
            return null;
          },
        })}
        screenListeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        }}
      >
        <Tab.Screen
          name="Reels"
          component={ReelsScreen}
          options={{
            tabBarLabel: "Reels",
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            tabBarLabel: "Library",
          }}
        />
        <Tab.Screen
          name="Roadmap"
          component={RoadmapScreen}
          options={{
            tabBarLabel: "Roadmap",
          }}
        />
        <Tab.Screen
          name="Creator"
          component={CreatorScreen}
          options={{
            tabBarLabel: "Harshith & Claude",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
