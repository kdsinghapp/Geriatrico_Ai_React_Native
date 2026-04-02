import React from 'react';
import { View, Text, ScrollView, Image, ImageBackground, Pressable, TextInput } from 'react-native';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import CustomButton from '../../../compoent/CustomButton';
import LoadingModal from '../../../utils/Loader';
import styles from './style';
import imageIndex from '../../../assets/imageIndex';
import { color } from '../../../constant';
import ScreenNameEnum from '../../../routes/screenName.enum';
import TextInputField from '../../../compoent/TextInputField';
import useSignUp from './useSignUp';
 import ErrorText from '../../../compoent/ErrorText';
import CustomHeader from '../../../compoent/CustomHeader';

export default function Sinup() {
  const {
    credentials,
    errors,
    isLoading,
    navigation,
    handleChange,
    handleSignUp,
    selectedCountry,
    setSelectedCountry,
    isFocused, setIsFocused
  } = useSignUp();

  const [showCountryModal, setShowCountryModal] = React.useState(false);

  return (
    <ImageBackground
      style={styles.container}
      source={imageIndex.Loginbg}
      resizeMode="cover"
    >
      <StatusBarComponent />
      <LoadingModal visible={isLoading} />


      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}

        showsVerticalScrollIndicator={false}
      >
                    <CustomHeader label="Edit Profile"   />

        <View style={styles.card}>
          {/* Logo */}
          <Image
            source={imageIndex.appLogo1}
            style={{ height: 140, width: '90%', alignSelf: 'center' }}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={[styles.title, {
           }]}>Sign Up</Text>
          <Text style={styles.subTitle}>Create a new account</Text>

          <Text style={{ marginBottom: 18, color: 'black', fontSize: 15, fontWeight: "600", }}>Full Name</Text>
          <TextInputField
            placeholder="Full Name"
            text={credentials.name}
            onChangeText={(value: string) => handleChange('name', value)}
            firstLogo={true}
            img={imageIndex.userLogo}
            error={errors.name}
          />

          {/* Email */}
          <Text style={{ marginBottom: 18, color: 'black', fontSize: 15, fontWeight: "600", }}>Email</Text>
          
          <TextInputField
            placeholder="Email"
            text={credentials.email}
            onChangeText={(value: string) => handleChange('email', value)}
            firstLogo={true}
            img={imageIndex.mess}
            keyboardType="email-address"
            error={errors.email}
          />

          {/* Phone */}
          {/* <View style={[styles.inputRow, {
            borderWidth: isFocused ? 1 : 0,
            borderColor: isFocused ? '#035093' : 'transparent',
          }]}>
            <Pressable
              style={styles.countryBox}
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={styles.countryText}>{selectedCountry.dial_code}</Text>
              <Image
                source={imageIndex.dounArroww}
                style={styles.chevron}
                resizeMode="contain"
              />
            </Pressable>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="black"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              value={credentials.phone}
              onChangeText={(value: string) => handleChange('phone', value)}
            />
          </View> */}
          {/* <ErrorText error={errors.phone} /> */}

          {/* Password */}
                                <Text style={{ marginBottom: 18, color: 'black', fontSize: 15, fontWeight: "600", }}>Password</Text>

          <TextInputField
            placeholder="Password"
            text={credentials.password}
            onChangeText={(value: string) => handleChange('password', value)}
            firstLogo={true}
            img={imageIndex.lock}
            showEye={true}
            hide={true} // For secureTextEntry
            error={errors.password}
          />
                                <Text style={{ marginBottom: 18, color: 'black', fontSize: 15, fontWeight: "600", }}>Confirm Password</Text>

          {/* Confirm Password */}
          <TextInputField
            placeholder="Confirm Password"
            text={credentials.confirmPassword}
            onChangeText={(value: string) => handleChange('confirmPassword', value)}
            firstLogo={true}
            img={imageIndex.lock}
            showEye={true}
            hide={true} // For secureTextEntry
            error={errors.confirmPassword}
          />

          {/* SignUp Button */}
          <View style={{
            marginTop:20
          }}  >
            <CustomButton title="Sign Up" onPress={handleSignUp} />
          </View>
        </View>
      </ScrollView>

      {/* Login Navigation */}

      <Text
     style={{ color: '#909090', textAlign: 'center', marginBottom: 40 }}
        onPress={() => navigation.navigate(ScreenNameEnum.PhoneLogin)}
        suppressHighlighting={true}
      >
        Already have an account? <Text style={{ color: color.primary, fontSize: 15, fontWeight: "500" }}>Login</Text>
      </Text>
    
    </ImageBackground>
  );
}
