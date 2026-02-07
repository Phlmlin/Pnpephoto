import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Image as ImageIcon, Download } from 'lucide-react';
import type { Event, Photo } from '../types';
import { getEvent, getPhotosByEvent, getPhotoURL } from '../services/database';
import { downloadAllPhotosAsZip } from '../services/download';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { PhotoViewer } from '../features/gallery/PhotoViewer';

export function PublicGallery() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            loadGalleryData();
        }
    }, [id]);

    const loadGalleryData = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const eventData = await getEvent(id);
            if (!eventData) {
                setLoading(false);
                return;
            }
            setEvent(eventData);

            const eventPhotos = await getPhotosByEvent(id);
            setPhotos(eventPhotos);

            // Load photo URLs
            const urls: Record<string, string> = {};
            for (const photo of eventPhotos) {
                urls[photo.id] = await getPhotoURL(photo.id);
            }
            setPhotoUrls(urls);
        } catch (error) {
            console.error('Error loading gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader size={48} />
            </div>
        );
    }

    if (!event) {
        return (
            <Card className="text-center py-12">
                <p className="text-white/70 text-lg">Événement non trouvé</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-gradient mb-3">
                        {event.name}
                    </h2>
                    <div className="flex items-center justify-center text-white/70 mb-2">
                        <Calendar size={18} className="mr-2" />
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </div>
                    {event.description && (
                        <p className="text-white/60 mt-4">{event.description}</p>
                    )}
                    <div className="flex items-center justify-center text-white/50 text-sm mt-4 gap-4">
                        <div className="flex items-center">
                            <ImageIcon size={16} className="mr-2" />
                            {photos.length} photo{photos.length > 1 ? 's' : ''}
                        </div>
                        {photos.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white"
                                onClick={() => event && downloadAllPhotosAsZip(event.id, event.name)}
                            >
                                <Download size={16} className="mr-2" />
                                Tout télécharger (.zip)
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {photos.length === 0 ? (
                <Card className="text-center py-12">
                    <ImageIcon size={48} className="mx-auto mb-4 text-white/40" />
                    <p className="text-white/70">Aucune photo disponible pour cet événement</p>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="aspect-square rounded-lg overflow-hidden glass glass-hover cursor-pointer"
                                onClick={() => setSelectedPhotoIndex(index)}
                            >
                                {photoUrls[photo.id] ? (
                                    <img
                                        src={photoUrls[photo.id]}
                                        alt={photo.filename}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Loader />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {selectedPhotoIndex !== null && (
                        <PhotoViewer
                            photos={photos}
                            photoUrls={photoUrls}
                            currentIndex={selectedPhotoIndex}
                            onClose={() => setSelectedPhotoIndex(null)}
                            onNavigate={setSelectedPhotoIndex}
                        />
                    )}
                </>
            )}
        </div>
    );
}
