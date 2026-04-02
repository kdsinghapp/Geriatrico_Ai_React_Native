import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ResetPasswordApi } from '../../../Api/apiRequest';
import ScreenNameEnum from '../../../routes/screenName.enum';

const validatePassword = (pass: string) => {
  if (!pass) return 'Password is required';
  if (pass.length < 6) return 'Password must be at least 6 characters';
  return '';
};

const validateConfirmPassword = (pass: string, confirmPass: string) => {
  if (!confirmPass) return 'Please confirm your password';
  if (pass !== confirmPass) return 'Passwords do not match';
  return '';
};

export const useCreateNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();
  const route: any = useRoute();
  const { email, token } = route?.params || {};

  const handlePassText = (text: string) => {
    setPassword(text);

    const error = validatePassword(text);
    setPasswordError(error);

    const confirmError = validateConfirmPassword(text, confirmPassword);
    setConfirmPasswordError(confirmError);
  };

  const handleCPassText = (text: string) => {
    setConfirmPassword(text);

    const confirmError = validateConfirmPassword(password, text);
    setConfirmPasswordError(confirmError);
  };

  const handleSetPassword = async () => {
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    setPasswordError(passErr);
    setConfirmPasswordError(confirmErr);

    if (passErr || confirmErr) return;

    try {
      const response = await ResetPasswordApi(
        {
          token: token,
          new_password: password,
        },
        setIsLoading
      );
      console.log(response, 'response', token, password)
      if (response?.success || response) {
        navigation.navigate(ScreenNameEnum.PhoneLogin);
      }
    } catch (error) {
      console.error('Set password error:', error);
    }
  };

  return {
    password,
    confirmPassword,
    passwordError,
    confirmPasswordError,
    isLoading,
    handlePassText,
    handleCPassText,
    handleSetPassword,
    navigation
  };
};
