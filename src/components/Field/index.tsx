import React, { useId } from 'react';

import { ErrorMessage } from '@/components/ErrorMessage';

import './style.css';

interface FieldProps extends React.ComponentProps<'input'> {
  error?: string;
  label?: string;
}

export const Field: React.FC<FieldProps> = ({
  error,
  label,
  className,
  ...inputProps
}) => {
  const errorId = useId();

  return (
    <label className={className ? `field ${className}` : 'field'}>
      {label && <span className='field__label'>{label}</span>}
      <input
        {...inputProps}
        aria-invalid={!!error}
        className='field__input'
        aria-describedby={error ? errorId : undefined}
      />
      {error && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
    </label>
  );
};

export default Field;
