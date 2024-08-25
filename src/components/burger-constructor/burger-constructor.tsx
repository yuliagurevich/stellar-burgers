import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import {
  burgerSelectors,
  ordersSelectors,
  userSelectors,
  ordersThunks,
  burgerActions,
  orderActions
} from '@slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(burgerSelectors.getConstructorItems);
  const user = useSelector(userSelectors.getUser);
  const isOrderRequestPending = useSelector(ordersSelectors.getIsLoading);
  const orderModalData = useSelector(ordersSelectors.getOrderData);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isOrderRequestPending) return;

    if (constructorItems.bun && constructorItems.ingredients.length > 0) {
      const order = [];
      order.push(constructorItems.bun._id);
      constructorItems.ingredients.forEach((ingredient) => {
        order.push(ingredient._id);
      });
      order.push(constructorItems.bun._id);
      dispatch(ordersThunks.placeOrder(order));
    } else {
      return;
    }
  };

  const closeOrderModal = () => {
    dispatch(burgerActions.resetIngredients());
    dispatch(orderActions.resetOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isOrderRequestPending}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
