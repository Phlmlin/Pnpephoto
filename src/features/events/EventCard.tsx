import { useNavigate } from 'react-router-dom';
import { Calendar, Image as ImageIcon, Trash2 } from 'lucide-react';
import type { Event } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface EventCardProps {
    event: Event;
    onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/admin/event/${event.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.name}" ?`)) {
            onDelete(event.id);
        }
    };

    return (
        <Card hover onClick={handleClick} className="relative">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-white mb-2">
                        {event.name}
                    </h3>
                    <div className="flex items-center text-white/70 text-sm mb-2">
                        <Calendar size={16} className="mr-2" />
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </div>
                    {event.description && (
                        <p className="text-white/60 text-sm line-clamp-2">{event.description}</p>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <Trash2 size={18} />
                </Button>
            </div>

            <div className="flex items-center text-primary text-sm font-medium">
                <ImageIcon size={16} className="mr-2" />
                Gérer les photos
            </div>
        </Card>
    );
}
