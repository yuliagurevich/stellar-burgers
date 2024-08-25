import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredients';
import burgerReducer from './slices/burger';
import userReducer from './slices/user';
import ordersReducer from './slices/orders';
import {
  BURGER_SLICE_NAME,
  INGREDIENTS_SLICE_NAME,
  ORDERS_SLICE_NAME,
  USER_SLICE_NAME
} from './slices/constants';

const rootReducer = {
  [INGREDIENTS_SLICE_NAME]: ingredientsReducer,
  [BURGER_SLICE_NAME]: burgerReducer,
  [USER_SLICE_NAME]: userReducer,
  [ORDERS_SLICE_NAME]: ordersReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
