import { Navigate } from 'react-router';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Field } from '../../components/Field';
import { Button } from '../../components/Button';

import { buildUrl, request } from '../../store/api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { loginSchema } from './helpers/schema';
import { getLoginError } from './helpers/utils';
import { logIn, selectCredentials } from '../../store/authSlice';

import './style.css';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const credentials = useAppSelector(selectCredentials);

  const { register, setError, formState, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { idInstance: '', apiTokenInstance: '', apiUrl: '' },
  });
  const { errors, isSubmitting } = formState;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { stateInstance } = await request<{ stateInstance: string; }>(
        buildUrl(values, 'getStateInstance'),
      );

      if (stateInstance !== 'authorized') {
        setError(
          'root',
          { message: `Инстанс не авторизован (${stateInstance}), отсканируйте QR-код в личном кабинете` });
        return;
      }

      dispatch(logIn(values));
    } catch (error) {
      setError('root', { message: getLoginError(error) });
    }
  });

  if (credentials) return <Navigate to='/chat' replace />;

  const nameSubmitBtn = isSubmitting ? 'Проверяем…' : 'Войти';

  return (
    <div className='login'>
      <main className='login__card'>
        <h2 className='login__title'>Green API</h2>

        <form noValidate onSubmit={onSubmit} className='login__form'>
          <Field
            label='Instance ID'
            error={errors.idInstance?.message}
            {...register('idInstance')}
          />
          <Field
            type='password'
            label='Token Instance API'
            error={errors.apiTokenInstance?.message}
            {...register('apiTokenInstance')}
          />

          {errors.root && (
            <p role='alert' className='login__error'>{errors.root.message}</p>
          )}

          <Button
            type='submit' disabled={isSubmitting} className='login__submit'
          >
            {nameSubmitBtn}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
