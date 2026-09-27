import React, { useId } from 'react';

import './style.css';

interface FieldProps extends React.ComponentProps<'input'> {
  label: string;
  error?: string;
}

export const Field: React.FC<FieldProps> = ({
  error,
  label,
  ...inputProps
}) => {
  const errorId = useId();

  return (
    <label className='field'>
      <span className='field__label'>{label}</span>
      <input
        {...inputProps}
        aria-invalid={!!error}
        className='field__input'
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} className='field__error'>
          {error}
        </span>
      )}
    </label>
  );
};

export default Field;
