import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import ScreenNameEnum from '../routes/screenName.enum';
import imageIndex from '../assets/imageIndex';

// Screens
import HomeScreen from '../screen/Bottom/HomeScreen/HomeScreen';
import Questions from '../screen/Bottom/Questions/Questions';
import Analytics from '../screen/Bottom/Analytics/Analytics';
import Profile from '../screen/Bottom/Profile/Profile';
import AIStudyAssistant from '../screen/Bottom/AIStudyAssistant/AIStudyAssistant';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: imageIndex.home,
  Questions: imageIndex.Questions,
  AIStudyAssistant: imageIndex.Container, // ✅ correct key
  Analytics: imageIndex.Analytics,
  Profile: imageIndex.Profileb,
} as const;

type TabIconKey = keyof typeof TAB_ICONS;

const tabIcon = (iconKey: TabIconKey, focused: boolean) => {
  const icon = TAB_ICONS[iconKey];

  // fallback safety
  if (!icon) return null;

  return (
    <View style={[styles.iconContainer, focused && styles.activeIcon]}>
      <Image
        source={icon}
        style={[
          styles.icon,
          { tintColor: focused ? '#6C5CE7' : '#94A3B8' },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      {/* Home */}
      <Tab.Screen
        name={ScreenNameEnum.HomeScreen}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => tabIcon('Home', focused),
        }}
      />

      {/* Questions */}
      <Tab.Screen
        name={ScreenNameEnum.Questions}
        component={Questions}
        options={{
          tabBarLabel: 'Questions',
          tabBarIcon: ({ focused }) => tabIcon('Questions', focused),
        }}
      />

      {/* AI Assistant */}
      <Tab.Screen
        name={ScreenNameEnum.AIStudyAssistant}
        component={AIStudyAssistant}
        options={{
          tabBarLabel: 'AI Assistant',
          tabBarIcon: ({ focused }) =>
            tabIcon('AIStudyAssistant', focused), // ✅ FIXED
        }}
      />

      {/* Analytics */}
      <Tab.Screen
        name={ScreenNameEnum.Analytics}
        component={Analytics}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ focused }) => tabIcon('Analytics', focused),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name={ScreenNameEnum.Profile}
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => tabIcon('Profile', focused),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
    height: 75,

    backgroundColor: '#FFF',
    borderRadius: 20,

    paddingTop: 8,

    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Shadow Android
    elevation: 10,
  },

  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },

  icon: {
    width: 22,
    height: 22,
  },

  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },

  activeIcon: {
    backgroundColor: '#F1F0FF',
    transform: [{ scale: 1.1 }],
  },
});

export default BottomTabNavigator;