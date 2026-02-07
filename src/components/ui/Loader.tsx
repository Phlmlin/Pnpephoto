import { Loader2 } from 'lucide-react';

interface LoaderProps {
    size?: number;
    className?: string;
}

export function Loader({ size = 24, className }: LoaderProps) {
    return (
        <div className="flex items-center justify-center">
            <Loader2 size={size} className={`animate-spin text-primary ${className}`} />
        </div>
    );
}
