import { HTMLAttributes } from 'react';

type NumberBadgeVariant = 'blue' | 'red';

interface NumberBadgeProps extends HTMLAttributes<HTMLDivElement> {
  number: number;
  variant?: NumberBadgeVariant;
}

export function NumberBadge({
  number,
  variant = 'blue',
  className = '',
  ...props
}: NumberBadgeProps) {
  const variantClasses = {
    blue: 'bg-blue-600 text-white',
    red: 'bg-red-600 text-white',
  };

  return (
    <div
      className={`
        flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {number}
    </div>
  );
}

