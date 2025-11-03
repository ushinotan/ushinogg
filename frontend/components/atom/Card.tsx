import { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'blue' | 'red';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  hover?: boolean;
}

export function Card({
  children,
  variant = 'default',
  hover = false,
  className = '',
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'bg-slate-800/50 border-slate-700',
    blue: 'bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-600/50',
    red: 'bg-gradient-to-br from-red-900/40 to-red-800/20 border-red-600/50',
  };

  const hoverClass = hover ? 'hover:border-slate-600 transition-colors' : '';

  return (
    <div
      className={`
        p-6 rounded-xl border shadow-lg
        ${variantClasses[variant]}
        ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

