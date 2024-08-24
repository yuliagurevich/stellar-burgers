import { ordersSelectors, ordersThunks } from '@slices';
import { useDispatch } from '@store';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '@store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(ordersSelectors.getOrders);

  useEffect(() => {
    dispatch(ordersThunks.getUserOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
