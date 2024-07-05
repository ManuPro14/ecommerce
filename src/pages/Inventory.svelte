<script lang="ts">
  import { onMount } from "svelte";
  import { currentRoute } from "../stores/route";

  interface Product {
    _id: string;
    name: string;
    price: number;
    cantidad: number;
    description: string;
  }

  let products: Product[] = [];
  const API_URL = "http://localhost:5000/api";

  onMount(async () => {
    await loadProducts();
  });

  async function loadProducts() {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      products = await response.json();
      console.log("Productos cargados en inventario:", products);
    } catch (error) {
      console.error("Error al cargar productos en inventario:", error);
    }
  }

  function goBack() {
    currentRoute.set("/admin");
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Inventario de Productos</h1>

  <div class="bg-white shadow rounded-lg p-6 mb-6 text-gray-900">
    <table class="min-w-full">
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Precio</th>
          <th class="text-left">Cantidad</th>
          <th class="text-left">Descripción</th>
        </tr>
      </thead>
      <tbody>
        {#each products as product (product._id)}
          <tr>
            <td class="py-2">{product.name}</td>
            <td class="py-2">${product.price.toFixed(2)}</td>
            <td class="py-2">{product.cantidad}</td>
            <td class="py-2">{product.description}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <button
    on:click={goBack}
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    Volver al Panel de Administrador
  </button>
</div>
