import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TServerResponse,
  TUserResponse,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { USER_SLICE_NAME } from './constants';

export type TUserState = {
  user: TUser | null;
  isPending: boolean;
  errorMessage: string | null;
  isAuthChecked: boolean;
};

export const userInitialState: TUserState = {
  user: null,
  isPending: false,
  errorMessage: null,
  isAuthChecked: false
};

const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

const loginUser = createAsyncThunk('user/login', loginUserApi);

const getUser = createAsyncThunk('user/get', getUserApi);

const updateUser = createAsyncThunk('user/update', updateUserApi);

const logoutUser = createAsyncThunk('user/logout', logoutApi);

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState: userInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isPending = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isPending = false;
        state.errorMessage =
          action.error.message || 'Ошибка регистрации пользователя';
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.isPending = false;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(loginUser.pending, (state) => {
        state.isPending = true;
        state.errorMessage = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isPending = false;
        state.errorMessage = action.error.message || 'Ошибка входа';
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.isPending = false;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(getUser.pending, (state) => {
        state.isPending = true;
        state.isAuthChecked = false;
        state.errorMessage = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isPending = false;
        state.isAuthChecked = true;
        state.errorMessage =
          action.error.message || 'Ошибка получения данных пользователя';
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.isPending = false;
          state.isAuthChecked = true;
          state.user = action.payload.user;
        }
      )
      .addCase(updateUser.pending, (state) => {
        state.isPending = true;
        state.errorMessage = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isPending = false;
        state.errorMessage =
          action.error.message || 'Ошибка изменения данных пользователя';
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.isPending = false;
          state.user = action.payload.user;
        }
      )
      .addCase(logoutUser.pending, (state) => {
        state.isPending = true;
        state.errorMessage = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isPending = false;
        state.errorMessage = action.error.message || 'Ошибка выхода';
      })
      .addCase(
        logoutUser.fulfilled,
        (state, action: PayloadAction<TServerResponse<{}>>) => {
          if (action.payload.success) {
            state.isPending = false;
            state.user = null;
            deleteCookie('accessToken');
            localStorage.removeItem('refreshToken');
          } else {
            state.errorMessage = 'Ошибка выхода';
          }
        }
      );
  },
  selectors: {
    getUser: (state: TUserState) => state.user,
    getErrorMessage: (state: TUserState) => state.errorMessage,
    // getIsPending: (state: TUserState) => state.isPending,
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
