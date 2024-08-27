import burgerReducer, {
  burgerActions,
  burgerInitialState
} from '../../services/slices/burger';
import { TIngredient } from '@utils-types';

describe('burgerSlice', () => {
  describe('add ingredients', () => {
    it('should add a bun ingredient correctly', () => {
      const bun: TIngredient = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      };

      const action = burgerActions.addIngredient(bun);
      const state = burgerReducer(burgerInitialState, action);

      expect(state.constructorItems.bun).toEqual({
        ...bun,
        id: expect.any(String)
      });
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });

    it('should add a non-bun ingredient correctly', () => {
      const ingredient: TIngredient = {
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
      };

      const action = burgerActions.addIngredient(ingredient);
      const state = burgerReducer(burgerInitialState, action);

      expect(state.constructorItems.bun).toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual({
        ...ingredient,
        id: expect.any(String)
      });
    });

    it('should replace existing bun when a new bun is added', () => {
      const initialBun: TIngredient = {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      };

      const newBun: TIngredient = {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      };

      const initialStateWithBun = {
        ...burgerInitialState,
        constructorItems: {
          ...burgerInitialState.constructorItems,
          bun: { ...initialBun, id: '1' }
        }
      };

      const action = burgerActions.addIngredient(newBun);
      const state = burgerReducer(initialStateWithBun, action);

      expect(state.constructorItems.bun).toEqual({
        ...newBun,
        id: expect.any(String)
      });
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });
});
