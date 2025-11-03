import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ checked, onChange, className = '', ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
      {...props}
    />
  );
}

