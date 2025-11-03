import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'blue' | 'red' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-300',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-slate-400 hover:text-blue-400 hover:bg-blue-950/30',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <button
      className={`
        flex items-center justify-center gap-2 rounded-lg font-medium transition-colors
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

