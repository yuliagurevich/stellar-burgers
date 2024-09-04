import {
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TServerResponse,
  TUserResponse
} from '@api';
import userReducer, {
  TUserState,
  userThunks,
  userInitialState as initialState
} from '../slices/user';

describe('userSlice', () => {
  const registerData: TRegisterData = {
    email: 'email@domain.com',
    name: 'Name',
    password: 'password'
  };

  const loginData: TLoginData = {
    email: 'email@domain.com',
    password: 'password'
  };

  const authResponse: TAuthResponse = {
    success: true,
    user: {
      email: 'test@email.com',
      name: 'TestName'
    },
    accessToken: 'Bearer fake-access',
    refreshToken: 'fake-refresh'
  };

  const userResponse: TUserResponse = {
    success: true,
    user: {
      email: 'email@domain.com',
      name: 'Name'
    }
  };

  const logoutResponse: TServerResponse<{}> = {
    success: true
  };

  beforeAll(() => {
    global.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn()
    };
  });

  describe('registerUser', () => {
    it('should set isPending to true and errorMessage to null when registerUser.pending is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: false,
          errorMessage: 'errorMessage'
        },
        userThunks.registerUser.pending('user/register', registerData)
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false and errorMessage when registerUser.rejected is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          errorMessage: null
        },
        userThunks.registerUser.rejected(
          new Error(),
          'user/register',
          registerData
        )
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        errorMessage: 'Ошибка регистрации пользователя'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false, user data, save access token to cookies and refresh token to local storage when registerUser.fulfilled is dispatched', () => {
      const setCookieSpy = jest
        .spyOn(require('../../utils/cookie'), 'setCookie')
        .mockImplementation(() => {});

      const setItemSpy = jest.spyOn(global.localStorage, 'setItem');

      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          user: null
        },
        userThunks.registerUser.fulfilled(
          authResponse,
          'user/register',
          registerData
        )
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        user: authResponse.user
      };

      expect(actualState).toEqual(expectedState);

      expect(setCookieSpy).toHaveBeenCalledWith(
        'accessToken',
        authResponse.accessToken
      );
      expect(setCookieSpy).toHaveBeenCalledTimes(1);

      expect(setItemSpy).toHaveBeenCalledWith(
        'refreshToken',
        authResponse.refreshToken
      );
      expect(setItemSpy).toHaveBeenCalledTimes(1);

      setCookieSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('loginUser', () => {
    it('should set isPending to true and errorMessage to null when loginUser.pending is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: false,
          errorMessage: 'errorMessage'
        },
        userThunks.loginUser.pending('user/login', loginData)
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set set isPending to false and errorMessage when loginUser.rejected is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          errorMessage: null
        },
        userThunks.loginUser.rejected(new Error(), 'user/login', loginData)
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        errorMessage: 'Ошибка входа'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set set isPending to false, user data, save access token to cookies and refresh token to local storage when loginUser.fulfilled is dispatched', () => {
      const setCookieSpy = jest
        .spyOn(require('../../utils/cookie'), 'setCookie')
        .mockImplementation(() => {});

      const setItemSpy = jest.spyOn(global.localStorage, 'setItem');

      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          user: null
        },
        userThunks.loginUser.fulfilled(authResponse, 'user/register', loginData)
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        user: authResponse.user
      };

      expect(actualState).toEqual(expectedState);

      expect(setCookieSpy).toHaveBeenCalledWith(
        'accessToken',
        authResponse.accessToken
      );
      expect(setCookieSpy).toHaveBeenCalledTimes(1);

      expect(setItemSpy).toHaveBeenCalledWith(
        'refreshToken',
        authResponse.refreshToken
      );
      expect(setItemSpy).toHaveBeenCalledTimes(1);

      setCookieSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('getUser', () => {
    it('should set isPending to true, isAuthChecked to false and errorMessage to null when getUser.pending is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: false,
          isAuthChecked: true,
          errorMessage: 'errorMessage'
        },
        userThunks.getUser.pending('user/get')
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: true,
        isAuthChecked: false,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false, isAuthChecked to true and errorMessage when getUser.rejected is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          isAuthChecked: false,
          errorMessage: null
        },
        userThunks.getUser.rejected(new Error(), 'user/get')
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        isAuthChecked: true,
        errorMessage: 'Ошибка получения данных пользователя'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false, isAuthChecked to true and user data when getUser.fulfilled is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          isAuthChecked: false,
          errorMessage: null
        },
        userThunks.getUser.fulfilled(userResponse, 'user/get')
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        isAuthChecked: true,
        user: userResponse.user
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('updateUser', () => {
    it('should set isPending to true and errorMessage to null when updateUser.pending is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: false,
          errorMessage: 'errorMessage'
        },
        userThunks.updateUser.pending('user/update', registerData)
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false and errorMessage when updateUser.rejected is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          errorMessage: null
        },
        userThunks.updateUser.rejected(new Error(), 'user/update', registerData)
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        errorMessage: 'Ошибка изменения данных пользователя'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false and update user data when updateUser.fulfilled is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          user: {
            email: '',
            name: ''
          }
        },
        userThunks.updateUser.fulfilled(
          userResponse,
          'user/update',
          registerData
        )
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        user: userResponse.user
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('logoutUser', () => {
    it('should set isPending to true and errorMessage to null when logoutUser.pending is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: false,
          errorMessage: 'errorMessage'
        },
        userThunks.logoutUser.pending('user/logout')
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false and errorMessage when logoutUser.rejected is dispatched', () => {
      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          errorMessage: null
        },
        userThunks.logoutUser.rejected(new Error(), 'user/logout')
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        errorMessage: 'Ошибка выхода'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isPending to false, remove user data and tokens when logoutUser.fulfilled is dispatched', () => {
      const deleteCookieSpy = jest
        .spyOn(require('../../utils/cookie'), 'deleteCookie')
        .mockImplementation(() => {});

      const removeItemSpy = jest.spyOn(global.localStorage, 'removeItem');

      const actualState = userReducer(
        {
          ...initialState,
          isPending: true,
          user: {
            email: '',
            name: ''
          }
        },
        userThunks.logoutUser.fulfilled(logoutResponse, 'user/logout')
      );

      const expectedState: TUserState = {
        ...initialState,
        isPending: false,
        user: null
      };

      expect(actualState).toEqual(expectedState);

      expect(deleteCookieSpy).toHaveBeenCalledWith('accessToken');
      expect(deleteCookieSpy).toHaveBeenCalledTimes(1);

      expect(removeItemSpy).toHaveBeenCalledWith('refreshToken');
      expect(removeItemSpy).toHaveBeenCalledTimes(1);

      deleteCookieSpy.mockRestore();
      removeItemSpy.mockRestore();
    });
  });
});
