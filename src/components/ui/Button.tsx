import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    as?: any; // Simple polymorphic support
}

export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    as: Component = 'button',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-pnpe-blue hover:bg-pnpe-blue/90 text-white shadow-lg shadow-pnpe-blue/30 border-b-2 border-pnpe-green',
        secondary: 'glass glass-hover text-pnpe-yellow border-pnpe-yellow/20 hover:border-pnpe-yellow/50',
        ghost: 'hover:bg-white/10 text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <Component
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </Component>
    );
}
