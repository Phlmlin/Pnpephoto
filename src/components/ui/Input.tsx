import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium mb-2 text-white/90">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    'w-full px-4 py-2 rounded-lg glass text-white placeholder:text-white/50',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50',
                    'transition-all duration-300',
                    error && 'ring-2 ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
