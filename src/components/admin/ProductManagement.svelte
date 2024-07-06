<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Product, NewProduct } from "../../types";
  import { API_URL } from "../../config";

  let products: Product[] = [];
  let newProduct: NewProduct = {
    name: "",
    price: null,
    quantity: null,
    description: "",
  };
  let editingProduct: Product | null = null;

  const dispatch = createEventDispatcher();

  async function loadProducts() {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      products = await response.json();
    } catch (error) {
      console.error("Error al cargar productos:", error);
      dispatch("error", { message: "Error al cargar productos" });
    }
  }

  async function addProduct() {
    try {
      const productToAdd = {
        name: newProduct.name,
        price: newProduct.price ?? 0,
        quantity: newProduct.quantity ?? 0,
        description: newProduct.description,
      };

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToAdd),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const addedProduct = await response.json();
      products = [...products, addedProduct];
      newProduct = { name: "", price: null, quantity: null, description: "" };
      dispatch("success", { message: "Producto añadido con éxito" });
    } catch (error) {
      console.error("Error al añadir producto:", error);
      dispatch("error", { message: "Error al añadir producto" });
    }
  }

  async function updateProduct() {
    if (editingProduct) {
      try {
        const response = await fetch(
          `${API_URL}/products/${editingProduct._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingProduct),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const updatedProduct = await response.json();
        products = products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        );
        editingProduct = null;
        dispatch("success", { message: "Producto actualizado con éxito" });
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        dispatch("error", { message: "Error al actualizar producto" });
      }
    }
  }

  async function deleteProduct(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          method: "DELETE",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        products = products.filter((p) => p._id !== id);
        dispatch("success", { message: "Producto eliminado con éxito" });
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        dispatch("error", { message: "Error al eliminar producto" });
      }
    }
  }

  function startEditing(product: Product) {
    editingProduct = { ...product };
  }

  $: {
    if (editingProduct) {
      newProduct = { ...editingProduct };
    }
  }
</script>

<div class="bg-gray-400 shadow-lg rounded-lg p-6">
  <h2 class="text-2xl font-semibold mb-4 text-gray-800">
    Gestión de Productos
  </h2>

  <form
    on:submit|preventDefault={editingProduct ? updateProduct : addProduct}
    class="mb-6"
  >
    <input
      type="text"
      bind:value={newProduct.name}
      placeholder="Nombre del producto"
      required
      class="w-full mb-2 p-2 border border-gray-300 rounded bg-gray-100 text-black text-center"
    />
    <input
      type="number"
      bind:value={newProduct.price}
      placeholder="Precio"
      required
      class="w-full mb-2 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 text-center"
    />
    <input
      type="number"
      bind:value={newProduct.quantity}
      placeholder="Cantidad "
      required
      class="w-full mb-2 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 text-center"
    />
    <textarea
      bind:value={newProduct.description}
      placeholder="Descripción"
      class="w-full mb-2 p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 text-center"
    ></textarea>
    <button
      type="submit"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      {editingProduct ? "Actualizar Producto" : "Añadir Producto"}
    </button>
  </form>

  <ul class="space-y-2">
    {#each products as product (product._id)}
      <li class="flex justify-between items-center bg-gray-100 p-2 rounded">
        <span>{product.name} - ${product.price}</span>
        <div>
          <button
            on:click={() => startEditing(product)}
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded mr-2 transition duration-300"
          >
            Editar
          </button>
          <button
            on:click={() => deleteProduct(product._id)}
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300"
          >
            Eliminar
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>
