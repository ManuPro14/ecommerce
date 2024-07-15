<script lang="ts">
  import { onMount } from "svelte";
  import { cart } from "../stores/cartStore";
  import type { CartItem } from "../stores/cartStore";
  const API_URL = process.env.API_URL;
  interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  }

  let products: Product[] = [];

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      products = await response.json();
      console.log(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  onMount(() => {
    fetchProducts();
  });

  function addToCart(product: Product) {
    const cartItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    cart.addToCart(cartItem);
    console.log("Added to cart:", cartItem);
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
</script>

<div class="bg-gray-200 py-20 min-h-screen">
  <div class="container mx-auto px-4">
    <h1 class="text-5xl font-bold mb-4 text-gray-800 text-center py-4">
      Nuestros Productos
    </h1>
    <p class="text-xl text-gray-800 text-center mb-8 py-2">
      Descubre nuestra amplia gama de productos de alta calidad
    </p>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
    >
      {#each products as product (product._id)}
        <div
          class="bg-white border-4 border-gray-800 rounded-xl shadow-md overflow-hidden w-[300px] h-[550px] flex flex-col"
        >
          <div class="h-1/2">
            <img
              src={product.image}
              alt={product.name}
              class="w-full h-full object-cover text-gray-800 object-center"
            />
          </div>
          <div class="p-4 flex flex-col flex-grow">
            <h3
              class="text-lg font-semibold mb-2 h-14 overflow-hidden text-gray-800"
            >
              {product.name}
            </h3>
            <p class="text-gray-800 mb-2 font-bold">
              {formatPrice(product.price)}
            </p>
            <p class="text-sm text-gray-800 mb-4 flex-grow overflow-y-auto">
              {product.description}
            </p>
            <button
              on:click={() => addToCart(product)}
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full mt-auto"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
