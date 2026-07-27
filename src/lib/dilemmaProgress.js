// IndexedDB persistence for dilemma completions.
// Stores completed dilemma IDs and the path taken, keyed by course + dilemma ID.
// Enables completion checkmarks and "you chose differently last time" indicators.

import React, { useState, useCallback, useEffect } from "react";

const DB_NAME = "tradeiq_dilemmas";
const DB_VERSION = 1;
const STORE_NAME = "completions";
const ALL_KEY = "all";

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

export async function getAllCompletions() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(ALL_KEY);
      req.onsuccess = () => resolve(req.result || {});
      req.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
}

export async function recordCompletion(courseId, dilemmaId, pathTaken) {
  try {
    const db = await openDB();
    const all = await getAllCompletions();
    const key = `${courseId}:${dilemmaId}`;
    all[key] = {
      completed: true,
      pathTaken,
      lastCompleted: Date.now(),
    };
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(all, ALL_KEY);
      tx.oncomplete = () => resolve(all[key]);
      tx.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function getPath(courseId, dilemmaId) {
  const all = await getAllCompletions();
  return all[`${courseId}:${dilemmaId}`]?.pathTaken || null;
}

export function useDilemmaCompletions() {
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getAllCompletions();
    setCompletions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isCompleted = useCallback(
    (courseId, dilemmaId) => !!completions[`${courseId}:${dilemmaId}`],
    [completions]
  );

  const getPath = useCallback(
    (courseId, dilemmaId) =>
      completions[`${courseId}:${dilemmaId}`]?.pathTaken || null,
    [completions]
  );

  return { completions, isCompleted, getPath, loading, refresh };
}