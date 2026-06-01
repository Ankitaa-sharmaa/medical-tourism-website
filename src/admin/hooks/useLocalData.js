import { useState, useEffect } from 'react';

/**
 * Generic localStorage-backed CRUD hook.
 *
 * @param {string}  storageKey   – localStorage key (e.g. 'admin_doctors')
 * @param {Array}   seedData     – shown on first visit when key is absent
 *
 * Returns { items, add, update, remove }
 * Every mutation is auto-persisted to localStorage.
 */
const useLocalData = (storageKey, seedData = []) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {
      console.warn(`[useLocalData] Could not parse "${storageKey}":`, e);
    }
    // First visit — seed with mock data and persist immediately
    localStorage.setItem(storageKey, JSON.stringify(seedData));
    return seedData;
  });

  // Sync every state change back to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  /** Add a new item. Returns the created item. */
  const add = (data) => {
    const item = {
      ...data,
      id: `${storageKey}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [item, ...prev]);
    return item;
  };

  /** Update an existing item by id. */
  const update = (id, data) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...data, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  /** Remove an item by id. */
  const remove = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return { items, add, update, remove };
};

export default useLocalData;
