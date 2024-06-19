import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const Input: React.FC<InputProps> = ({
  inputClassName,
  errorClassName,
  error,
  ...inputProps
}) => {
  return (
    <>
      <input className={`${inputClassName}`} {...inputProps} />
      {error && <span className={`${errorClassName}`}>{error}</span>}
    </>
  );
};

export default Input;
