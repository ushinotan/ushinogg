import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function Select({ children, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`px-3 py-1 rounded bg-slate-800 border border-slate-600 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

