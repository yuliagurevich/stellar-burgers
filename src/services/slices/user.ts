import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { USER_SLICE_NAME } from './constants';

type TUserState = {
  user: TUser | null;
  isAuthPending: boolean;
  authError: string | null;
  isAuthChecked: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthPending: false,
  authError: null,
  isAuthChecked: false
};

const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

const loginUser = createAsyncThunk('user/login', async (data: TLoginData) =>
  loginUserApi(data)
);

const getUser = createAsyncThunk('user/get', async () => getUserApi());

const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

const logoutUser = createAsyncThunk('user/logout', async () => logoutApi());

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isAuthPending = true;
        state.authError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthPending = false;
        state.authError =
          action.error.message || 'Ошибка регистрации пользователя';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthPending = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthPending = true;
        state.authError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthPending = false;
        state.authError = action.error.message || 'Ошибка входа';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthPending = false;
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthPending = true;
        state.isAuthChecked = false;
        state.authError = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthPending = false;
        state.isAuthChecked = true;
        state.authError =
          action.error.message || 'Ошибка получения данных пользователя';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthPending = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(updateUser.pending, (state) => {
        state.isAuthPending = true;
        state.authError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isAuthPending = false;
        state.authError =
          action.error.message || 'Ошибка изменения данных пользователя';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthPending = false;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthPending = true;
        state.authError = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isAuthPending = false;
        state.authError = action.error.message || 'Ошибка выхода';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuthPending = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      });
  },
  selectors: {
    getUser: (state: TUserState) => state.user,
    getAuthError: (state: TUserState) => state.authError,
    getIsAuthPending: (state: TUserState) => state.isAuthPending,
    getIsAuthChecked: (state: TUserState) => state.isAuthChecked
  }
});

export const userThunks = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser
};

export const userSelectors = userSlice.selectors;

export default userSlice.reducer;
