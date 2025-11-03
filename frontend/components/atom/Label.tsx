import { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  isActive?: boolean;
}

export function Label({ children, isActive = false, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`flex-1 cursor-pointer min-w-0 ${
        isActive ? 'text-blue-100' : 'text-slate-300'
      } ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

