import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse,
  TNewOrderResponse,
  TOrderResponse
} from '@api';
import { RootState } from '@store';
import { ORDERS_SLICE_NAME } from './constants';

export type TOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  orderData: TOrder | null;
  errorMessage: string | null;
};

export const ordersInitialState: TOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  orderData: null,
  errorMessage: null
};

const placeOrder = createAsyncThunk('orders/create', orderBurgerApi);

const getFeedOrders = createAsyncThunk('orders/getAll', getFeedsApi);

const getUserOrders = createAsyncThunk('orders/get', getOrdersApi);

const getOrderByNumber = createAsyncThunk(
  'orders/getByNumber',
  getOrderByNumberApi
);

const ordersSlice = createSlice({
  name: ORDERS_SLICE_NAME,
  initialState: ordersInitialState,
  reducers: {
    resetOrderData: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderData = null;
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          action.error.message || 'Не удалось разместить заказ';
      })
      .addCase(
        placeOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.isLoading = false;
          state.orderData = action.payload.order;
        }
      )
      .addCase(getFeedOrders.pending, (state) => {
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getFeedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          action.error.message ||
          'Не удалось получить данные для ленты заказов';
      })
      .addCase(
        getFeedOrders.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(getUserOrders.pending, (state) => {
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          action.error.message ||
          'Не удалось получить данные о заказах пользователя';
      })
      .addCase(
        getUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderData = null;
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          action.error.message || 'Не удалось получить данные по номеру заказа';
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.isLoading = false;
          state.orderData = action.payload.orders[0];
        }
      );
  },
  selectors: {
    getOrders: (state: TOrdersState) => state.orders,
    getTotal: (state: TOrdersState) => state.total,
    getTotalToday: (state: TOrdersState) => state.totalToday,
    getIsLoading: (state: TOrdersState) => state.isLoading,
    getOrderData: (state: TOrdersState) => state.orderData
  }
});

const getOrderDataByNumber = (orderNumber: string) => (state: RootState) => {
  const number = Number(orderNumber);
  let order = null;
  if (state.orders.orders.length) {
    order = state.orders.orders.find((order) => order.number === number);
  } else if (state.orders.orderData) {
    order = state.orders.orderData;
  }
  return order;
};

export const ordersThunks = {
  placeOrder,
  getFeedOrders,
  getUserOrders,
  getOrderByNumber
};

export const orderActions = ordersSlice.actions;

export const ordersSelectors = {
  ...ordersSlice.selectors,
  getOrderDataByNumber
};

export default ordersSlice.reducer;
