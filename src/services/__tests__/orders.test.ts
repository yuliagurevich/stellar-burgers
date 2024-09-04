import { TOrder } from '@utils-types';
import ordersReducer, {
  TOrdersState,
  ordersThunks,
  ordersInitialState as initialState
} from '../slices/orders';
import { TFeedsResponse, TNewOrderResponse, TOrderResponse } from '@api';

describe('ordersSlice', () => {
  const exampleOrder: TOrder = {
    _id: '66d616fc119d45001b503b6b',
    createdAt: '2024-09-02T19:50:20.141Z',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093c'
    ],
    name: 'Краторный люминесцентный бургер',
    number: 51881,
    status: 'done',
    updatedAt: '2024-09-02T19:50:20.602Z'
  };

  const exampleOrdersData: TOrder[] = [exampleOrder];

  const exampleNewOrderResponse: TNewOrderResponse = {
    success: true,
    name: 'Краторный люминесцентный бургер',
    order: {
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093c'
      ],
      _id: '66d616fc119d45001b503b6b',
      status: 'done',
      name: 'Краторный люминесцентный бургер',
      createdAt: '2024-09-02T19:50:20.141Z',
      updatedAt: '2024-09-02T19:50:20.602Z',
      number: 51881
    }
  };

  const exampleFeedResponse: TFeedsResponse = {
    success: true,
    orders: [
      {
        _id: '66d617db119d45001b503b77',
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa0947',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa0944'
        ],
        status: 'done',
        name: 'Space фалленианский краторный традиционный-галактический метеоритный бургер',
        createdAt: '2024-09-02T19:54:03.583Z',
        updatedAt: '2024-09-02T19:54:04.207Z',
        number: 51882
      }
    ],
    total: 51508,
    totalToday: 103
  };

  const exampleOrderByNumberResponse: TOrderResponse = {
    success: true,
    orders: [
      {
        _id: '66b675f7119d45001b4fed0f',
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0946',
          '643d69a5c3f7b9001cfa0943',
          '643d69a5c3f7b9001cfa0949',
          '643d69a5c3f7b9001cfa0942',
          '643d69a5c3f7b9001cfa093e'
        ],
        status: 'done',
        name: 'Space краторный минеральный экзо-плантаго spicy люминесцентный бургер',
        createdAt: '2024-08-09T20:03:03.214Z',
        updatedAt: '2024-08-09T20:03:03.695Z',
        number: 49113
      }
    ]
  };

  describe('placeOrder', () => {
    it('should set orderData to null, isLoading to true and errorMessage to null when placeOrder.pending is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          orderData: exampleOrder,
          isLoading: false,
          errorMessage: 'errorMessage'
        },
        ordersThunks.placeOrder.pending('orders/create', [])
      );

      const expectedState: TOrdersState = {
        ...initialState,
        orderData: null,
        isLoading: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and errorMessage when placeOrder.rejected is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          errorMessage: null
        },
        ordersThunks.placeOrder.rejected(new Error(), 'orders/create', [])
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        errorMessage: 'Не удалось разместить заказ'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and orderData when placeOrder.fulfilled is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          orderData: null
        },
        ordersThunks.placeOrder.fulfilled(
          exampleNewOrderResponse,
          'orders/create',
          []
        )
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        orderData: exampleNewOrderResponse.order
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('getFeedOrders', () => {
    it('should set isLoading to true, errorMessage to null and reset orders data when getFeedOrders.pending is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          orders: exampleOrdersData,
          total: 1111111,
          totalToday: 111,
          isLoading: false,
          errorMessage: 'errorMessage'
        },
        ordersThunks.getFeedOrders.pending('orders/getAll')
      );

      const expectedState: TOrdersState = {
        ...initialState,
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false when getFeedOrders.rejected is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          errorMessage: null
        },
        ordersThunks.getFeedOrders.rejected(new Error(), 'orders/getAll')
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        errorMessage: 'Не удалось получить данные для ленты заказов'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and set feed data when getFeedOrders.fulfilled is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          orders: [],
          total: 0,
          totalToday: 0
        },
        ordersThunks.getFeedOrders.fulfilled(
          exampleFeedResponse,
          'orders/getAll'
        )
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        orders: exampleFeedResponse.orders,
        total: exampleFeedResponse.total,
        totalToday: exampleFeedResponse.totalToday
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('getUserOrders', () => {
    it('should set isLoading to true, errorMessage to null and reset orders data when getUserOrders.pending is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          orders: exampleOrdersData,
          total: 1111111,
          totalToday: 111,
          isLoading: false,
          errorMessage: 'errorMessage'
        },
        ordersThunks.getUserOrders.pending('orders/get')
      );

      const expectedState: TOrdersState = {
        ...initialState,
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and set errorMessage when getUserOrders.rejected is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          errorMessage: null
        },
        ordersThunks.getUserOrders.rejected(new Error(), 'orders/get')
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        errorMessage: 'Не удалось получить данные о заказах пользователя'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and set user orders data when getUserOrders.fulfilled is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          orders: []
        },
        ordersThunks.getUserOrders.fulfilled(exampleOrdersData, 'orders/get')
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        orders: exampleOrdersData
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('getOrderByNumber', () => {
    it('should set orderData to null, isLoading to true and errorMessage to null when getOrderByNumber.pending is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          orderData: exampleOrder,
          isLoading: false,
          errorMessage: 'errorMessage'
        },
        ordersThunks.getOrderByNumber.pending('orders/getByNumber', 1)
      );

      const expectedState: TOrdersState = {
        ...initialState,
        orderData: null,
        isLoading: true,
        errorMessage: null
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and errorMessage when getOrderByNumber.rejected is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          errorMessage: null
        },
        ordersThunks.getOrderByNumber.rejected(
          new Error(),
          'orders/getByNumber',
          1
        )
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        errorMessage: 'Не удалось получить данные по номеру заказа'
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set isLoading to false and orderData when getOrderByNumber.fulfilled is dispatched', () => {
      const actualState = ordersReducer(
        {
          ...initialState,
          isLoading: true,
          orderData: null
        },
        ordersThunks.getOrderByNumber.fulfilled(
          exampleOrderByNumberResponse,
          'orders/getByNumber',
          1
        )
      );

      const expectedState: TOrdersState = {
        ...initialState,
        isLoading: false,
        orderData: exampleOrderByNumberResponse.orders[0]
      };

      expect(actualState).toEqual(expectedState);
    });
  });
});
