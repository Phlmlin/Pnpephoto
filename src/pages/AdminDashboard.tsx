import { useState, useEffect, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Event } from '../types';
import { getAllEvents, createEvent, deleteEvent } from '../services/database';
import { EventCard } from '../features/events/EventCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';

export function AdminDashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEventName, setNewEventName] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const allEvents = await getAllEvents();
            setEvents(allEvents.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return events.filter(event =>
            event.name.toLowerCase().includes(query) ||
            (event.description || '').toLowerCase().includes(query)
        );
    }, [events, searchQuery]);

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventName || !newEventDate) return;

        try {
            await createEvent({
                name: newEventName,
                date: newEventDate,
                description: newEventDescription || undefined,
            });

            setNewEventName('');
            setNewEventDate('');
            setNewEventDescription('');
            setShowCreateForm(false);
            loadEvents();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        try {
            await deleteEvent(id);
            loadEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                        Événements
                    </h2>
                    <p className="text-white/70 text-sm md:text-base">
                        Gérez vos événements et leurs galeries photos
                    </p>
                </div>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg glass text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setShowCreateForm(!showCreateForm)} className="shrink-0">
                        <Plus size={20} className="mr-2" />
                        Nouveau
                    </Button>
                </div>
            </div>

            {showCreateForm && (
                <Card>
                    <h3 className="text-xl font-display font-semibold mb-4">
                        Créer un événement
                    </h3>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                        <Input
                            label="Nom de l'événement"
                            placeholder="Ex: Journée Portes Ouvertes 2024"
                            value={newEventName}
                            onChange={(e) => setNewEventName(e.target.value)}
                            required
                        />
                        <Input
                            type="date"
                            label="Date de l'événement"
                            value={newEventDate}
                            onChange={(e) => setNewEventDate(e.target.value)}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white/90">
                                Description (optionnel)
                            </label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg glass text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 min-h-[100px]"
                                placeholder="Description de l'événement..."
                                value={newEventDescription}
                                onChange={(e) => setNewEventDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit">Créer</Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowCreateForm(false)}
                            >
                                Annuler
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {filteredEvents.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-white/70 text-lg">
                        {searchQuery ? 'Aucun événement ne correspond à votre recherche.' : 'Aucun événement pour le moment.'}
                    </p>
                    <p className="text-white/50 mt-2">
                        {searchQuery ? 'Essayez avec un autre mot-clé.' : 'Créez votre premier événement pour commencer !'}
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onDelete={handleDeleteEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
