import { useState } from 'react';
 import { useNavigation } from '@react-navigation/native';
import { ForgotPasswordApi } from '../../../Api/apiRequest';
import ScreenNameEnum from '../../../routes/screenName.enum';
 
 const useForgot = () => {
  const [errors, setErrors] = useState <any>({});
  // test11@gmail.com
   const navigation = useNavigation<any>();
   const [isLoading, setisLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '' });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: '' }));
  };

  const handleForgot = async () => {
    const { email } = credentials;
    let validationErrors: any = {};

    if (!email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await ForgotPasswordApi({ email: email.trim().toLowerCase() }, setisLoading);
      if (response?.success || response) {
        navigation.navigate(ScreenNameEnum.OtpScreen, {
          email: email.trim().toLowerCase(),
          isFromForgot: true
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };


  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleForgot,
    navigation,
  };
};

export default useForgot;
