<script lang="ts">
  import { cart, type CartItem } from "../stores/cartStore";

  let cartItems: CartItem[];

  cart.subscribe((items) => {
    cartItems = items;
  });

  function removeFromCart(id: string) {
    cart.removeItem(id);
  }

  function updateQuantity(id: string, newQuantity: number) {
    if (newQuantity > 0) {
      cart.updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  }

  $: total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function processOrder() {
    // Implementa la lógica de procesamiento de orden aquí
    console.log("Procesando orden:", cartItems);
    alert("Orden procesada (implementación pendiente)");
  }
</script>

<div
  class="container mx-auto px-4 py-40 bg-gray-300 min-h-screen flex justify-center flex-col items-center"
>
  <h1 class="text-5xl font-bold mb-6 py-8 text-purple-600">
    Carrito de Compras
  </h1>

  <div class="bg-gray-500 min-h-80 w-full max-w-[700px] rounded-md">
    {#if cartItems.length === 0}
      <p class="text-2xl py-4 font-semibold">Tu carrito está vacío</p>
    {:else}
      <div class=" shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {#each cartItems as item (item._id)}
          <div class="flex items-center justify-between border-b py-2">
            <span class="font-semibold">{item.name}</span>
            <div>
              <input
                type="number"
                min="1"
                bind:value={item.quantity}
                on:change={() => updateQuantity(item._id, item.quantity)}
                class="w-16 text-center border rounded"
              />
              <span class="mx-2"
                >${(item.price * item.quantity).toFixed(2)}</span
              >
              <button
                on:click={() => removeFromCart(item._id)}
                class="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        {/each}

        <div class="mt-4 text-right">
          <p class="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            on:click={() => cart.clearCart()}
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Vaciar Carrito
          </button>
          <button
            on:click={processOrder}
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Procesar Compra
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
