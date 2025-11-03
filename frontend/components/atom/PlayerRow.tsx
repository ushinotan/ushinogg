import { ReactNode, HTMLAttributes } from 'react';

interface PlayerRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  isSelected: boolean;
  className?: string;
}

export function PlayerRow({ children, isSelected, className = '', ...props }: PlayerRowProps) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
        ${
          isSelected
            ? 'bg-blue-950/30 border-blue-600/50 hover:bg-blue-950/40'
            : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

