import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleStorageService {
  

  setItem<T>(key: string, value: T): void {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;  
    return JSON.parse(item);
  }

  removeItem(key: string): void {
  localStorage.removeItem(key);
  }

  hasKey(key: string): boolean {
  return localStorage.getItem(key) !== null;
  }
}
