<script lang="ts">
  import { onMount } from "svelte";
  import { currentRoute } from "../stores/route";
  import Chart from "chart.js/auto";

  interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
  }

  interface NewProduct {
    name: string;
    price: number | null;
    quantity: number | null;
    description: string;
  }

  interface Sale {
    _id: string;
    productId: Product;
    quantity: number;
    totalPrice: number;
    date: string;
  }

  let isAuthenticated = false;
  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;
  let totalRevenue = 0;
  let products: Product[] = [];
  let sales: Sale[] = [];
  let newProduct: NewProduct = {
    name: "",
    price: null,
    quantity: null,
    description: "",
  };
  let editingProduct: Product | null = null;

  const API_URL = "http://localhost:5000/api";

  onMount(async () => {
    isAuthenticated = localStorage.getItem("adminToken") !== null;
    if (!isAuthenticated) {
      currentRoute.set("/login");
    } else {
      await Promise.all([loadProducts(), loadSales()]);
      calculateTotalRevenue();
      createChart();
    }
  });

  async function loadProducts() {
    try {
      console.log("Intentando cargar productos...");
      const response = await fetch(`${API_URL}/products`);
      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      products = await response.json();
      console.log("Productos cargados en inventario:", products);
    } catch (error) {
      console.error("Error al cargar productos en inventario:", error);
    }
  }

  async function loadSales() {
    const response = await fetch(`${API_URL}/sales`);
    sales = await response.json();
  }

  async function addProduct() {
    try {
      console.log("Intentando añadir producto:", newProduct);

      const productToAdd = {
        name: newProduct.name,
        price: newProduct.price ?? 0,
        quantity: newProduct.quantity ?? 0,
        description: newProduct.description,
      };

      console.log("Producto a enviar:", productToAdd);

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToAdd),
      });

      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedProduct = await response.json();
      console.log("Producto añadido:", addedProduct);

      products = [...products, addedProduct];
      newProduct = { name: "", price: null, quantity: null, description: "" };

      console.log("Lista de productos actualizada:", products);

      await loadProducts();
      await loadSales();
      calculateTotalRevenue();
      createChart();
    } catch (error) {
      console.error("Error al añadir producto:", error);
    }
  }

  async function updateProduct() {
    if (editingProduct) {
      const productToUpdate = {
        ...editingProduct,
        price: editingProduct.price ?? 0,
        quantity: editingProduct.quantity ?? 0,
      };
      const response = await fetch(
        `${API_URL}/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productToUpdate),
        }
      );
      const updatedProduct = await response.json();
      products = products.map((p) =>
        p._id === updatedProduct._id ? updatedProduct : p
      );
      editingProduct = null;
    }
  }

  async function deleteProduct(id: string) {
    await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    products = products.filter((p) => p._id !== id);
  }

  function startEditing(product: Product) {
    editingProduct = { ...product };
  }

  function calculateTotalRevenue() {
    totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  }

  function createChart() {
    if (canvas && sales.length > 0) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: sales.map((s) => s.productId.name),
            datasets: [
              {
                label: "Ventas por producto",
                data: sales.map((s) => s.totalPrice),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    currentRoute.set("/login");
  }

  function handleNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    newProduct.name = target.value;
  }

  function handlePriceChange(event: Event) {
    const target = event.target as HTMLInputElement;
    newProduct.price = target.value === "" ? null : parseFloat(target.value);
  }

  function handleQuantityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    newProduct.quantity =
      target.value === "" ? null : parseInt(target.value, 10);
  }

  function handleDescriptionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    newProduct.description = target.value;
  }
</script>

{#if isAuthenticated}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Panel de Administrador</h1>

    <div
      class="bg-white shadow rounded-lg p-6 mb-6 text-gray-800 mx-auto flex flex-col justify-center max-w-screen-lg items-center"
    >
      <h2 class="text-xl font-semibold mb-4">Gestión de Productos</h2>

      <form
        on:submit|preventDefault={editingProduct ? updateProduct : addProduct}
        class="mb-4 flex flex-col w-full max-w-screen-lg mx-auto"
      >
        <input
          type="text"
          value={editingProduct ? editingProduct.name : newProduct.name}
          on:input={handleNameChange}
          placeholder="Nombre del producto"
          required
          class="mb-2 p-2 bg-white border rounded text-gray-800 border-gray-800"
        />
        <input
          value={editingProduct ? editingProduct.price : newProduct.price}
          on:input={handlePriceChange}
          placeholder="Precio"
          required
          class="mb-2 p-2 border rounded text-gray-800 bg-white border-gray-800"
        />
        <input
          value={editingProduct ? editingProduct.quantity : newProduct.quantity}
          on:input={handleQuantityChange}
          placeholder="Cantidad"
          required
          class="mb-2 p-2 border rounded text-gray-800 bg-white border-gray-800"
        />
        <input
          type="text"
          value={editingProduct
            ? editingProduct.description
            : newProduct.description}
          on:input={handleDescriptionChange}
          placeholder="Descripción"
          class="mb-2 p-2 border rounded text-gray-800 bg-white border-gray-800"
        />
        <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">
          {editingProduct ? "Actualizar Producto" : "Añadir Producto"}
        </button>
      </form>

      <ul>
        {#each products as product (product._id)}
          <li class="mb-2 p-2 border rounded flex justify-between items-center">
            <span>{product.name} - ${product.price}</span>
            <div>
              <button
                on:click={() => startEditing(product)}
                class="ml-2 bg-yellow-500 text-gray-800 p-1 rounded"
                >Editar</button
              >
              <button
                on:click={() => deleteProduct(product._id)}
                class="ml-2 bg-red-500 text-gray-800 p-1 rounded"
                >Eliminar</button
              >
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Resumen de Ventas</h2>
      <p class="text-lg mb-4 text-gray-800">
        Ingresos totales: <span class="font-bold"
          >${totalRevenue.toLocaleString()}</span
        >
      </p>
      <div style="height: 300px;">
        <canvas bind:this={canvas}></canvas>
      </div>
    </div>

    <button
      on:click={() => currentRoute.set("/inventory")}
      class="bg-green-500 hover:bg-green-700 text-gray-800 font-bold py-2 px-4 rounded mb-4 w-full"
    >
      Revisar Inventario
    </button>

    <button
      on:click={handleLogout}
      class="bg-red-500 hover:bg-red-700 text-gray-800 font-bold py-2 px-4 rounded w-full"
    >
      Cerrar Sesión
    </button>
  </div>
{:else}
  <p>Acceso no autorizado. Redirigiendo...</p>
{/if}
