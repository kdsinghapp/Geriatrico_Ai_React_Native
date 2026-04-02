import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';

import ScreenNameEnum from '../../../routes/screenName.enum';
import { color } from '../../../constant';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { styles } from './style';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  Home: undefined;
};

const Splash: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const auth = useSelector((state: any) => state.auth);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🔥 Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      try {
        if (auth.isLogin) {
          navigation.replace(ScreenNameEnum.BottomTabNavigator as any);
        } else {
          navigation.replace(ScreenNameEnum.OnboardingScreen as any);
        }
      } catch (error) {
        console.error('Navigation error:', error);
        navigation.replace(ScreenNameEnum.OnboardingScreen as any);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [auth]); // ✅ important

  return (
    <SafeAreaView
      style={styles.container}
      
    >
      <StatusBarComponent backgroundColor="white"  
      barStyle="default"
      />



      <Animated.View
        style={[
          styles.centerContent,
          { opacity: fadeAnim }, // 🔥 fade animation applied
        ]}
      >
        <FastImage
          style={styles.logo}
          source={imageIndex.appLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Splash;