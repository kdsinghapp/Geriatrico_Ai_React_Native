import React from 'react';
import { View, Text, ScrollView, Image, ImageBackground } from 'react-native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import styles from './style';
import imageIndex from '../../../assets/imageIndex';
import { color } from '../../../constant';
import ScreenNameEnum from '../../../routes/screenName.enum';
import TextInputField from '../../../compoent/TextInputField';
import useLogin from './useLogin';
import LoadingModal from '../../../utils/Loader';

export default function Login() {
  const {
    credentials,
    errors,
    isLoading,
    navigation,
    handleChange,
    handleLogin,
  } = useLogin();
  return (
    <ImageBackground
      style={styles.container}
      source={imageIndex.Loginbg}
      resizeMode="cover"
    >
      <StatusBarComponent />
      <LoadingModal visible={isLoading} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 50 }}

        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Logo */}
          <Image
            source={imageIndex.appLogo1}
            style={{ height: 140, width: '60%', }}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={[styles.title, {
            marginTop: 15
          }]}>Login</Text>
          <Text style={styles.subTitle}>Already have an account? Login</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 11, color: 'black', fontSize: 15, fontWeight: "600", }}>Email</Text>

            <TextInputField
              placeholder="Email"
              text={credentials.email}
              onChangeText={(value: string) => handleChange('email', value)}
              firstLogo={true}
              img={imageIndex.mess}
              autoFocus
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <Text style={{ marginBottom: 11, color: 'black', fontSize: 15, fontWeight: "600", }}>Password</Text>

            {/* Password */}
            <TextInputField
              placeholder="Password"
              text={credentials.password}
              onChangeText={(value: string) => handleChange('password', value)}
              firstLogo={true}
              img={imageIndex.lock}
              showEye={true}
              label="Password"

              secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>
          {/* Forgot Password */}
          <Text
            style={{ color: '#7625FE', marginVertical: 10 }}
            onPress={() => navigation.navigate(ScreenNameEnum.PasswordReset)}
          >
            Forgot your password?
          </Text>

          {/* Login Button */}
          <View style={{ marginTop: 30 }}>
            <CustomButton title="Login" onPress={handleLogin} />
          </View>
        </View>
      </ScrollView>
      {/* <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 14,
        borderRadius: 20,
        marginBottom: 20,
        marginHorizontal: 11,
        // Shadow (iOS)
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },

        // Shadow (Android)
        elevation: 10,
      }}>
        <Text style={{
          color: 'black',
          fontSize: 14,
          fontWeight: "500",  
        }}>Continue with Google</Text>
      </View> */}
      {/* Sign Up */}
      <Text
        style={{ color: '#909090', textAlign: 'center', marginBottom: 40 }}
        onPress={() => navigation.navigate(ScreenNameEnum.Sinup)}
        suppressHighlighting={true}
      >
        Don't have an account? <Text style={{ color: color.primary, fontSize: 15, fontWeight: "500" }}>Sign Up</Text>
      </Text>
    </ImageBackground>
  );
}
