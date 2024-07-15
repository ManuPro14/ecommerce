import { writable } from 'svelte/store';
import type { Product } from '../types';
const API_URL = import.meta.env.VITE_API_URL;

function createProductStore() {
  const { subscribe, set, update } = writable<Product[]>([]);

  return {
    subscribe,
    loadProducts: async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const products = await response.json();
        set(products);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    },
    addProduct: async (newProduct: Omit<Product, '_id'>) => {
      try {
        const response = await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const addedProduct = await response.json();
        update(products => [...products, addedProduct]);
      } catch (error) {
        console.error("Error al añadir producto:", error);
        throw error;
      }
    },
    updateProduct: async (updatedProduct: Product) => {
      try {
        const response = await fetch(`${API_URL}/api/products/${updatedProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const product = await response.json();
        update(products => products.map(p => p._id === product._id ? product : p));
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
      }
    },
    deleteProduct: async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        update(products => products.filter(p => p._id !== id));
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        throw error;
      }
    }
  };
}

export const productStore = createProductStore();