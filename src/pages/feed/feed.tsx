import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '@store';
import { ordersSelectors, ordersThunks } from '@slices';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const feedOrders = useSelector(ordersSelectors.getOrders);
  const isLoading = useSelector(ordersSelectors.getIsLoading);

  const handleGetFeed = useCallback(
    () => dispatch(ordersThunks.getFeedOrders()),
    [dispatch]
  );

  useEffect(() => {
    handleGetFeed();
  }, [handleGetFeed]);

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={feedOrders} handleGetFeeds={handleGetFeed} />;
};
