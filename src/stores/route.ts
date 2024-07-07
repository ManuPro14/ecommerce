
import { writable } from 'svelte/store';

function createRouteStore() {
  const { subscribe, set, update } = writable(window.location.pathname);

  return {
    subscribe,
    set,
    update: (newPath: string) => {
      window.history.pushState({}, '', newPath);
      set(newPath);
    }
  };
}

export const currentRoute = createRouteStore();

window.addEventListener('popstate', () => {
  currentRoute.update(window.location.pathname);
});

export const updateRoute = (newPath: string) => currentRoute.update(newPath);