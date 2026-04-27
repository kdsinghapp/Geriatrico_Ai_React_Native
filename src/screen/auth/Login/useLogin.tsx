import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { errorToast } from '../../../utils/customToast';
import { LogiApi } from '../../../Api/apiRequest';
import ScreenNameEnum from '../../../routes/screenName.enum';

export interface LoginCredentials {
  email: string;
  password: string;
}

const useLogin = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const [credentials, setCredentials] = useState<LoginCredentials>({

    email: '',
    // email: 'gs1@yopmail.com',
    // password: '123456',
    password: '',

    // 
  });

  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateFields = () => {
    const validationErrors: Partial<LoginCredentials> = {};
    if (!credentials.email?.trim()) validationErrors.email = 'Email is required';
    if (!credentials.password?.trim()) validationErrors.password = 'Password is required';
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    const param = {
      email: credentials.email.trim(),
      password: credentials.password.trim(),
      dispatch,
      navigation,
    };

    try {
      await LogiApi(param, setIsLoading);
    } catch (error: any) {
      errorToast(error?.message || 'Login error');
    }
  };

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleLogin,
    navigation,
  };
};

export default useLogin;
