import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { Field } from '@/components/Field';
import { Button } from '@/components/Button';

import { newChatSchema } from '../../../../helpers/schema';

import './style.css';

export const NewChatForm = () => {
  const navigate = useNavigate();

  const { reset, register, formState, handleSubmit } = useForm({
    resolver: zodResolver(newChatSchema),
    defaultValues: { phone: '' },
  });
  const { errors } = formState;

  const onSubmit = handleSubmit(({ phone }) => {
    navigate(`/chat/${phone}`);
    reset();
  });

  return (
    <form noValidate onSubmit={onSubmit} className='new-chat'>
      <Field
        className='new-chat__field'
        error={errors.phone?.message}
        placeholder='Номер нового собеседника'
        {...register('phone')}
      />

      <Button type='submit'>Создать</Button>
    </form>
  );
};

export default NewChatForm;
