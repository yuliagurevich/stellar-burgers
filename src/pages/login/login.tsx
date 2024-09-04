import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { TLoginData } from '@api';
import { userSelectors, userThunks } from '@slices';
import { useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const errorText = useSelector(userSelectors.getErrorMessage);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData: TLoginData = {
      email,
      password
    };

    dispatch(userThunks.loginUser(userData));

    // TODO очистить форму в случае успешного завершения запроса

    // TODO учесть ошибочное выполнение запроса

    // TODO перенаправить на страницу, с которой пришел пользователь или главную
  };

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
