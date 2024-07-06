<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Product } from "../../types";
  import { API_URL } from "../../config";

  export let products: Product[];

  interface NewProduct {
    name: string;
    price: number | null;
    quantity: number | null;
    description: string;
    category: string;
    image: string;
  }

  let newProduct: NewProduct = {
    name: "",
    price: null,
    quantity: null,
    description: "",
    category: "",
    image: "",
  };
  let editingProduct: Product | null = null;

  const dispatch = createEventDispatcher();

  async function addProduct() {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const addedProduct = await response.json();
      dispatch("productAdded", addedProduct);
      newProduct = {
        name: "",
        price: null,
        quantity: null,
        description: "",
        category: "",
        image: "",
      };
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
        dispatch("productUpdated", updatedProduct);
        editingProduct = null;
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
        dispatch("productDeleted", id);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        dispatch("error", { message: "Error al eliminar producto" });
      }
    }
  }

  function startEditing(product: Product) {
    editingProduct = { ...product };
  }

  function handleNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (editingProduct) {
      editingProduct.name = target.value;
    } else {
      newProduct.name = target.value;
    }
  }

  function handlePriceChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    if (editingProduct) {
      editingProduct.price = value;
    } else {
      newProduct.price = value;
    }
  }

  function handleQuantityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (editingProduct) {
      editingProduct.quantity = value;
    } else {
      newProduct.quantity = value;
    }
  }

  function handleDescriptionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (editingProduct) {
      editingProduct.description = target.value;
    } else {
      newProduct.description = target.value;
    }
  }

  function handleCategoryChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (editingProduct) {
      editingProduct.category = target.value;
    } else {
      newProduct.category = target.value;
    }
  }

  function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (editingProduct) {
      editingProduct.image = target.value;
    } else {
      newProduct.image = target.value;
    }
  }
</script>

<section class=" flex justify-center items-center">
  <div class="bg-gray-200 shadow-lg rounded-lg p-6 mb-8 max-w-screen-sm">
    <h2 class="text-2xl font-semibold mb-4 text-gray-700">
      Añadir/Editar Producto
    </h2>
    <form
      on:submit|preventDefault={editingProduct ? updateProduct : addProduct}
      class="space-y-4"
    >
      <input
        type="text"
        value={editingProduct ? editingProduct.name : newProduct.name}
        on:input={handleNameChange}
        placeholder="Nombre del producto"
        required
        class="w-full p-2 rounded bg-gray-400 text-gray-700 placeholder:text-gray-700"
      />
      <input
        type="number"
        value={editingProduct ? editingProduct.price : newProduct.price}
        on:input={handlePriceChange}
        placeholder="Precio"
        required
        class="w-full p-2 rounded bg-gray-400 text-gray-700 placeholder:text-gray-700"
      />
      <input
        type="number"
        value={editingProduct ? editingProduct.quantity : newProduct.quantity}
        on:input={handleQuantityChange}
        placeholder="Cantidad"
        required
        class="w-full p-2 rounded bg-gray-400 text-gray-700 placeholder:text-gray-700"
      />
      <textarea
        value={editingProduct
          ? editingProduct.description
          : newProduct.description}
        on:input={handleDescriptionChange}
        placeholder="Descripción"
        class="w-full p-2 rounded bg-gray-400 text-gray-700 placeholder:text-gray-700"
      ></textarea>
      <input
        type="text"
        value={editingProduct ? editingProduct.category : newProduct.category}
        on:input={handleCategoryChange}
        placeholder="Categoría"
        class="w-full p-2 rounded bg-gray-400 text-gray-700 placeholder:text-gray-700"
      />
      <input
        type="text"
        value={editingProduct ? editingProduct.image : newProduct.image}
        on:input={handleImageChange}
        placeholder="URL de la imagen"
        class="w-full p-2 rounded bg-gray-400 text-gray-700 placeholder:text-gray-700"
      />
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">
        {editingProduct ? "Actualizar Producto" : "Añadir Producto"}
      </button>
    </form>
  </div>
</section>

<section class="flex justify-center items-center">
  <div class="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-screen-sm">
    <h2 class="text-2xl font-semibold mb-4 text-gray-700">
      Lista de Productos
    </h2>
    <table class="min-w-full">
      <thead>
        <tr class="border-2">
          <th class="text-center border-4 text-gray-700">Nombre</th>
          <th class="text-center border-4 text-gray-700">Precio</th>
          <th class="text-center border-4 text-gray-700">Cantidad</th>
          <th class="text-center border-4 text-gray-700">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each products as product (product._id)}
          <tr class="text-gray-700 border-2">
            <td class="border-4">{product.name}</td>
            <td class="border-4">${product.price.toFixed(2)}</td>
            <td class="border-4">{product.quantity}</td>
            <td>
              <button
                on:click={() => startEditing(product)}
                class="text-gray-300 hover:text-blue-900">Editar</button
              >
              <button
                on:click={() => deleteProduct(product._id)}
                class="ml-2 text-gray-300 bg-red-500 hover:text-red-900"
                >Eliminar</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
