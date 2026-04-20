import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../../../utils/Loader';
import imageIndex from '../../../assets/imageIndex';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import CustomInput from '../../../compoent/CustomInput';
import Icon from '../../../compoent/Icon';
import { styles } from './style';
import { useCreateNewPassword } from './useCreateNewPassword';
import CustomHeader from '../../../compoent/CustomHeader';

export default function CreatePassword() {
  const {
    password,
    confirmPassword,
    passwordError,
    confirmPasswordError,
    isLoading,
    handlePassText,
    handleCPassText,
    handleSetPassword,
    navigation
  } = useCreateNewPassword();

  return (
    <ImageBackground
      source={imageIndex.Loginbg}
      style={styles.background}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.container}>
        <StatusBarComponent />
        {isLoading && <Loading visible={isLoading} />}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={imageIndex.BackLeft} style={styles.backIcon} />
          </TouchableOpacity> */}
          <CustomHeader label={"Back"} />
          <View style={styles.headerContainer}>
            <Text allowFontScaling={false} style={styles.title}>Create New Password</Text>
            <Text allowFontScaling={false} style={styles.description}>Your new password must be different from previous used passwords.</Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              placeholder="New Password"
              leftIcon={<Icon source={imageIndex.lock} size={20} colorIcon="#A59F9F" />}
              value={password}
              onChangeText={handlePassText}
              secureTextEntryToggle
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <CustomInput
              placeholder="Confirm Password"
              leftIcon={<Icon source={imageIndex.lock} size={20} colorIcon="#A59F9F" />}
              value={confirmPassword}
              onChangeText={handleCPassText}
              secureTextEntryToggle
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>
        </ScrollView>

        <CustomButton title="Reset Password" onPress={handleSetPassword} />
      </SafeAreaView>
    </ImageBackground>
  );
}
