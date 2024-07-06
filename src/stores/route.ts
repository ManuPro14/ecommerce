
import { writable } from 'svelte/store';

export const currentRoute = writable('/');

export function updateRoute(newRoute: string) {
  currentRoute.set(newRoute);
}