import { writable } from 'svelte/store';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

function createCart() {
  const { subscribe, set, update } = writable<CartItem[]>([]);

  return {
    subscribe,
    addItem: (item: CartItem) => update(items => {
      const existingItem = items.find(i => i._id === item._id);
      if (existingItem) {
        return items.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { ...item, quantity: 1 }];
    }),
    removeItem: (id: string) => update(items => items.filter(i => i._id !== id)),
    updateQuantity: (id: string, quantity: number) => update(items =>
      items.map(i => i._id === id ? { ...i, quantity } : i)
    ),
    clearCart: () => set([])
  };
}

export const cart = createCart();