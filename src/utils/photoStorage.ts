import { ActivityPhotoEvidence } from '../types';

const DB_NAME = 'bm_kssr_photos_db';
const DB_VERSION = 1;
const STORE_NAME = 'photo_evidence';
const LS_BACKUP_KEY = 'bm_kssr_evidens_gambar_aktiviti_v3';

// Open or create IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Load all stored photos from IndexedDB with LocalStorage fallback
 */
export async function loadAllPhotos(
  defaultPhotos: ActivityPhotoEvidence[] = []
): Promise<ActivityPhotoEvidence[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as ActivityPhotoEvidence[];
        if (results && results.length > 0) {
          // Sort newest first
          const sorted = [...results].sort((a, b) => {
            const timeA = a.id.startsWith('photo-') ? Number(a.id.replace('photo-', '')) : 0;
            const timeB = b.id.startsWith('photo-') ? Number(b.id.replace('photo-', '')) : 0;
            return timeB - timeA;
          });
          resolve(sorted);
        } else {
          // If IndexedDB empty, check localStorage backup
          const lsData = loadFromLocalStorage();
          if (lsData && lsData.length > 0) {
            // Seed IndexedDB from localStorage
            saveAllPhotosToDB(lsData).catch(() => {});
            resolve(lsData);
          } else {
            // Seed IndexedDB with initial sample photos
            if (defaultPhotos.length > 0) {
              saveAllPhotosToDB(defaultPhotos).catch(() => {});
            }
            resolve(defaultPhotos);
          }
        }
      };

      request.onerror = () => {
        const fallback = loadFromLocalStorage() || defaultPhotos;
        resolve(fallback);
      };
    });
  } catch (err) {
    console.warn('IndexedDB unavailable, falling back to localStorage:', err);
    return loadFromLocalStorage() || defaultPhotos;
  }
}

/**
 * Save or update a single photo
 */
export async function saveSinglePhoto(photo: ActivityPhotoEvidence): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(photo);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not save photo to IndexedDB:', err);
  }

  // Also attempt localStorage backup (gracefully catch quota errors)
  try {
    const current = loadFromLocalStorage() || [];
    const index = current.findIndex((p) => p.id === photo.id);
    if (index >= 0) {
      current[index] = photo;
    } else {
      current.unshift(photo);
    }
    // Keep max 10 photos in localStorage backup to avoid QuotaExceeded
    const trimmed = current.slice(0, 10);
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(trimmed));
  } catch {
    // Quota exceeded in localStorage, IndexedDB still holds the data
  }
}

/**
 * Save all photos to IndexedDB
 */
export async function saveAllPhotosToDB(photos: ActivityPhotoEvidence[]): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      photos.forEach((photo) => {
        store.put(photo);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to bulk save photos to IndexedDB:', err);
  }

  // Backup to localStorage
  try {
    const trimmed = photos.slice(0, 8);
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

/**
 * Delete a photo by ID from IndexedDB and LocalStorage
 */
export async function deletePhotoFromDB(photoId: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(photoId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not delete photo from IndexedDB:', err);
  }

  try {
    const current = loadFromLocalStorage() || [];
    const updated = current.filter((p) => p.id !== photoId);
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function loadFromLocalStorage(): ActivityPhotoEvidence[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(LS_BACKUP_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}
