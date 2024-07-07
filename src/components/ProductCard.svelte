<script context="module" lang="ts">
  export interface Product {
    _id: string;
    name: string;
    price: number;
    category?: string;
    description?: string;
    image?: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let product: Product;

  const dispatch = createEventDispatcher();

  function handleAddToCart() {
    dispatch("addToCart", product);
  }
</script>

<div
  class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
>
  {#if product.image}
    <img
      src={product.image}
      alt={product.name}
      class="w-full h-48 object-cover"
    />
  {:else}
    <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-800">Sin imagen</span>
    </div>
  {/if}
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-2">{product.name}</h3>
    {#if product.category}
      <p class="text-sm text-gray-800 mb-2">{product.category}</p>
    {/if}
    <p class="text-xl font-bold text-blue-600 mb-2">
      ${product.price.toFixed(2)}
    </p>
    {#if product.description}
      <p class="text-sm text-gray-800 mb-4">{product.description}</p>
    {/if}
    <button
      class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      on:click={handleAddToCart}
    >
      Añadir al carrito
    </button>
  </div>
</div>
