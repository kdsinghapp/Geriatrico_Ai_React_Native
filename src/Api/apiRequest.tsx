
import { base_url } from './index';
import { endpoints } from './endpoints';
import ScreenNameEnum from '../routes/screenName.enum';
import { loginSuccess, logout } from '../redux/feature/authSlice';
import { store } from '../redux/store';
import { errorToast, successToast } from '../utils/customToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogout = async (dispatch: any) => {
  try {
    dispatch(logout());
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

/** Clear auth state and storage when token is missing or session invalid */
const clearAuthSession = () => {
  try {
    store.dispatch(logout());
  } catch (e) {
    console.error('Error clearing auth session:', e);
  }
};




export interface LoginApiParam {
  email: string;
  password: string;
  dispatch: any;
  navigation: any;
}

export interface SignUpApiParam {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordApiParam {
  email: string;
}

export interface VerifyResetOtpApiParam {
  email: string;
  otp: string;
}

export interface ResetPasswordApiParam {
  token: string;
  new_password: string;
}

export interface Quiz {
  quiz_id: string;
  material_id: string;
  quiz_name: string;
  topic: string;
  level: string;
  created_at: string;
  total_questions: number;
}

export interface QuizzesResponse {
  total: number;
  quizzes: Quiz[];
}

export interface PyqPaper {
  pyq_id: string;
  year: string;
  subject: string;
  total_questions: number;
  created_at: string;
}

export interface PyqListResponse {
  total: number;
  papers: PyqPaper[];
}

export interface SubmitPyqPayload {
  pyq_id: string;
  user_id: string;
  answers: {
    question_no: number;
    selected_index: number;
  }[];
  time_spent_seconds: number;
}

export interface UpdateAuthProfilePayload {
  name: string;
  country_code: string;
  phone_no: string;
}


export interface AnalyticsResponse {
  top_stats: {
    total_questions: number;
    accuracy: string;
    avg_time: string;
    streak: string;
  };
  weekly_progress: {
    day: string;
    count: number;
  }[];
  strengths: any[];
  areas_to_improve: {
    topic: string;
    percentage: number;
  }[];
}

export interface CombinedStatsResponse {
  overall: {
    total: number;
    played: number;
    remaining: number;
    average_score: number;
  };
  quizzes: {
    total: number;
    played: number;
    remaining: number;
    average_score: number;
  };
  previous_year_papers: {
    total: number;
    played: number;
    remaining: number;
    average_score: number;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface QuizDetail {
  quiz_id: string;
  material_id: string;
  quiz_name: string;
  topic: string;
  level: string;
  created_at: string;
  data: {
    questions: QuizQuestion[];
    feedback: string;
  };
}

export interface SubmitQuizPayload {
  quiz_id: string;
  user_id: string;
  answers: {
    question_index: number;
    selected_index: number;
  }[];
  time_spent_seconds: number;
}

const LogiApi = async (
  param: LoginApiParam,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        email: param.email,
        password: param.password,
      }),
    };
    console.log(param, 'this is param')

    const response = await fetch(`${base_url}/${endpoints.Login}`, requestOptions);
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }
    console.log("Login Response Log (Full):", parsed);

    // Get userData and token from the new structure
    const userData = parsed?.user ?? parsed?.data?.userData ?? parsed?.data;
    const token =
      parsed?.access_token ??
      parsed?.accessToken ??
      parsed?.data?.access_token ??
      parsed?.data?.token ??
      userData?.token ??
      userData?.access_token ??
      '';

    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    const isSpecialCaseWithToken =
      (parsed?.statusCode === 404 || parsed?.success === false) &&
      userData &&
      token;

    if (isSuccess || isSpecialCaseWithToken) {
      if (token) {
        await AsyncStorage.setItem('token', token);
      }

      successToast(parsed?.message ?? 'Login successful');
      console.log("Login successful. UserData:", userData, "Token:", token);
      param.dispatch(loginSuccess({ userData, token, isMerchant: false }));

      param.navigation.reset({
        index: 0,
        routes: [{ name: ScreenNameEnum.BottomTabNavigator }],
      });
      return parsed;
    }

    if (!isSuccess) {
      const errorMsg = parsed?.detail || parsed?.message || 'Login failed';
      if (errorMsg === 'Account not verified. A new OTP has been sent to your email.') {
        successToast(errorMsg);
        param.navigation.navigate(ScreenNameEnum.OtpScreen, {
          email: param.email,
        });
        return parsed;
      }
      errorToast(errorMsg);
      return undefined;
    }
  } catch (error) {
    console.error('Login error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const SignUpApi = async (
  param: SignUpApiParam,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        name: param.name,
        email: param.email,
        password: param.password,
      }),
    };

    const response = await fetch(`${base_url}/${endpoints.SignUp}`, requestOptions);
    console.log("response", response)
    const text = await response.text();
    let parsed: any;
    console.log("parsed", parsed)

    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }
    console.log("parQQQ sed", parsed)

    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    if (isSuccess) {
      successToast(parsed?.message ?? 'Signup successful');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Signup failed');
      return undefined;
    }
  } catch (error) {
    console.error('Signup error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};


export interface MerchantProfileData {
  merchantId?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

type OnUnauthorized = (() => void) | undefined;

const GetMerchantProfileApi = async (
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<MerchantProfileData | undefined> => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('token');
    console.log("sss", token)
    const response = await fetch(`${base_url}/${endpoints.merchantProfile}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const parsed = await response.json();

    console.log("Merchant Profile Response:", parsed);

    // ✅ Correct data path
    if (parsed?.success && parsed?.data) {

      const raw = parsed.data;


      console.log("RETURN DATA:", raw);

      return raw;
    }

    return undefined;

  } catch (error) {
    console.log("Merchant Profile Error:", error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const UpdateMerchantProfileApi = async (
  payload: Partial<MerchantProfileData>,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<MerchantProfileData | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      // errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${base_url}/${endpoints.merchantAdminProfile}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload),
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      // errorToast('Invalid server response');
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      successToast(parsed?.message ?? 'Profile updated');
      const raw = parsed.data;
      return {
        merchantId: raw?.userId?._id ?? raw?.merchantId ?? raw?._id,
        companyName: raw?.companyName,
        contactName: raw?.contactName,
        phone: raw?.phone,
        address: raw?.address,
        city: raw?.city,
        province: raw?.province,
        postalCode: raw?.postalCode,
      } as MerchantProfileData;
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      // errorToast(parsed?.message ?? 'Failed to update profile');
      return undefined;
    }
    return undefined;
  } catch (error) {
    console.error('Merchant profile update error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Privacy Policy - public GET, returns { content: string } */
const Privacypolicy = async (
  setLoading: (loading: boolean) => void,
): Promise<{ content?: string } | undefined> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.getPrivacy}`, {
      method: 'GET',
      headers: myHeaders,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      const content = parsed.data?.content ?? parsed.data?.description ?? parsed.data?.policy ?? '';
      return { content: typeof content === 'string' ? content : JSON.stringify(parsed.data) };
    }
    return parsed?.data ? { content: parsed.data?.content ?? '' } : undefined;
  } catch (error) {
    console.error('Privacy policy error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Terms and Conditions - public GET, returns { content: string } */
const Termsconditions = async (
  setLoading: (loading: boolean) => void,
): Promise<{ content?: string } | undefined> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.getTerms}`, {
      method: 'GET',
      headers: myHeaders,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      const content = parsed.data?.content ?? parsed.data?.description ?? parsed.data?.terms ?? '';
      return { content: typeof content === 'string' ? content : JSON.stringify(parsed.data) };
    }
    return parsed?.data ? { content: parsed.data?.content ?? '' } : undefined;
  } catch (error) {
    console.error('Terms conditions error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Create merchant order - POST /orders/merchant/create */
export interface CreateMerchantOrderPayload {
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  pickupLat: string;
  pickupLng: string;
  dropAddress: string;
  dropLat: string;
  dropLng: string;
}

const CreateMerchantOrderApi = async (
  payload: CreateMerchantOrderPayload,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${base_url}/${endpoints.ordersMerchantCreate}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload),
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }

    if (parsed?.success === true) {
      successToast(parsed?.message ?? 'Order created successfully');
      return parsed?.data ?? parsed;
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      errorToast(parsed?.message ?? 'Failed to create order');
      return undefined;
    }
    return undefined;
  } catch (error) {
    console.error('Create merchant order error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Get orders - GET /orders/all?page=1&limit=3 */
const GetOrdersAllApi = async (
  page: number = 1,
  limit: number = 3,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<{ orders?: any[]; total?: number } | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const url = `${base_url}/${endpoints.ordersAll}`;
    // const url = `${base_url}/${endpoints.ordersAll}?page=${page}&limit=${limit}`;
    const response = await fetch(url, { method: 'GET', headers: myHeaders });
    const text = await response.text();
    console.log("response", response)
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }
    console.log("parsed", parsed)
    if (parsed?.success === true) {
      const orders = parsed?.data?.orders ?? parsed?.data ?? (Array.isArray(parsed?.data) ? parsed.data : []);
      const total = parsed?.data?.total ?? parsed?.total ?? orders?.length ?? 0;
      return { orders: Array.isArray(orders) ? orders : [], total };
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    return { orders: [], total: 0 };
  } catch (error) {
    console.error('Get orders error:', error);
    return { orders: [], total: 0 };
  } finally {
    setLoading(false);
  }
};

/** Import orders CSV - POST /orders/import/csv with FormData */
const ImportOrdersCsvApi = async (
  fileUri: string,
  fileName: string,
  setLoading: (loading: boolean) => void,
  navigation: any,
  onUnauthorized?: OnUnauthorized,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const formData = new FormData();
    const ext = fileName?.split('.').pop()?.toLowerCase() ?? '';
    const mimeMap: Record<string, string> = {
      csv: 'text/csv',
      pdf: 'application/pdf',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const mimeType = mimeMap[ext] || 'text/csv';

    formData.append('file', {
      uri: fileUri,
      name: fileName || 'orders.csv',
      type: mimeType,
    } as any);

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    // Do NOT set Content-Type - fetch sets multipart/form-data with boundary automatically

    const response = await fetch(`${base_url}/${endpoints.ordersImportCsv}`, {
      method: 'POST',
      headers: myHeaders,
      body: formData,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }
    console.log("parsed", parsed)
    if (parsed?.success === true) {
      successToast(parsed?.message ?? 'File uploaded successfully');
      navigation.navigate(ScreenNameEnum.ViewOrders);

      return parsed?.data ?? parsed;
    }
    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }
    errorToast(parsed?.message ?? 'Failed to upload file');
    return undefined;
  } catch (error) {
    console.error('Import CSV error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Help / FAQ list - public GET, returns { data: Array<{ question, answer }> } */
const GethelpApi = async (
  setLoading: (loading: boolean) => void,
): Promise<{ data?: any[] } | undefined> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.getFaq}`, {
      method: 'GET',
      headers: myHeaders,
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    if (parsed?.success === true && parsed?.data) {
      const list = Array.isArray(parsed.data) ? parsed.data : parsed.data?.faq ?? parsed.data?.list ?? [];
      return { data: list };
    }
    return parsed?.data ? { data: Array.isArray(parsed.data) ? parsed.data : [] } : undefined;
  } catch (error) {
    console.error('Help/FAQ API error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetProfileApi = async (
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    console.log("get api token ", token)
    const response = await fetch(`${base_url}/${endpoints.getrofile}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
    console.log(" --- get Resp --- ", parsed)

    if (parsed?.success) {
      return parsed.data;
    }
    return undefined;
  } catch (error) {
    console.error('Get profile error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetAnalyticsApi = async (
  setLoading: (loading: boolean) => void,
): Promise<AnalyticsResponse | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.analytics}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
    console.log(" --- Get Analytics Resp --- ", parsed);
    if (response.ok) {
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Get Analytics error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetCombinedStatsApi = async (
  setLoading: (loading: boolean) => void,
): Promise<CombinedStatsResponse | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.combinedStats}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
    console.log(" --- Get Combined Stats Resp --- ", parsed);
    if (response.ok) {
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Get Combined Stats error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const UpdateProfile = async (
  payload: any,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    if (payload.imagePrfoile && payload.imagePrfoile.uri) {
      formData.append('file', {
        uri: payload.imagePrfoile.uri,
        name: payload.imagePrfoile.fileName || 'profile.jpg',
        type: payload.imagePrfoile.type || 'image/jpeg',
      } as any);
    }
    const response = await fetch(`${base_url}/${endpoints.updateProfile}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const parsed = await response.json();

    console.log("parsed", parsed)
    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    setLoading(false);
    if (isSuccess) {
      successToast(parsed?.message || 'Profile updated');
      return parsed.data;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Update failed');
      return undefined;
    }
  } catch (error) {
    console.log("sss", error)
    setLoading(false);
    console.error('Update profile error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const VerifyOtpApi = async (
  email: string,
  otp: string,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.VerifyOtp}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        email: email,
        otp: otp,

      }),
    });
    console.log("email", email)
    console.log("otp", otp)
    const parsed = await response.json();
    console.log("parsed", parsed)

    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    if (isSuccess) {
      successToast(parsed?.message || 'Verification successful');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Verification failed');
      return undefined;
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const ResendOtpApi = async (
  email: string,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.ResendOtp}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ email }),
    });
    const parsed = await response.json();
    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    if (isSuccess) {
      successToast(parsed?.message || 'OTP resent');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Resend failed');
      return undefined;
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const ForgotPasswordApi = async (
  param: ForgotPasswordApiParam,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.ForgetPassword}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ email: param.email }),
    });
    const parsed = await response.json();
    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    if (isSuccess) {
      successToast(parsed?.message || 'Instructions sent to your email');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Request failed');
      return undefined;
    }
  } catch (error) {
    console.error('Forgot Password error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const VerifyResetOtpApi = async (
  param: VerifyResetOtpApiParam,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.VerifyResetOtp}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        email: param.email,
        otp: param.otp,
      }),
    });
    const parsed = await response.json();
    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    if (isSuccess) {
      successToast(parsed?.message || 'OTP verified successfully');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Verification failed');
      return undefined;
    }
  } catch (error) {
    console.error('Verify Reset OTP error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const ResetPasswordApi = async (
  param: ResetPasswordApiParam,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    const response = await fetch(`${base_url}/${endpoints.ResetPassword}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        token: param.token,
        new_password: param.new_password,
      }),
    });
    const parsed = await response.json();
    const isSuccess = (response.status >= 200 && response.status < 300) || parsed?.success === true;
    if (isSuccess) {
      successToast(parsed?.message || 'Password reset successful');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Reset failed');
      return undefined;
    }
  } catch (error) {
    console.error('Reset Password error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Get import history - GET /orders/import/history */
const GetImportHistoryApi = async (
  setLoading: (loading: boolean) => void,
  onUnauthorized?: OnUnauthorized,
): Promise<any[] | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const url = `${base_url}/${endpoints.ordersImportHistory}`;
    const response = await fetch(url, { method: 'GET', headers: myHeaders });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return undefined;
    }

    console.log("Import History Response:", parsed);

    if (parsed?.success === true) {
      return Array.isArray(parsed?.data) ? parsed.data : [];
    }

    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    return [];
  } catch (error) {
    console.error('Get import history error:', error);
    return [];
  } finally {
    setLoading(false);
  }
};

/** Get service types - GET /service-type/all */
const GetServiceTypesApi = async (
  setLoading: (loading: boolean) => void,
  onUnauthorized?: () => void,
): Promise<any[]> => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('token');

    const headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${base_url}/${endpoints.serviceTypeAll}`;
    console.log('Fetching Service Types:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const status = response.status;
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return [];
    }

    if (status === 200 && parsed?.success) {
      return Array.isArray(parsed?.data) ? parsed.data : [];
    }

    if (status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return [];
    }

    return [];
  } catch (error) {
    console.error('Get Service Types API Error:', error);
    return [];
  } finally {
    setLoading(false);
  }
};

/** Get item categories - GET /item-category/all */
const GetItemCategoriesApi = async (
  setLoading: (loading: boolean) => void,
  onUnauthorized?: () => void,
): Promise<any[]> => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('token');

    const headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${base_url}/${endpoints.itemCategoryAll}`;
    console.log('Fetching Item Categories:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const status = response.status;
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return [];
    }

    if (status === 200 && parsed?.success) {
      return Array.isArray(parsed?.data) ? parsed.data : [];
    }

    if (status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return [];
    }

    return [];
  } catch (error) {
    console.error('Get Item Categories API Error:', error);
    return [];
  } finally {
    setLoading(false);
  }
};
const GetPackageSizeApi = async (
  setLoading: (loading: boolean) => void,
  onUnauthorized?: () => void,
): Promise<any[]> => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('token');

    const headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${base_url}/${endpoints.PackageSize}`;
    console.log('Fetching Item Categories:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const status = response.status;
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return [];
    }

    if (status === 200 && parsed?.success) {
      return Array.isArray(parsed?.data) ? parsed.data : [];
    }

    if (status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return [];
    }

    return [];
  } catch (error) {
    console.error('Get Item Categories API Error:', error);
    return [];
  } finally {
    setLoading(false);
  }
};

/** Create user order payload interface */
export interface CreateUserOrderPayload {
  recipientName: string;
  recipientPhone: string;
  pickupAddress: string;
  pickupLat: string;
  pickupLng: string;
  dropAddress: string;
  dropLat: string;
  dropLng: string;
  serviceType: string;
  parcelType: string;
  itemCategory: string;
  vehicleType: string;
  note: string;
}

/** Create user order - POST /orders/user/create */
const CreateUserOrderApi = async (
  payload: CreateUserOrderPayload,
  setLoading: (loading: boolean) => void,
  onUnauthorized?: () => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${base_url}/${endpoints.ordersUserCreate}`, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload),
    });
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }

    if (parsed?.success === true) {
      successToast(parsed?.message ?? 'Order created successfully');
      return parsed?.data ?? parsed;
    }

    if (response.status === 401 || parsed?.statusCode === 401) {
      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();
      return undefined;
    }

    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      errorToast(parsed?.message ?? 'Failed to create order');
      return undefined;
    }
    return undefined;
  } catch (error) {
    console.error('Create user order error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

export {
  LogiApi,
  SignUpApi,
  GetMerchantProfileApi,
  UpdateMerchantProfileApi,
  CreateMerchantOrderApi,
  CreateUserOrderApi,
  GetOrdersAllApi,
  GetPackageSizeApi,
  ImportOrdersCsvApi,
  Privacypolicy,
  Termsconditions,
  GethelpApi,
  handleLogout,
  GetProfileApi,
  UpdateProfile,
  VerifyOtpApi,
  ResendOtpApi,
  ForgotPasswordApi,
  VerifyResetOtpApi,
  ResetPasswordApi,
  GetImportHistoryApi,
  GetVehiclesApi,
  GetServiceTypesApi,
  GetItemCategoriesApi,
  CreateSessionApi,
  DeleteSessionApi,
  ChatApi,
  ChatWithFileApi,
  GetChatHistoryApi,
  UploadFileApi,
  GetQuizzesApi,
  GetQuizByIdApi,
  SubmitQuizApi,
  GetPyqListApi,
  GetPyqByIdApi,
  SubmitPyqApi,
  DeletePyqApi,
  GetPyqQuestionsOnlyApi,
  GetAuthProfileApi,
  UpdateAuthProfileApi,
  DeleteAuthProfileApi,
  UpdateAuthProfilePhotoApi,
  DeleteAuthProfilePhotoApi,
  ChangePasswordApi,
  GetFaqsApi,
  GetAnalyticsApi,
  GetCombinedStatsApi,
};

const UploadFileApi = async (
  sessionId: string,
  file: any,
  setLoading: (loading: boolean) => void
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'application/pdf',
      name: file.name || 'document.pdf',
    } as any);

    const url = `${base_url}/${endpoints.upload}?session_id=${sessionId}`;
    console.log('--- Uploading File ---');
    console.log('URL:', url);
    console.log('File:', { uri: file.uri, name: file.name, type: file.type });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log('Upload Raw Response:', responseText);

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return undefined;
    }

    if (response.ok) {
      console.log('Upload File Success:', parsed);
      return parsed;
    }
    console.warn('Upload File Failed:', parsed);
    return undefined;
  } catch (error) {
    console.error('Upload File Error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const ChatWithFileApi = async (
  sessionId: string,
  message: string,
  file: any,
  setLoading: (loading: boolean) => void
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('query', message);
    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/octet-stream',
        name: file.name || 'document',
      } as any);
    }

    console.log('--- Chat With File API ---');
    console.log('URL:', `${base_url}/${endpoints.chat}`);
    console.log('Payload:', { session_id: sessionId, query: message, file: file?.name });

    const response = await fetch(`${base_url}/${endpoints.chat}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // Note: Content-Type is handled automatically by fetch for FormData
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const parsed = await response.json();
    console.log('Chat With File Response:', parsed);
    if (response.ok) return parsed;
    return undefined;
  } catch (error) {
    console.error('Chat With File Error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const CreateSessionApi = async (userId: string, setLoading: (loading: boolean) => void): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.createSession}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ user_id: String(userId) }),
    });
    console.log('--- Create Session ---');
    console.log('URL:', `${base_url}/${endpoints.createSession}`);
    console.log('Payload:', { user_id: userId });

    const parsed = await response.json();
    console.log('Create Session Response:', parsed);
    if (response.ok) return parsed;
    return undefined;
  } catch (error) {
    console.error('Create Session Error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const DeleteSessionApi = async (sessionId: string, setLoading: (loading: boolean) => void): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.deleteSession}/${sessionId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    console.log('--- Delete Session ---');
    console.log('URL:', `${base_url}/${endpoints.deleteSession}/${sessionId}`);
    const parsed = await response.json();
    console.log('Delete Session Response:', parsed);
    return parsed;
  } catch (error) {
    console.error('Delete Session Error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const ChatApi = async (sessionId: string, query: string, setLoading: (loading: boolean) => void): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.chat}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ session_id: sessionId, query }),
    });
    console.log('--- Chat API ---');
    console.log('URL:', `${base_url}/${endpoints.chat}`);
    console.log('Payload:', { session_id: sessionId, query });

    const responseText = await response.text();
    console.log('Chat Raw Response:', responseText);

    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = responseText;
    }

    console.log('Chat Parsed Response:', parsed);
    if (response.ok) return parsed;
    return undefined;
  } catch (error) {
    console.error('Chat Error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetChatHistoryApi = async (sessionId: string, setLoading: (loading: boolean) => void): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    console.log('--- Get Chat History ---');
    console.log('URL:', `${base_url}/${endpoints.chatHistory}/${sessionId}`);

    const response = await fetch(`${base_url}/${endpoints.chatHistory}/${sessionId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const parsed = await response.json();
    console.log('Get History Response:', parsed);
    if (response.ok) return parsed;
    return undefined;
  } catch (error) {
    console.error('Get History Error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

/** Get vehicles - GET /vehicle/create */
const GetVehiclesApi = async (
  setLoading: (loading: boolean) => void,
  onUnauthorized?: () => void,
): Promise<any[]> => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('token');
    console.log('Token:', token);

    const headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `${base_url}/${endpoints.vehicleCreate}`;
    console.log('API URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    const status = response.status;
    const text = await response.text();

    console.log('Raw Response:', text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error('JSON Parse Error:', e);
      return [];
    }

    console.log('Parsed Response:', parsed);

    // ✅ SUCCESS CASE
    if (status === 200 && parsed?.success) {
      return Array.isArray(parsed?.data) ? parsed.data : [];
    }

    // ❌ UNAUTHORIZED
    if (status === 401 || parsed?.statusCode === 401) {
      console.log('Unauthorized - clearing session');

      clearAuthSession();
      errorToast('Session expired. Please login again.');
      onUnauthorized?.();

      return [];
    }

    // ❌ OTHER ERROR
    console.warn('API Error:', parsed?.message || 'Unknown error');
    return [];

  } catch (error) {
    console.error('Get Vehicles API Error:', error);
    return [];
  } finally {
    setLoading(false);
  }
};

const GetQuizzesApi = async (
  setLoading: (loading: boolean) => void,
): Promise<QuizzesResponse | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.Quizzes}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    console.log(" --- get Quizzes Resp --- ", text);

    if (response.ok) {
      return JSON.parse(text);
    }
    return undefined;
  } catch (error) {
    console.error('Get quizzes error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetQuizByIdApi = async (
  quizId: string,
  setLoading: (loading: boolean) => void,
): Promise<QuizDetail | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.QuizById}/${quizId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    console.log(" --- get Quiz Detail Resp --- ", text);

    if (response.ok) {
      return JSON.parse(text);
    }
    return undefined;
  } catch (error) {
    console.error('Get quiz detail error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const SubmitQuizApi = async (
  payload: SubmitQuizPayload,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.SubmitQuiz}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const parsed = await response.json();
    console.log(" --- submit Quiz Resp --- ", parsed);

    if (response.ok) {
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Submit quiz error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetPyqListApi = async (
  setLoading: (loading: boolean) => void,
): Promise<PyqListResponse | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.pyqList}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    console.log(" --- get Pyq List Resp --- ", text);

    if (response.ok) {
      return JSON.parse(text);
    }
    return undefined;
  } catch (error) {
    console.error('Get pyq list error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetPyqByIdApi = async (
  pyq_id: string,
  setLoading: (loading: boolean) => void,
): Promise<any | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.pyqById}/${pyq_id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    console.log(" --- get Pyq Detail Resp --- ", text);

    if (response.ok) {
      return JSON.parse(text);
    }
    return undefined;
  } catch (error) {
    console.error('Get pyq detail error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const SubmitPyqApi = async (
  payload: SubmitPyqPayload,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.pyqSubmit}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const parsed = await response.json();
    console.log(" --- submit Pyq Resp --- ", parsed);

    if (response.ok) {
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Submit pyq error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const DeletePyqApi = async (
  pyq_id: string,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.pyqById}/${pyq_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const parsed = await response.json();
    console.log(" --- delete Pyq Resp --- ", parsed);

    if (response.ok) {
      successToast(parsed?.message || 'PYQ deleted successfully');
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Delete pyq error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetPyqQuestionsOnlyApi = async (
  pyq_id: string,
  setLoading: (loading: boolean) => void,
): Promise<any | undefined> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${base_url}/${endpoints.pyqQuestionsOnly}/${pyq_id}/questions-only`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    console.log(" --- get Pyq Questions Only Resp --- ", text);

    if (response.ok) {
      return JSON.parse(text);
    }
    return undefined;
  } catch (error) {
    console.error('Get pyq questions only error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetAuthProfileApi = async (
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.profile}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
    console.log(" --- get Auth Profile Resp --- ", parsed);
    if (response.ok) {
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Get auth profile error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const UpdateAuthProfileApi = async (
  payload: UpdateAuthProfilePayload,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.profile}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const parsed = await response.json();
    console.log(" --- update Auth Profile Resp --- ", parsed);
    if (response.ok) {
      successToast(parsed?.message || 'Profile updated successfully');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Update failed');
      return undefined;
    }
  } catch (error) {
    console.error('Update auth profile error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const DeleteAuthProfileApi = async (
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.profile}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
    console.log(" --- delete Auth Profile Resp --- ", parsed);
    if (response.ok) {
      successToast(parsed?.message || 'Profile deleted successfully');
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Delete auth profile error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

const UpdateAuthProfilePhotoApi = async (
  file: any,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: file.name || 'profile.jpg',
    } as any);

    const response = await fetch(`${base_url}/${endpoints.profilePhoto}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const parsed = await response.json();
    console.log(" --- update Auth Profile Photo Resp --- ", parsed);
    if (response.ok) {
      successToast(parsed?.message || 'Profile photo updated successfully');
      return parsed;
    } else {
      errorToast(parsed?.detail || parsed?.message || 'Update failed');
      return undefined;
    }
  } catch (error) {
    console.error('Update auth profile photo error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const DeleteAuthProfilePhotoApi = async (
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.profilePhoto}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
    console.log(" --- delete Auth Profile Photo Resp --- ", parsed);
    if (response.ok) {
      successToast(parsed?.message || 'Profile photo deleted successfully');
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Delete auth profile photo error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

const ChangePasswordApi = async (
  payload: ChangePasswordPayload,
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.changePassword}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const parsed = await response.json();
    console.log(" --- Change Password Resp --- ", parsed);
    if (response.ok) {
      successToast(parsed?.message || 'Password changed successfully');
      return parsed;
    } else {
      errorToast(parsed?.detail?.[0]?.msg || parsed?.message || 'Failed to change password');
      return undefined;
    }
  } catch (error) {
    console.error('Change password error:', error);
    errorToast('Network error');
    return undefined;
  } finally {
    setLoading(false);
  }
};

const GetFaqsApi = async (
  setLoading: (loading: boolean) => void,
): Promise<any> => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${base_url}/${endpoints.getFaq}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
    console.log(" --- Get FAQs Resp --- ", parsed);
    if (response.ok) {
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.error('Get FAQs error:', error);
    return undefined;
  } finally {
    setLoading(false);
  }
};


