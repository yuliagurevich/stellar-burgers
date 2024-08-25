import { userSelectors } from '@slices';
import { useSelector } from '@store';
import { Preloader } from '@ui';
import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: TProtectedRouteProps) => {
  const location = useLocation();

  const isAuthChecked = useSelector(userSelectors.getIsAuthChecked);
  const user = useSelector(userSelectors.getUser);

  // Show prelaoder while uathentication is checked
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // The user is not authenticated and is redirected to the login page
  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        to='/login'
        state={{
          from: {
            ...location,
            background: location.state?.backgroundn,
            state: null
          }
        }}
        replace
      />
    );
  }

  // The user is authenticated and is redirected to the page he came from or to the root route
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    const background = location.state?.from?.background || null;
    return <Navigate to={from} state={{ background }} replace />;
  }

  return children;
};
