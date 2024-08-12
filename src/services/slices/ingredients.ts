import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from 'src/services/store';
import { INGREDIENTS_SLICE_NAME } from './constants';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null | undefined;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    getIsLoading: (state: TIngredientsState) => state.isLoading,
    getError: (state: TIngredientsState) => state.error,
    getIngredients: (state: TIngredientsState) => state.ingredients
  }
});

const getIngredientById = (ingredientId: string) => (state: RootState) =>
  state.ingredients.ingredients.find(
    (ingredient) => ingredient._id === ingredientId
  );

export const ingredientsThunks = {
  getIngredients
};

export const ingredientSelectors = {
  ...ingredientsSlice.selectors,
  getIngredientById
};

export default ingredientsSlice.reducer;
