import ingredientsReducer, {
  ingredientsThunks,
  TIngredientsState
} from '../slices/ingredients';

describe('ingredientsSlice', () => {
  // Should I use initial imported initialState?
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  describe('getIngredients', () => {
    it('should set isLoading to true and error to null when getIngredients.pending is dispatched', () => {
      const actualState = ingredientsReducer(
        {
          ...initialState,
          isLoading: false,
          error: 'Test error'
        },
        ingredientsThunks.getIngredients.pending('ingredients/getAll')
      );

      const expectedState: TIngredientsState = {
        ingredients: [],
        isLoading: true,
        error: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and set error when getIngredients.rejected is dispatched', () => {
      const actualState = ingredientsReducer(
        {
          ...initialState,
          isLoading: true,
          error: null
        },
        ingredientsThunks.getIngredients.rejected(
          new Error('Error message'),
          'ingredients/getAll'
        )
      );

      const expectedState: TIngredientsState = {
        ingredients: [],
        isLoading: false,
        error: 'Error message'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set ingredients and reset isLoading and error when getIngredients.fulfilled is dispatched', () => {
      const ingredientsData = [
        {
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        }
      ];

      const actualState = ingredientsReducer(
        {
          ...initialState,
          ingredients: [],
          isLoading: true,
          error: null
        },
        ingredientsThunks.getIngredients.fulfilled(
          ingredientsData,
          'ingredients/getAll'
        )
      );

      const expectedState: TIngredientsState = {
        ingredients: ingredientsData,
        isLoading: false,
        error: null
      };

      expect(actualState).toEqual(expectedState);
    });
  });
});
