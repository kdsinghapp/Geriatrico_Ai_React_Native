import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { useDispatch } from 'react-redux';
import { ResendOtpApi, VerifyOtpApi } from '../../../Api/apiRequest';
import ScreenNameEnum from '../../../routes/screenName.enum';
 
export const useOtpVerification = (cellCount: number = 4) => {
  const navigation = useNavigation<any>();
  const route: any = useRoute();
  const { phone, code, fromUserLogin, email, otp } = route.params || {};
  const [value, setValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);

  // Timer countdown logic
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const data = {
    mob: phone,
    code: fromUserLogin ? '' : code,
    fromUserLogin: !!fromUserLogin,
    email: email
  };
  const [errorMessage, setErrorMessage] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const handleChangeText = (text: string) => {
    setValue(text);
    setErrorMessage(text.length < cellCount ? 'Please enter 4 digit otp' : '');
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    try {
      const response = await ResendOtpApi(email, setIsLoading);
      if (response?.success) {
        setTimer(60);
      }
    } catch (error) {
      console.error('OTP resend error:', error);
    }
  };

  const handleVerifyOTP = async () => {
    if (value.length !== cellCount) {
      setErrorMessage('Please enter 4 digit OTP');
      return;
    }
    setErrorMessage('');

    const response = await VerifyOtpApi(email, value, setIsLoading);
    console.log("response",email, value)
    if (response?.success) {
      navigation.replace(ScreenNameEnum.PhoneLogin);
    }
  };

  return {
    value,
    setValue,
    isLoading,
    errorMessage,
    ref,
    props,
    getCellOnLayoutHandler,
    handleChangeText,
    handleVerifyOTP,
    navigation,
    handleResendOTP,
    data,
    timer,
    route
  };
};
