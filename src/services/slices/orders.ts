import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { RootState } from '@store';
import { ORDERS_SLICE_NAME } from './constants';

type TOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;

  orderData: TOrder | null;
};

const initialState: TOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,

  orderData: null
};

const placeOrder = createAsyncThunk('orders/create', async (order: string[]) =>
  orderBurgerApi(order)
);

const getFeedOrders = createAsyncThunk('orders/getAll', async () => {
  console.log('Request');
  return getFeedsApi();
});

const getUserOrders = createAsyncThunk('orders/get', async () =>
  getOrdersApi()
);

const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

const ordersSlice = createSlice({
  name: ORDERS_SLICE_NAME,
  initialState,
  reducers: {
    resetOrderData: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload.order;
      })
      .addCase(getFeedOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedOrders.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(
        getFeedOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(getUserOrders.pending, (state) => {})
      .addCase(getUserOrders.rejected, (state, action) => {})
      .addCase(getUserOrders.fulfilled, (state, action) => {
        console.log(action.payload);
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {})
      .addCase(getOrderByNumber.rejected, (state, action) => {})
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
      });
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
