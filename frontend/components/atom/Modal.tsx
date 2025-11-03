import { HTMLAttributes, ReactNode } from 'react';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

export function Modal({ children, isOpen, onClose, className = '', ...props }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      {...props}
    >
      <div
        className={`bg-slate-800 rounded-lg p-6 shadow-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

