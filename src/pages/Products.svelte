<script lang="ts">
  import { onMount } from "svelte";
  import ProductCard from "../components/ProductCard.svelte";
  import type { Product } from "../components/ProductCard.svelte";
  import { API_URL } from "../config";

  let products: Product[] = [];
  let categories: string[] = ["Todos"];
  let selectedCategory: string = "Todos";
  let searchTerm: string = "";

  let newProduct: Product = {
    _id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  };

  onMount(async () => {
    await loadProducts();
  });

  async function loadProducts() {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        products = await response.json();
      }
      const data = await response.json();
      products = data as Product[];
      updateCategories();
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  function updateCategories() {
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    categories = ["Todos", "Electrónica", "Ropa", "Aseo"];
  }

  $: filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "Todos" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function addToCart(event: CustomEvent<Product>) {
    const product = event.detail;
    console.log("Añadiendo al carrito:", product);
    // Aquí implementarías la lógica para añadir el producto al carrito
  }

  async function addProduct() {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const addedProduct = await response.json();
      products = [...products, addedProduct];

      // Reset form
      newProduct = { _id: "", name: "", price: 0, description: "", image: "" };
    } catch (error) {
      console.error("Error al añadir producto:", error);
    }
  }
</script>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 py-40 min-h-screen">
  <div class="container mx-auto px-4">
    <h1 class="text-5xl font-bold mb-4 text-white text-center">
      Nuestros Productos
    </h1>
    <p class="text-xl text-white text-center mb-8">
      Descubre nuestra amplia gama de productos de alta calidad
    </p>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/2 px-2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            bind:value={searchTerm}
            class="w-full px-4 py-2 rounded-lg border bg-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="w-full md:w-1/2 px-2">
          <select
            bind:value={selectedCategory}
            class="w-full px-4 py-2 rounded-lg border bg-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {#each categories as category}
              <option>{category}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto px-4 py-12">
  {#if filteredProducts.length === 0}
    <p class="text-center text-2xl text-gray-600">
      No se encontraron productos.
    </p>
  {:else}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {#each filteredProducts as product (product._id)}
        <ProductCard {product} on:addToCart={addToCart} />
      {/each}
    </div>
  {/if}
</div>
