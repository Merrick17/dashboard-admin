//@ts-nocheck
import { useEffect, useState } from "react";

const useLocalStorage = <T,>(key, initialValue: T): [T, (value: T) => void] => {
  // Store value - Initial value is function to load from local storage
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // isReady is set once the first render has been done on the browser, to avoid mismatched SSR. Can be used to avoid FOUC
  const [isReady, setIsReady] = useState(false);

  // Once the browser is hydrated, load from localStorage
  useEffect(() => {
    const item = window.localStorage.getItem(key);

    if (item !== undefined && item !== null) {
      setStoredValue(JSON.parse(item));
    } else {
      setStoredValue(initialValue);
      window.localStorage.setItem(key, JSON.stringify(initialValue));
    }

    setIsReady(true);
  }, []);

  // Set value
  const setValue = (value) => {
    // If value is undefined or null then clear it as undefined is not valid
    if (typeof value === "undefined" || value === null) {
      window.localStorage.removeItem(key);
      return;
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Sync storage across tabs
  useEffect(() => {
    const handleStorageChanged = async () => {
      let savedValue = localStorage.getItem(key);

      if (savedValue !== undefined) {
        setStoredValue(JSON.parse(savedValue));
      }
    };

    window.addEventListener("storage", handleStorageChanged);
    return () => window.removeEventListener("storage", handleStorageChanged);
  }, []);

  // Return value and setter, just like useState, along with whether the state is ready or not.
  return [storedValue, setValue];
};

export default useLocalStorage;
