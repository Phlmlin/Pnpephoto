import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
}

export function Card({ children, className, hover = false, ...props }: CardProps) {
    return (
        <div
            className={cn('glass rounded-xl p-6', hover && 'glass-hover cursor-pointer', className)}
            {...props}
        >
            {children}
        </div>
    );
}
