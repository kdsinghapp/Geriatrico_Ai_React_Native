import React from 'react';
import { View, Text, ScrollView, Image, ImageBackground } from 'react-native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import imageIndex from '../../../assets/imageIndex';
import TextInputField from '../../../compoent/TextInputField';

import LoadingModal from '../../../utils/Loader';
import styles from './style';
import CustomHeader from '../../../compoent/CustomHeader';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { useNavigation } from '@react-navigation/native';

import useForgot from './useForgot';
import ErrorText from '../../../compoent/ErrorText';

export default function PasswordReset() {
  const {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleForgot,
  } = useForgot();

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
        <CustomHeader label="Forgot Password" />
        <View style={styles.card}>

          {/* Title */}
          <Text style={[styles.title, {
            marginTop: 15
          }]}>Password Reset</Text>
          <Text style={styles.subTitle}>Please put your email to reset your password</Text>

          <View style={{ marginTop: 20 }}>
            <TextInputField
              placeholder="Email"
              firstLogo={true}
              img={imageIndex.mess}
              autoFocus
              keyboardType="email-address"
              text={credentials.email}
              onChangeText={(value: string) => handleChange('email', value)}
              error={errors.email}
            />
          </View>
          
          <Image source={imageIndex.IllustrationPack}
            style={{
              width: 317,
              height: 255,
              marginTop: 10
            }}
          />
        </View>
      </ScrollView>
      
      <View style={{ marginBottom: 30, marginHorizontal: 15 }}>
        <CustomButton 
          title="Send"
          onPress={handleForgot}
        />
      </View>

    </ImageBackground>
  );
}
