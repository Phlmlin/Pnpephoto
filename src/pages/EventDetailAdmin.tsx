import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Share2, ExternalLink, Download } from 'lucide-react';
import type { Event, Photo } from '../types';
import { getEvent, getPhotosByEvent, uploadPhoto, deletePhoto, getPhotoURL } from '../services/database';
import { downloadAllPhotosAsZip } from '../services/download';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';

export function EventDetailAdmin() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id) {
            loadEventData();
        }
    }, [id]);

    const loadEventData = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const eventData = await getEvent(id);
            if (!eventData) {
                navigate('/admin');
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
            console.error('Error loading event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !id) return;

        setUploading(true);
        try {
            const files = Array.from(e.target.files);
            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    await uploadPhoto(id, file);
                }
            }
            await loadEventData();
        } catch (error) {
            console.error('Error uploading photos:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;

        try {
            await deletePhoto(photoId);
            await loadEventData();
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    const copyPublicLink = () => {
        const publicUrl = `${window.location.origin}/gallery/${id}`;
        navigator.clipboard.writeText(publicUrl);
        alert('Lien copié dans le presse-papier !');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader size={48} />
            </div>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/admin')}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white">
                            {event.name}
                        </h2>
                        <p className="text-white/70">
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => event && downloadAllPhotosAsZip(event.id, event.name)} disabled={photos.length === 0}>
                        <Download size={18} className="mr-2" />
                        Tout télécharger
                    </Button>
                    <Button variant="secondary" onClick={copyPublicLink}>
                        <Share2 size={18} className="mr-2" />
                        Partager
                    </Button>
                    <Button onClick={() => window.open(`/gallery/${id}`, '_blank')}>
                        <ExternalLink size={18} className="mr-2" />
                        Voir la galerie
                    </Button>
                </div>
            </div>

            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-display font-semibold">
                        Photos ({photos.length})
                    </h3>
                    <label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                        <Button as="span" disabled={uploading}>
                            <Upload size={18} className="mr-2" />
                            {uploading ? 'Upload en cours...' : 'Ajouter des photos'}
                        </Button>
                    </label>
                </div>

                {photos.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-lg">
                        <Upload size={48} className="mx-auto mb-4 text-white/40" />
                        <p className="text-white/70">
                            Aucune photo pour cet événement
                        </p>
                        <p className="text-white/50 text-sm mt-2">
                            Cliquez sur "Ajouter des photos" pour commencer
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden glass">
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
                                <button
                                    onClick={() => handleDeletePhoto(photo.id)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} className="text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
