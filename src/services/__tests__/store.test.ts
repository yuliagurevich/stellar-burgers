import store, { RootState, rootReducer } from '@store';
import {
  BURGER_SLICE_NAME,
  INGREDIENTS_SLICE_NAME,
  USER_SLICE_NAME,
  ORDERS_SLICE_NAME
} from '../slices/constants';
import ingredientsReducer, {
  ingredientsInitialState
} from '../slices/ingredients';
import burgerReducer, { burgerInitialState } from '../slices/burger';
import userReducer, { userInitialState } from '../slices/user';
import ordersReducer, { ordersInitialState } from '../slices/orders';

describe('rootReducer', () => {
  it('initializes the state correctly', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      [BURGER_SLICE_NAME]: burgerReducer(undefined, initAction),
      [INGREDIENTS_SLICE_NAME]: ingredientsReducer(undefined, initAction),
      [ORDERS_SLICE_NAME]: ordersReducer(undefined, initAction),
      [USER_SLICE_NAME]: userReducer(undefined, initAction)
    });
  });

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
