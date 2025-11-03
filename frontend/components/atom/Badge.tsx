import { HTMLAttributes, ReactNode } from 'react';

type BadgeVariant = 'default' | 'blue' | 'red' | 'yellow' | 'slate' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-slate-700 text-slate-300',
    blue: 'bg-blue-600 text-blue-100',
    red: 'bg-red-600 text-red-100',
    yellow: 'bg-yellow-600 text-white',
    slate: 'bg-slate-800/50 text-slate-300',
    outline: 'border text-slate-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}

