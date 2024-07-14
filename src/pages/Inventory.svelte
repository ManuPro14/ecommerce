<script lang="ts">
  import { onMount } from "svelte";
  import { currentRoute } from "../stores/route";
  import { API_URL } from "../config";
  import type { Product } from "../types";
  import ProductManagement from "../components/admin/ProductManagement.svelte";

  let products: Product[] = [];
  let isLoading = true;
  let error: string | null = null;
  let searchTerm = "";
  let sortBy: "name" | "price" | "quantity" = "name";
  let sortOrder: "asc" | "desc" = "asc";

  onMount(async () => {
    await loadProducts();
  });

  async function loadProducts() {
    try {
      isLoading = true;
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      products = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
    } finally {
      isLoading = false;
    }
  }

  function goBack() {
    currentRoute.set("/admin");
  }

  function handleProductAdded(event: CustomEvent<Product>) {
    products = [...products, event.detail];
  }

  function handleProductUpdated(event: CustomEvent<Product>) {
    products = products.map((p) =>
      p._id === event.detail._id ? event.detail : p
    );
  }

  function handleProductDeleted(event: CustomEvent<string>) {
    products = products.filter((p) => p._id !== event.detail);
  }

  function handleError(event: CustomEvent<{ message: string }>) {
    error = event.detail.message;
    setTimeout(() => {
      error = null;
    }, 5000);
  }

  $: filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const factor = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") return factor * a.name.localeCompare(b.name);
      if (sortBy === "price") return factor * (a.price - b.price);
      return factor * (a.quantity - b.quantity);
    });

  function handleSort(column: typeof sortBy) {
    if (sortBy === column) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortBy = column;
      sortOrder = "asc";
    }
  }
</script>

<div class="min-h-screen bg-gray-200 py-20">
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold mb-8 text-gray-800 text-center">
      Gestión de Inventario
    </h1>

    {#if error}
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{error}</span>
      </div>
    {/if}

    <ProductManagement
      {products}
      on:productAdded={handleProductAdded}
      on:productUpdated={handleProductUpdated}
      on:productDeleted={handleProductDeleted}
      on:error={handleError}
    />

    <div
      class="bg-gray-200 shadow-lg rounded-lg p-6 mb-8 border-2 border-gray-800"
    >
      <div class="flex flex-col md:flex-row justify-between items-center mb-4">
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Buscar productos..."
          class="w-full md:w-64 px-4 text-gray-800 py-2 rounded-full bg-white border-2 border-gray-800 focus:outline-none focus:border-blue-500 mb-4 md:mb-0"
        />
        <button
          on:click={goBack}
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-lg"
        >
          Volver al Panel de Administrador
        </button>
      </div>

      {#if isLoading}
        <p class="text-center text-gray-800">Cargando productos...</p>
      {:else if filteredProducts.length === 0}
        <p class="text-center text-gray-800">No se encontraron productos.</p>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white rounded-5xl">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 border-2 border-gray-800 text-left text-xs leading-4 font-medium text-gray-800 uppercase tracking-wider cursor-pointer"
                  on:click={() => handleSort("name")}
                >
                  Nombre {sortBy === "name"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  class="px-6 py-3 border-2 border-gray-800 text-left text-xs leading-4 font-medium text-gray-800 uppercase tracking-wider cursor-pointer"
                  on:click={() => handleSort("price")}
                >
                  Precio {sortBy === "price"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  class="px-6 py-3 border-2 border-gray-800 text-left text-xs leading-4 font-medium text-gray-800 uppercase tracking-wider cursor-pointer"
                  on:click={() => handleSort("quantity")}
                >
                  Cantidad {sortBy === "quantity"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th
                  class="px-6 py-3 border-2 border-gray-800 text-left text-xs leading-4 font-medium text-gray-800 uppercase tracking-wider"
                >
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody class="border-2 border-gray-800">
              {#each filteredProducts as product (product._id)}
                <tr
                  class="hover:bg-gray-300 transition-colors duration-200 border-2 border-gray-800"
                >
                  <td
                    class="px-6 py-4 whitespace-no-wrap border-2 border-gray-800"
                  >
                    <div class="text-sm leading-5 font-medium text-gray-800">
                      {product.name}
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-no-wrap border-2 border-gray-800"
                  >
                    <div class="text-sm leading-5 text-gray-900">
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-no-wrap border-2 border-gray-800"
                  >
                    <div class="text-sm leading-5 text-gray-900">
                      {product.quantity}
                    </div>
                  </td>
                  <td class="px-6 py-4 border-2 border-gray-800">
                    <div class="text-sm leading-5 text-gray-800">
                      {product.description}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
