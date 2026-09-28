import { Navigate, createBrowserRouter } from 'react-router';

import { LoginPage } from './pages/login';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to='/login' replace /> },
  { path: '/login', element: <LoginPage /> },
]);
