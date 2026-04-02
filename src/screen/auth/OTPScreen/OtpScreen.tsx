import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  CodeField,
  Cursor,

} from 'react-native-confirmation-code-field';
import CustomButton from '../../../compoent/CustomButton';
import StatusBarComponent from '../../../compoent/StatusBarCompoent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { useOtpVerification } from './useOTPVerification';
import { color } from '../../../constant';
import CustomHeader from '../../../compoent/CustomHeader';
import LoadingModal from '../../../utils/Loader';

export default function OtpScreen() {
  const {
    value,
    isLoading,
    errorMessage,
    ref,
    props,
    timer,
    getCellOnLayoutHandler,
    handleChangeText,
    handleVerifyOTP,
    handleResendOTP,
    navigation,
    data,
    route
  } = useOtpVerification()
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}

    >
      <StatusBarComponent />
      <CustomHeader label={"Back"} />
      <LoadingModal visible={isLoading} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={styles.txtHeading}>
              Verification Code
            </Text>
            <Text style={styles.txtDes}>
              We sent a 4-digit code to {data?.email || data?.mob || 'your registered contact'}
            </Text>
            <Text style={styles.txtDes}>{`For testing, use OTP ${route?.params?.otp || route?.otp || ''} to verify your account.`}
            </Text>
          </View>

          <View style={styles.otpFieldContainer}>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={handleChangeText}
              cellCount={4}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View key={index} style={styles.cellWrapper}>
                  <Text
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </View>
          {/* <View style={{ alignItems: 'center', marginTop: 15 }}>
            <Text style={styles.txtDes}>
              Didn’t receive the OTP?
              {' '}
              {timer > 0 ? (
                <Text style={{ color: 'gray' }}> Resend in


                  <Text style={{
                    color: "black"
                  }}>
                    {" "} {timer} {""}
                  </Text>
                  s</Text>
              ) : (
                <Text
                  onPress={handleResendOTP}
                  style={{ color: color.primary, fontWeight: 'bold' }}
                >
                  {' '}RESEND OTP
                </Text>
              )}
            </Text>
          </View> */}
        </ScrollView>
        {/* <Image source={imageIndex.otp} style={{ width: '80%', height: hp(45), alignSelf: 'center', marginBottom: 30 }} /> */}

        <CustomButton
          title={"Continue"}

          onPress={handleVerifyOTP}
          style={styles.submitButton}
        />

      </View>
    </SafeAreaView>
  );
}