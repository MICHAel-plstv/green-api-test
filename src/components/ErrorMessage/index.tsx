import React from 'react';

import './style.css';

interface ErrorMessageProps extends React.ComponentProps<'span'> { }

export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  return <span {...props} className='error-message' />;
};

export default ErrorMessage;
