import { Navigate } from 'react-router';

import { useAppSelector } from '@/store/hooks';

import { selectCredentials } from '@/store/authSlice';

import { LoginForm } from './components/LoginForm';

import './style.css';

export const LoginPage = () => {
  const credentials = useAppSelector(selectCredentials);

  if (credentials) {
    return <Navigate to='/chat' replace />;
  }

  return (
    <div className='login'>
      <main className='login__card'>
        <h2 className='login__title'>Green API</h2>

        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
