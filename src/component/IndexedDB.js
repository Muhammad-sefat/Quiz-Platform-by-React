// src/component/indexedDB.js

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("QuizDB", 1);

    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("History")) {
        db.createObjectStore("History", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to open IndexedDB");
  });
};

// Save quiz history
export const saveHistory = async (history) => {
  const db = await openDB();
  const tx = db.transaction("History", "readwrite");
  const store = tx.objectStore("History");
  store.add({ timestamp: new Date(), history });
};

// Get quiz history
export const getHistory = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("History", "readonly");
    const store = tx.objectStore("History");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to load history");
  });
};

// Clear quiz history
export const clearHistory = async () => {
  const db = await openDB();
  const tx = db.transaction("History", "readwrite");
  tx.objectStore("History").clear();
};
