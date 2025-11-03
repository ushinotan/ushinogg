import { HTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorBanner } from './ErrorBanner';

interface ErrorDisplayProps extends HTMLAttributes<HTMLDivElement> {
  error: string;
  title?: string;
}

export function ErrorDisplay({ error, title = 'エラーが発生しました', className = '', ...props }: ErrorDisplayProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center ${className}`}
      {...props}
    >
      <div className="text-center max-w-md px-4">
        <AlertCircle className="size-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-300 mb-2">{title}</h2>
        <p className="text-slate-300">{error}</p>
      </div>
    </div>
  );
}

