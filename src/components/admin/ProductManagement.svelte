<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Product } from "../../types";
  import { API_URL } from "../../config";
  import { fade } from "svelte/transition";

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

  let imagePreviewUrl = "";
  let showImagePreview = false;
  let imageLoading = false;
  let imageError = false;

  $: {
    if (editingProduct) {
      imagePreviewUrl = editingProduct.image;
    } else {
      imagePreviewUrl = newProduct.image;
    }
    showImagePreview = isValidImageUrl(imagePreviewUrl);
    if (showImagePreview) {
      imageLoading = true;
      imageError = false;
    }
  }

  function isValidImageUrl(url: string): boolean {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
  }

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
    const newImageUrl = target.value;
    if (editingProduct) {
      editingProduct.image = newImageUrl;
    } else {
      newProduct.image = newImageUrl;
    }
    imagePreviewUrl = newImageUrl;
    showImagePreview = isValidImageUrl(newImageUrl);
    if (showImagePreview) {
      imageLoading = true;
      imageError = false;
    } else {
      imageLoading = false;
      imageError = false;
    }
  }

  function handleImageLoad() {
    imageLoading = false;
    imageError = false;
  }

  function handleImageError() {
    imageLoading = false;
    imageError = true;
  }

  let imgElement: HTMLImageElement;

  onMount(() => {
    if (imgElement) {
      if (imgElement.complete) {
        handleImageLoad();
      }
    }
  });
</script>

<section class="flex justify-center items-center">
  <div
    class="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-screen-sm border-2 border-gray-800"
  >
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
        class="w-full p-2 rounded bg-gray-200 text-gray-800 placeholder:text-gray-700 border-2 border-gray-800"
      />
      <input
        type="number"
        value={editingProduct ? editingProduct.price : newProduct.price}
        on:input={handlePriceChange}
        placeholder="Precio"
        required
        class="w-full p-2 rounded bg-gray-200 text-gray-800 placeholder:text-gray-700 border-2 border-gray-800"
      />
      <input
        type="number"
        value={editingProduct ? editingProduct.quantity : newProduct.quantity}
        on:input={handleQuantityChange}
        placeholder="Cantidad"
        required
        class="w-full p-2 rounded bg-gray-200 text-gray-800 placeholder:text-gray-700 border-2 border-gray-800"
      />
      <textarea
        value={editingProduct
          ? editingProduct.description
          : newProduct.description}
        on:input={handleDescriptionChange}
        placeholder="Descripción"
        class="w-full p-2 rounded bg-gray-200 text-gray-800 placeholder:text-gray-700 border-2 border-gray-800"
      ></textarea>
      <input
        type="text"
        value={editingProduct ? editingProduct.category : newProduct.category}
        on:input={handleCategoryChange}
        placeholder="Categoría"
        class="w-full p-2 rounded bg-gray-200 text-gray-800 placeholder:text-gray-700 border-2 border-gray-800"
      />
      <div class="space-y-2">
        <input
          type="text"
          value={editingProduct ? editingProduct.image : newProduct.image}
          on:input={handleImageChange}
          placeholder="URL de la imagen"
          class="w-full p-2 rounded bg-gray-200 text-gray-800 placeholder:text-gray-700 border-2 border-gray-800"
        />
        {#if showImagePreview}
          {#if imageLoading}
            <div
              class="w-full h-64 flex items-center justify-center bg-gray-200"
            >
              <p>Cargando imagen...</p>
            </div>
          {/if}
          {#if imageError}
            <div
              class="w-full h-64 flex items-center justify-center bg-gray-200"
            >
              <p>Error al cargar la imagen</p>
            </div>
          {/if}
          <img
            bind:this={imgElement}
            transition:fade
            src={imagePreviewUrl}
            alt="Preview"
            class="w-full h-64 object-cover rounded"
            on:load={handleImageLoad}
            on:error={handleImageError}
            style="display: {imageLoading || imageError ? 'none' : 'block'};"
          />
        {/if}
      </div>
      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded">
        {editingProduct ? "Actualizar Producto" : "Añadir Producto"}
      </button>
    </form>
  </div>
</section>

<section class="flex justify-center items-center">
  <div
    class="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-screen-sm border-2 border-gray-800"
  >
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">
      Lista de Productos
    </h2>
    <table class="min-w-full">
      <thead>
        <tr class="border-2 border-gray-800">
          <th class="text-center border-4 text-gray-800">Nombre</th>
          <th class="text-center border-4 text-gray-800">Precio</th>
          <th class="text-center border-4 text-gray-800">Cantidad</th>
          <th class="text-center border-4 text-gray-800">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each products as product (product._id)}
          <tr class="text-gray-800 border-2">
            <td class="border-4">{product.name}</td>
            <td class="border-4">${product.price.toFixed(2)}</td>
            <td class="border-4">{product.quantity}</td>
            <td>
              <button
                on:click={() => startEditing(product)}
                class="bg-blue-500 text-white p-1 rounded-full"
              >
                <svg
                  class="w-3 h-3 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                  />
                </svg>
              </button>
              <button
                on:click={() => deleteProduct(product._id)}
                class="bg-red-500 text-white p-1 rounded-full"
              >
                <svg
                  class="w-3 h-3 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
