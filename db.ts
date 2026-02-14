
const DB_NAME = 'FiddleSourceDB';
const DB_VERSION = 1;
const STORE_MEDIA = 'audio_blobs';
const STORE_METADATA = 'tune_metadata';

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA);
      }
      if (!db.objectStoreNames.contains(STORE_METADATA)) {
        db.createObjectStore(STORE_METADATA, { keyPath: 'id' });
      }
    };
  });
};

export const saveToDatabase = async (id: string, blob: Blob, metadata: any) => {
  const db = await initDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([STORE_MEDIA, STORE_METADATA], 'readwrite');
    transaction.objectStore(STORE_MEDIA).put(blob, id);
    transaction.objectStore(STORE_METADATA).put({ ...metadata, id });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getFromDatabase = async (id: string): Promise<Blob | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_MEDIA], 'readonly');
    const request = transaction.objectStore(STORE_MEDIA).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const getAllSavedIds = async (): Promise<string[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_METADATA], 'readonly');
    const request = transaction.objectStore(STORE_METADATA).getAllKeys();
    request.onsuccess = () => resolve(request.result as string[]);
    request.onerror = () => reject(request.error);
  });
};

export const removeFromDatabase = async (id: string) => {
  const db = await initDB();
  const transaction = db.transaction([STORE_MEDIA, STORE_METADATA], 'readwrite');
  transaction.objectStore(STORE_MEDIA).delete(id);
  transaction.objectStore(STORE_METADATA).delete(id);
};
