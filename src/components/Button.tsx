import { ReactNode } from 'react';


type ButtonProps = {
  title?: string,
  disabled?: boolean,
  onClick: () => void,
  children?: ReactNode,
};

export default function Button({ title, disabled, onClick, children }: ButtonProps) {
  return (
    <button
      className='menu-button'
      type='button'
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
