import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { errorToast, successToast } from '../../../utils/customToast';
import ScreenNameEnum from '../../../routes/screenName.enum';
import { SignUpApi } from '../../../Api/apiRequest';
 
export interface SignUpCredentials {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const useSignUp = () => {
  const navigation = useNavigation<any>();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [credentials, setCredentials] = useState<SignUpCredentials>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [selectedCountry, setSelectedCountry] = useState(
   );
  const [errors, setErrors] = useState<Partial<SignUpCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof SignUpCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateFields = () => {
    const validationErrors: Partial<SignUpCredentials> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!credentials.name.trim()) {
      validationErrors.name = 'Full name is required';
    } else if (credentials.name.trim().length < 2) {
      validationErrors.name = 'Name is too short';
    }

    if (!credentials.email.trim()) {
      validationErrors.email = 'Email address is required';
    } else if (!emailRegex.test(credentials.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    if (!credentials.phone.trim()) {
      validationErrors.phone = 'Phone number is required';
    } else if (credentials.phone.trim().length < 7) {
      validationErrors.phone = 'Please enter a valid phone number';
    }

    if (!credentials.password.trim()) {
      validationErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    if (!credentials.confirmPassword.trim()) {
      validationErrors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    const fullPhone = selectedCountry.dial_code + credentials.phone;
    console.log("Submitting Signup:", { ...credentials, fullPhone });

    const response = await SignUpApi(
      {
        name: credentials.name,
        email: credentials.email,
        mobile: fullPhone,
        contycode: selectedCountry.dial_code,
        password: credentials.password,
        navigation: navigation,
      },
      setIsLoading
    );

    if (response?.success) {
      navigation.navigate(ScreenNameEnum.OtpScreen, {
        email: credentials.email,
        otp: response?.data?.otp // Passing for testing, though usually sent via SMS/Email
      });
    }
  };

  return {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleSignUp,
    navigation,
    selectedCountry,
    setSelectedCountry,
    isFocused, setIsFocused
  };
};

export default useSignUp;
