import { HTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message, size = 'md', className = '', ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'size-6',
    md: 'size-12',
    lg: 'size-16',
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`} {...props}>
      <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin`} />
      {message && <p className="text-slate-300">{message}</p>}
    </div>
  );
}

