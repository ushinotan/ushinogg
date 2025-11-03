import { HTMLAttributes, ReactNode } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div
      className={`p-6 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

