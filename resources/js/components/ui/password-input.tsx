import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Input } from './input';

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showLabel?: boolean;
  showError?: boolean;
}

export function PasswordInput({
  label,
  error,
  showLabel = true,
  showError = true,
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      {showLabel && label && (
        <label className="mb-2 block text-sm font-medium">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`pr-10 ${className}`}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {showError && error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
