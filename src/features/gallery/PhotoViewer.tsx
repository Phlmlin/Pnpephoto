import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { Photo } from '../../types';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';

interface PhotoViewerProps {
    photos: Photo[];
    photoUrls: Record<string, string>;
    currentIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export function PhotoViewer({
    photos,
    photoUrls,
    currentIndex,
    onClose,
    onNavigate
}: PhotoViewerProps) {
    const currentPhoto = photos[currentIndex];
    const currentUrl = photoUrls[currentPhoto?.id];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                onNavigate(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) {
                onNavigate(currentIndex + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, photos.length, onClose, onNavigate]);

    const handleDownload = async () => {
        if (!currentUrl) return;

        try {
            const response = await fetch(currentUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentPhoto.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading photo:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between glass border-b border-white/10">
                <div className="text-white">
                    <p className="font-medium">{currentPhoto?.filename}</p>
                    <p className="text-sm text-white/60">
                        {currentIndex + 1} / {photos.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={handleDownload}>
                        <Download size={20} />
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
            </div>

            {/* Navigation */}
            {currentIndex > 0 && (
                <button
                    onClick={() => onNavigate(currentIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 glass glass-hover rounded-full"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>
            )}

            {currentIndex < photos.length - 1 && (
                <button
                    onClick={() => onNavigate(currentIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 glass glass-hover rounded-full"
                >
                    <ChevronRight size={24} className="text-white" />
                </button>
            )}

            {/* Image */}
            <div className="max-w-7xl max-h-[85vh] md:max-h-[80vh] w-full h-full flex items-center justify-center p-4 md:p-10 lg:p-20">
                {currentUrl ? (
                    <img
                        src={currentUrl}
                        alt={currentPhoto?.filename}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                ) : (
                    <Loader size={48} />
                )}
            </div>

            {/* Click outside to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            />
        </div>
    );
}
