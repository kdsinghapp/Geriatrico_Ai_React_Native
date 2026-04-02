import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isLogin: boolean;
  isLogOut: boolean;
  userData: any;
  token: string | null;
  isMerchant: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  isLogin: false,
  isLogOut: false,
  userData: null,
  token: null,
  isMerchant: false,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ userData: any; token: string; isMerchant: boolean }>
    ) {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.isLogin = true;
      state.isLogOut = false;

      state.userData = action.payload.userData;
      state.token = action.payload.token;
      state.isMerchant = action.payload.isMerchant;

      AsyncStorage.setItem(
        'authData',
        JSON.stringify({
          userData: action.payload.userData,
          token: action.payload.token,
          isMerchant: action.payload.isMerchant,
        })
      );
    },

    restoreLogin(
      state,
      action: PayloadAction<{ userData: any; token: string; isMerchant: boolean }>
    ) {
      state.isLogin = true;
      state.userData = action.payload.userData;
      state.token = action.payload.token;
      state.isMerchant = action.payload.isMerchant;
    },

    logout(state) {
      state.isLogin = false;
      state.isLogOut = true;
      state.userData = null;
      state.token = null;
      state.isMerchant = false;

      AsyncStorage.removeItem('authData');
      AsyncStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, restoreLogin, logout } = AuthSlice.actions;
export default AuthSlice.reducer;