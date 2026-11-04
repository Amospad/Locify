import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center rounded-md bg-acero px-4 py-2 text-sm font-medium text-white hover:bg-azul-profundo disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = 'Button';
