import { FC, useState } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { useLocation } from 'react-router-dom';
import { userSelectors } from '@slices';

export const AppHeader: FC = () => {
  const user = useSelector(userSelectors.getUser);

  const userNameText = user ? user.name : '';

  const location = useLocation();

  return <AppHeaderUI userName={userNameText} />;
};
