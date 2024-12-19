import { openDB } from "idb";

const DB_NAME = "video-db";
const STORE_NAME = "videos";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME); // Create object store
      }
    },
  });
};

// Save video blob to IndexedDB
export const saveVideo = async (id: string, blob: Blob): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, blob, id);
};

// Get video blob from IndexedDB
export const getVideo = async (id: string): Promise<Blob | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

// Check if a video exists in IndexedDB
export const videoExists = async (id: string): Promise<boolean> => {
  const db = await initDB();
  const video = await db.get(STORE_NAME, id);
  return !!video;
};
