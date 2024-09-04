import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { userSelectors, userThunks } from '@slices';
import { TRegisterData } from '@api';
import { useLocation } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorText = useSelector(userSelectors.getErrorMessage);

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const userData: TRegisterData = {
      name: userName,
      email,
      password
    };
    dispatch(userThunks.registerUser(userData));

    // TODO Очистить форму в случае успешной регистрации

    // TODO учесть ошибочное выполнение запроса

    // TODO Перенаправить пользователя либо на страницу, с которой он пришел, либо на главную
  };

  return (
    <RegisterUI
      errorText={errorText || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
