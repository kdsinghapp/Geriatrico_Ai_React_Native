import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import imageIndex from '../assets/imageIndex';

const icons: Record<string, any> = {
  Home: imageIndex.home,
  Questions: imageIndex.Questions,
  Analytics: imageIndex.Analytics,
  Profile: imageIndex.user1,
};

const LEFT_TABS = ['Home'];
const RIGHT_TABS = ['Analytics', 'Profile'];
const CENTER_TAB = 'Questions';

const CustomTabBar = ({ state, navigation }: any) => {
  const renderTab = (routeName: string) => {
    const routeIndex = state.routes.findIndex((r: any) => r.name === routeName);
    const isFocused = state.index === routeIndex;
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const onPress = () => {
      scale.value = withSpring(1.2, {}, () => {
        scale.value = withSpring(1);
      });
      navigation.navigate(routeName);
    };

    return (
      <TouchableOpacity
        key={routeName}
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.8}
      >
        <Animated.View style={animatedStyle}>
          <Image
            source={icons[routeName]}
            style={[
              styles.icon,
              { tintColor: isFocused ? '#6C4EFF' : '#999' },
            ]}
          />
        </Animated.View>
        <Text style={[styles.label, { color: isFocused ? '#6C4EFF' : '#999' }]}>
          {routeName}
        </Text>
      </TouchableOpacity>
    );
  };

  const centerIndex = state.routes.findIndex((r: any) => r.name === CENTER_TAB);
  const isCenterFocused = state.index === centerIndex;

  const onCenterPress = () => {
    navigation.navigate(CENTER_TAB);
  };

  return (
    <View style={styles.wrapper}>
      {/* Floating Center Button — rendered ABOVE the tab bar */}
      <TouchableOpacity
        onPress={onCenterPress}
        activeOpacity={0.85}
        style={[styles.centerButton, isCenterFocused && styles.centerButtonActive]}
      >
        <Image source={icons[CENTER_TAB]} style={styles.centerIcon} />
      </TouchableOpacity>

      {/* Tab Bar Row */}
      <View style={styles.tabBar}>
        {/* Left Tabs */}
        <View style={styles.tabGroup}>
          {LEFT_TABS.map(renderTab)}
        </View>

        {/* Center Placeholder */}
        <View style={styles.centerPlaceholder} />

        {/* Right Tabs */}
        <View style={styles.tabGroup}>
          {RIGHT_TABS.map(renderTab)}
        </View>
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },

  tabBar: {
    flexDirection: 'row',
    width: '92%',
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },

  tabGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  icon: {
    width: 24,
    height: 24,
    marginBottom: 3,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Space reserved in the row for the floating button
  centerPlaceholder: {
    width: 70,
  },

  // Floating button — overlaps tab bar from above using negative marginBottom
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#6C4EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -20,
    zIndex: 10,

    shadowColor: '#6C4EFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 15,
  },

  centerButtonActive: {
    backgroundColor: '#5538DD',
  },

  centerIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});