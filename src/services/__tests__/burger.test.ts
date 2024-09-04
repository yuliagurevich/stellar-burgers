import burgerReducer, {
  burgerActions,
  burgerInitialState
} from '../../services/slices/burger';
import { TIngredient } from '@utils-types';

describe('burgerSlice', () => {
  const sampleBun1: TIngredient = {
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

  const sampleBun2: TIngredient = {
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

  const sampleIngredient1: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const sampleIngredient2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  describe('addIngredient', () => {
    it('should add a bun ingredient correctly', () => {
      const state = burgerReducer(
        burgerInitialState,
        burgerActions.addIngredient(sampleBun1)
      );

      expect(state.constructorItems.bun).toEqual({
        ...sampleBun1,
        id: expect.any(String)
      });
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });

    it('should add a non-bun ingredient correctly', () => {
      const state = burgerReducer(
        burgerInitialState,
        burgerActions.addIngredient(sampleIngredient1)
      );

      expect(state.constructorItems.bun).toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual({
        ...sampleIngredient1,
        id: expect.any(String)
      });
    });

    it('should replace existing bun when a new bun is added', () => {
      const initialStateWithBun = {
        ...burgerInitialState,
        constructorItems: {
          ...burgerInitialState.constructorItems,
          bun: { ...sampleBun1, id: '1' }
        }
      };

      const state = burgerReducer(
        initialStateWithBun,
        burgerActions.addIngredient(sampleBun2)
      );

      expect(state.constructorItems.bun).toEqual({
        ...sampleBun2,
        id: expect.any(String)
      });
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient from constructorItems', () => {
      const initialState = {
        ...burgerInitialState,
        constructorItems: {
          bun: { ...sampleBun1, id: '1' },
          ingredients: [
            { ...sampleIngredient1, id: '2' },
            { ...sampleIngredient2, id: '3' }
          ]
        }
      };

      const state = burgerReducer(
        initialState,
        burgerActions.removeIngredient(0)
      );

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0].id).toBe('3');
    });
  });

  describe('moveIngredientUp', () => {
    it('should move ingredient up in constructorItems', () => {
      const initialState = {
        ...burgerInitialState,
        constructorItems: {
          bun: { ...sampleBun1, id: '1' },
          ingredients: [
            { ...sampleIngredient1, id: '2' },
            { ...sampleIngredient2, id: '3' }
          ]
        }
      };

      const state = burgerReducer(
        initialState,
        burgerActions.moveIngredientUp(1)
      );

      expect(state.constructorItems.ingredients[0].id).toBe('3');
      expect(state.constructorItems.ingredients[1].id).toBe('2');
    });
  });

  describe('moveIngredientDown', () => {
    it('should move ingredient down in constructorItems', () => {
      const initialState = {
        ...burgerInitialState,
        constructorItems: {
          bun: { ...sampleBun1, id: '1' },
          ingredients: [
            { ...sampleIngredient1, id: '2' },
            { ...sampleIngredient2, id: '3' }
          ]
        }
      };

      const state = burgerReducer(
        initialState,
        burgerActions.moveIngredientDown(0)
      );

      expect(state.constructorItems.ingredients[0].id).toBe('3');
      expect(state.constructorItems.ingredients[1].id).toBe('2');
    });
  });

  describe('resetIngredients', () => {
    it('should reset constructorItems to initial state', () => {
      const initialState = {
        ...burgerInitialState,
        constructorItems: {
          bun: { ...sampleBun1, id: '1' },
          ingredients: [{ ...sampleIngredient1, id: '2' }]
        }
      };

      const state = burgerReducer(
        initialState,
        burgerActions.resetIngredients()
      );

      expect(state.constructorItems.bun).toBeNull();
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });
});
