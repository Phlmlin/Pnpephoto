export interface Event {
    id: string;
    name: string;
    date: string;
    description?: string;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Photo {
    id: string;
    eventId: string;
    url: string;
    thumbnail?: string;
    filename: string;
    uploadedAt: string;
    size: number;
}

export interface User {
    id: string;
    username: string;
    role: 'admin' | 'viewer';
}
