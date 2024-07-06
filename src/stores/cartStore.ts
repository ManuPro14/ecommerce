import { writable } from 'svelte/store';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function createCartStore() {
  const { subscribe, set, update } = writable<CartItem[]>([]);

  return {
    subscribe,
    addToCart: (product: CartItem) => update(items => {
      const existingItem = items.find(item => item._id === product._id);
      if (existingItem) {
        return items.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    }),
    removeFromCart: (id: string) => update(items => items.filter(item => item._id !== id)),
    updateQuantity: (id: string, quantity: number) => update(items =>
      items.map(item => item._id === id ? { ...item, quantity } : item)
    ),
    clearCart: () => set([]),
  };
}

export const cart = createCartStore();