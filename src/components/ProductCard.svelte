<script lang="ts">
  import { cart } from "../stores/cartStore";

  export let _id: string;
  export let name: string;
  export let price: number;
  export let image: string;

  function addToCart() {
    cart.addItem({ _id, name, price, quantity: 1 });
  }
</script>

<div class="bg-white rounded-lg shadow-md overflow-hidden my-auto p-4">
  <img src={image} alt={name} class="w-full h-48 object-cover" />
  <div class="p-4">
    <h3 class="text-lg font-semibold">{name}</h3>
    <p class="text-gray-600">${price.toFixed(2)}</p>
    <button
      class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      on:click={addToCart}
    >
      Añadir al carrito
    </button>
  </div>
</div>
