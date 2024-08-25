import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@store';
import { userSelectors, userThunks } from '@slices';
import { useLocation } from 'react-router-dom';

export const Profile: FC = () => {
  const user = useSelector(userSelectors.getUser);

  const userNameText = user ? user.name : '';
  const userEmailText = user ? user.email : '';

  const location = useLocation();
  console.log('Profile location', location);

  const [formValue, setFormValue] = useState({
    name: userNameText,
    email: userEmailText,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userNameText,
      email: userEmailText
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(userThunks.updateUser(formValue));

    // TODO Очистить поле пароля? Или оставить?
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userNameText,
      email: userEmailText,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
