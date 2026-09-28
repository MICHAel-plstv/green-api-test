import { Navigate, Outlet } from 'react-router';

import { useAppSelector } from '@/store/hooks';

import { selectCredentials } from '@/store/authSlice';

export const ProtectedRoute = () => {
  const credentials = useAppSelector(selectCredentials);

  return credentials ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
