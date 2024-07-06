// types.ts
export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  image: string;
}
export interface NewProduct {
  name: string;
  price: number | null;
  quantity: number | null;
  description: string;
}

export interface Sale {
  _id: string;
  productId: Product;
  quantity: number;
  totalPrice: number;
  date: string;
}