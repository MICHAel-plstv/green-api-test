import { Navigate, createBrowserRouter } from 'react-router';

import { ProtectedRoute } from '@/components/ProtectedRoute';

import { ChatPage } from './pages/chat';
import { LoginPage } from './pages/login';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/chat/:phone?', element: <ChatPage /> }],
  },
  { path: '*', element: <Navigate to='/chat' replace /> },
]);
