import React from 'react';

import './style.css';

interface ButtonProps extends React.ComponentProps<'button'> { }

export const Button: React.FC<ButtonProps> = ({
  className,
  type = 'button',
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      type={type}
      className={className ? `button ${className}` : 'button'}
    />
  );
};

export default Button;
