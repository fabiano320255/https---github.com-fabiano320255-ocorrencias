import { openDB } from 'idb';

const DB_NAME = 'ocorrencias-db';
const STORE_NAME = 'ocorrencias';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
}

export async function addOccurrence(occurrence) {
    const db = await initDB();
    return db.put(STORE_NAME, occurrence);
}

export async function getAllOccurrences() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

export async function deleteOccurrence(id) {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
}
