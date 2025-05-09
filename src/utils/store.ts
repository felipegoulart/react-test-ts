export function saveToLocalStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    console.log({ value }, "value");
    return value ? JSON.parse(value) : null;
  }
  return null;
}

export function removeFromLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}
