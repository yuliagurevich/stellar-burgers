import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';
import { BURGER_SLICE_NAME } from './constants';

type TCostructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TCostructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const burgerSlice = createSlice({
  name: BURGER_SLICE_NAME,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      const ingredientIndex = action.payload;
      state.constructorItems.ingredients.splice(ingredientIndex, 1);
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const ingredientIndex = action.payload;
      const previousIngredient = ingredients[ingredientIndex - 1];
      ingredients.splice(
        ingredientIndex - 1,
        1,
        ingredients.splice(ingredientIndex, 1, previousIngredient)[0]
      );
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const ingredientIndex = action.payload;
      const nextIngredient = ingredients[ingredientIndex + 1];
      ingredients.splice(
        ingredientIndex + 1,
        1,
        ingredients.splice(ingredientIndex, 1, nextIngredient)[0]
      );
    },
    resetIngredients: (state) => {
      state.constructorItems = initialState.constructorItems;
    }
  },
  selectors: {
    getConstructorItems: (state: TCostructorState) => state.constructorItems
  }
});

export const burgerActions = burgerSlice.actions;

export const burgerSelectors = burgerSlice.selectors;

export default burgerSlice.reducer;
