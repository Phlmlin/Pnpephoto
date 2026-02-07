import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Event, Photo } from '../types';

// Fallback for crypto.randomUUID in non-secure contexts
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

interface PhotoGalleryDB extends DBSchema {
    events: {
        key: string;
        value: Event;
    };
    photos: {
        key: string;
        value: Photo;
        indexes: { 'by-event': string };
    };
    images: {
        key: string;
        value: Blob;
    };
}

const DB_NAME = 'pnpe-photo-gallery';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<PhotoGalleryDB> | null = null;

async function getDB(): Promise<IDBPDatabase<PhotoGalleryDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<PhotoGalleryDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Store for events
            if (!db.objectStoreNames.contains('events')) {
                db.createObjectStore('events', { keyPath: 'id' });
            }

            // Store for photo metadata
            if (!db.objectStoreNames.contains('photos')) {
                const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
                photoStore.createIndex('by-event', 'eventId');
            }

            // Store for actual image blobs
            if (!db.objectStoreNames.contains('images')) {
                db.createObjectStore('images');
            }
        },
    });

    return dbInstance;
}

// Event operations
export async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const db = await getDB();
    const newEvent: Event = {
        ...event,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await db.add('events', newEvent);
    return newEvent;
}

export async function getAllEvents(): Promise<Event[]> {
    const db = await getDB();
    return db.getAll('events');
}

export async function getEvent(id: string): Promise<Event | undefined> {
    const db = await getDB();
    return db.get('events', id);
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<void> {
    const db = await getDB();
    const event = await db.get('events', id);
    if (event) {
        await db.put('events', { ...event, ...updates, updatedAt: new Date().toISOString() });
    }
}

export async function deleteEvent(id: string): Promise<void> {
    const db = await getDB();

    // Delete all photos for this event
    const photos = await getPhotosByEvent(id);
    for (const photo of photos) {
        await deletePhoto(photo.id);
    }

    // Delete the event
    await db.delete('events', id);
}

// Photo operations
export async function uploadPhoto(eventId: string, file: File): Promise<Photo> {
    const db = await getDB();
    const photoId = generateId();

    // Store the image blob
    await db.put('images', file, photoId);

    // Create photo metadata
    const photo: Photo = {
        id: photoId,
        eventId,
        url: photoId, // We'll use the ID as the URL reference
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        size: file.size,
    };

    await db.add('photos', photo);
    return photo;
}

export async function getPhotosByEvent(eventId: string): Promise<Photo[]> {
    const db = await getDB();
    return db.getAllFromIndex('photos', 'by-event', eventId);
}

export async function getPhotoBlob(photoId: string): Promise<Blob | undefined> {
    const db = await getDB();
    return db.get('images', photoId);
}

export async function deletePhoto(photoId: string): Promise<void> {
    const db = await getDB();
    await db.delete('photos', photoId);
    await db.delete('images', photoId);
}

// Helper to get photo URL for display
export async function getPhotoURL(photoId: string): Promise<string> {
    const blob = await getPhotoBlob(photoId);
    if (!blob) return '';
    return URL.createObjectURL(blob);
}
