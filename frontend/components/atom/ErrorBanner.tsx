import { HTMLAttributes, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  title?: string;
}

export function ErrorBanner({ message, title, className = '', ...props }: ErrorBannerProps) {
  return (
    <div
      className={`p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3 ${className}`}
      {...props}
    >
      <AlertCircle className="size-5 text-red-400 flex-shrink-0" />
      <div className="flex-1">
        {title && <h3 className="text-red-300 font-semibold mb-1">{title}</h3>}
        <p className="text-red-300">{message}</p>
      </div>
    </div>
  );
}

