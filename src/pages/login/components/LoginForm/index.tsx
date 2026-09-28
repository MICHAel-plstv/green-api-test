import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';

import { logIn } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { buildUrl, request } from '@/store/api';

import { loginSchema } from '../../helpers/schema';
import { getLoginError } from '../../helpers/utils';

import './style.css';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();

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
        setError('root', {
          message: `Инстанс не авторизован (${stateInstance}), отсканируйте QR-код в личном кабинете`,
        });
        return;
      }

      dispatch(logIn(values));
    } catch (error) {
      setError('root', { message: getLoginError(error) });
    }
  });

  const submitLabel = isSubmitting ? 'Проверяем…' : 'Войти';

  return (
    <form noValidate onSubmit={onSubmit} className='login-form'>
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
        <ErrorMessage role='alert'>{errors.root.message}</ErrorMessage>
      )}

      <Button
        type='submit'
        disabled={isSubmitting}
        className='login-form__submit'
      >
        {submitLabel}
      </Button>
    </form>
  );
};

export default LoginForm;
