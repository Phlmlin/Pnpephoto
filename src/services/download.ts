import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getPhotosByEvent, getPhotoBlob } from './database';

export async function downloadAllPhotosAsZip(eventId: string, eventName: string): Promise<void> {
    const zip = new JSZip();
    const photos = await getPhotosByEvent(eventId);

    if (photos.length === 0) {
        alert('Aucune photo à télécharger.');
        return;
    }

    const folderName = eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const folder = zip.folder(folderName);

    if (!folder) return;

    for (const photo of photos) {
        const blob = await getPhotoBlob(photo.id);
        if (blob) {
            folder.file(photo.filename, blob);
        }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${folderName}.zip`);
}
