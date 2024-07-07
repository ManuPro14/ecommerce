<script lang="ts">
  import { cart, type CartItem } from "../stores/cartStore";

  let cartItems: CartItem[] = [];

  cart.subscribe((items) => {
    cartItems = items;
  });

  function removeFromCart(_id: string) {
    cart.removeFromCart(_id);
  }

  function updateQuantity(_id: string, newQuantity: number) {
    if (newQuantity > 0) {
      cart.updateQuantity(_id, newQuantity);
    } else {
      removeFromCart(_id);
    }
  }

  function clearCart() {
    cart.clearCart();
  }

  $: total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
</script>

<div class="bg-gray-200 min-h-screen py-40">
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold mb-8 text-gray-800 text-center">
      Tu Carrito de Compras
    </h1>

    <div class="flex items-center justify-center">
      {#if cartItems.length === 0}
        <p class="text-gray-800 text-center text-xl">Tu carrito está vacío.</p>
      {:else}
        <div
          class="bg-gray-100 rounded-lg shadow-md p-6 max-w-screen-lg flex flex-col border-2 border-gray-800"
        >
          {#each cartItems as item (item._id)}
            <div class="flex items-center justify-between border-b-4 py-4">
              <div class="flex items-center justify-center text-gray-800 px-4">
                <img
                  src={item.image}
                  alt={item.name}
                  class="w-16 h-16 object-cover rounded mr-4 text-gray-800"
                />
                <div class="flex flex-col justify-center items-center">
                  <h3 class="text-lg font-semibold text-center">{item.name}</h3>
                  <p class="text-gray-800 text-center">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div class="flex flex-col justify-center items-center px-4">
                <div class="flex flex-row py-2">
                  <button
                    on:click={() => updateQuantity(item._id, item.quantity - 1)}
                    class="bg-gray-200 py-1 rounded w-auto text-gray-800 border-gray-400"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    bind:value={item.quantity}
                    on:change={() => updateQuantity(item._id, item.quantity)}
                    class="w-12 text-center bg-gray-200 text-gray-800 border-gray-400 border"
                  />
                  <button
                    on:click={() => updateQuantity(item._id, item.quantity + 1)}
                    class="bg-gray-200 py-1 rounded w-auto text-gray-800 border-gray-400"
                  >
                    +
                  </button>
                </div>

                <button
                  on:click={() => removeFromCart(item._id)}
                  class="ml-4 bg-red-600 text-gray-300 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          {/each}

          <div class="mt-8">
            <h4 class="text-xl font-semibold text-gray-700">
              Total: ${total.toFixed(2)}
            </h4>
          </div>

          <div class="mt-8 flex justify-between">
            <button
              on:click={clearCart}
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Vaciar Carrito
            </button>
            <button
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
