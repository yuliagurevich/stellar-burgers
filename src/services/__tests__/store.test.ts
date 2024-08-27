import store, { RootState, rootReducer } from '@store';
import {
  BURGER_SLICE_NAME,
  INGREDIENTS_SLICE_NAME,
  USER_SLICE_NAME,
  ORDERS_SLICE_NAME
} from '../slices/constants';
import { ingredientsInitialState } from '../slices/ingredients';
import { burgerInitialState } from '../slices/burger';
import { userInitialState } from '../slices/user';
import { ordersInitialState } from '../slices/orders';

describe('rootReducer', () => {
  it('should initialize with the correct reducers and initial state', () => {
    const state: RootState = store.getState();

    expect(state[INGREDIENTS_SLICE_NAME]).toEqual(ingredientsInitialState);
    expect(state[BURGER_SLICE_NAME]).toEqual(burgerInitialState);
    expect(state[USER_SLICE_NAME]).toEqual(userInitialState);
    expect(state[ORDERS_SLICE_NAME]).toEqual(ordersInitialState);
  });

  it('should return the initial state when called with undefined state and unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    const expectedInitialState = {
      [INGREDIENTS_SLICE_NAME]: ingredientsInitialState,
      [BURGER_SLICE_NAME]: burgerInitialState,
      [USER_SLICE_NAME]: userInitialState,
      [ORDERS_SLICE_NAME]: ordersInitialState
    };

    expect(state).toEqual(expectedInitialState);
  });
});
