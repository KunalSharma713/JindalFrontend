import { useState, useEffect, useCallback } from 'react';

const useStorage = (key, initialValue, storageType = 'local') => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window[`${storageType}Storage`].getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${storageType}Storage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to storage
      window[`${storageType}Storage`].setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting ${storageType}Storage key "${key}":`, error);
    }
  }, [key, storedValue, storageType]);

  // Sync with storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === window[`${storageType}Storage`]) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, storageType]);

  // API call wrapper
  const fetchData = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }, []);

  // API call with storage
  const fetchAndStore = useCallback(async (url, options = {}, storageKey = key) => {
    try {
      const data = await fetchData(url, options);
      setValue(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch and store data:', error);
      throw error;
    }
  }, [fetchData, key, setValue]);

  // Clear storage
  const clearStorage = useCallback(() => {
    try {
      window[`${storageType}Storage`].removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error clearing ${storageType}Storage key "${key}":`, error);
    }
  }, [key, initialValue, storageType]);

  return {
    storedValue,
    setStoredValue: setValue,
    fetchData,
    fetchAndStore,
    clearStorage,
    isPersistent: storedValue !== null && storedValue !== undefined,
  };
};

export default useStorage;
