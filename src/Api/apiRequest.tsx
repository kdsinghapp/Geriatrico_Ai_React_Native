
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
  mobile: string;
  password: string;
  navigation: any;
  contycode: string
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

    const response = await fetch(`${base_url}/${endpoints.Login}`, requestOptions);
    const text = await response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      errorToast('Invalid server response');
      return undefined;
    }
console.log("login. --- ",parsed?.data)
    // Success: 200 with data, or 404 "Merchant not found" but with userData + token (new merchant)
    const data = parsed?.data;
    const userData = data?.userData ?? data;
    const token =
      userData?.token ??
      data?.token ??
      userData?.access_token ??
      userData?.accessToken ??
      data?.access_token ??
      data?.accessToken ??
      '';

    const isSuccessWithData = parsed?.success === true && data;
    const is404WithUserAndToken =
      (parsed?.statusCode === 404 || parsed?.success === false) &&
      data?.userData &&
      token;

    if (isSuccessWithData || is404WithUserAndToken) {
      // Store token in AsyncStorage for API calls (e.g. merchant profile)
      if (token) {
        await AsyncStorage.setItem('token', token);
      }

      if (is404WithUserAndToken) {
        successToast('Login successful');
      } else {
        successToast(parsed?.message ?? 'Login successful');
      }
      console.log("Login data:", { userData, token, isMerchant: true });
      param.dispatch(loginSuccess({ userData, token, isMerchant: true }));

      param.navigation.reset({
        index: 0,
        routes: [{ name: ScreenNameEnum.MerchantDrawer }],
      });
      return parsed;
    }

    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      errorToast(parsed?.message ?? 'Login failed');
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
        phone: param.mobile,
        countryCode: param.contycode,
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

    if (parsed?.success === true) {
      successToast(parsed?.message ?? 'Signup successful');
      // param.navigation.navigate(ScreenNameEnum.PhoneLogin); // Will handle in hook
      return parsed;
    }
    if (parsed?.success === false || (parsed?.statusCode && parsed.statusCode >= 400)) {
      errorToast(parsed?.message ?? 'Signup failed');
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
console.log("sss",token)
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

    console.log("get api token ",token)
    const response = await fetch(`${base_url}/${endpoints.getrofile}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const parsed = await response.json();
        console.log(" --- get Resp --- ",parsed)

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

    console.log("parsed",parsed)
    if (parsed?.success) {
        setLoading(false);
      successToast(parsed?.message || 'Profile updated');
      return parsed.data;
    }
    errorToast(parsed?.message || 'Update failed');
    return undefined;
  } catch (error) {
    console.log("sss",error)
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
      method: 'PATCH',
      headers: myHeaders,
      body: JSON.stringify({
        email: email,
        otp: otp,

      }),
    });
    console.log("email",email)
    console.log("otp",otp)
    const parsed = await response.json();
        console.log("parsed",parsed)

    if (parsed?.success) {
      successToast(parsed?.message || 'OTP verified');
      return parsed;
    }
    errorToast(parsed?.message || 'Verification failed');
    return undefined;
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
      method: 'PATCH',
      headers: myHeaders,
      body: JSON.stringify({ email }),
    });
    const parsed = await response.json();
    if (parsed?.success) {
      successToast(parsed?.message || 'OTP resent');
      return parsed;
    }
    errorToast(parsed?.message || 'Resend failed');
    return undefined;
  } catch (error) {
    console.error('Resend OTP error:', error);
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
  GetImportHistoryApi,
  GetVehiclesApi,
  GetServiceTypesApi,
  GetItemCategoriesApi,
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