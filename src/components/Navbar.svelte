<script lang="ts">
  import { currentRoute } from "../stores/route";
  import { cart } from "../stores/cartStore";

  let isMenuOpen = false;
  let cartItemCount = 0;

  cart.subscribe((items) => {
    cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  });

  function navigate(path: string) {
    currentRoute.set(path);
    isMenuOpen = false;
  }
</script>

<nav
  class="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md fixed top-0 left-0 right-0 z-50"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center">
          <span
            class="text-2xl font-bold text-gray-300
          ">Manu Ecommerce</span
          >
        </div>
      </div>

      <div class="hidden md:flex md:items-center md:space-x-4">
        <a
          href="/"
          on:click|preventDefault={() => navigate("/")}
          class="text-white
            px-3 py-2 rounded-md text-sm font-medium"
        >
          Inicio
        </a>
        <a
          href="/productos"
          on:click|preventDefault={() => navigate("/productos")}
          class="text-white
            px-3 py-2 rounded-md text-sm font-medium"
        >
          Productos
        </a>
        <a
          href="/carrito"
          on:click|preventDefault={() => navigate("/carrito")}
          class="text-white
            px-3 py-2 rounded-md text-sm font-medium"
        >
          Carrito ({cartItemCount})
        </a>
        <a
          href="/login"
          on:click|preventDefault={() => navigate("/login")}
          class="text-white
            px-3 py-2 rounded-full text-sm font-medium"
        >
          Login
        </a>
      </div>

      <!-- Botón de menú hamburguesa para móviles -->
      <div class="flex items-center md:hidden">
        <button
          on:click={() => (isMenuOpen = !isMenuOpen)}
          class="bg-gray-400 border-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <span class="sr-only">Abrir menú</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Menú desplegable para móviles -->
  {#if isMenuOpen}
    <div class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a
          href="/"
          on:click|preventDefault={() => navigate("/")}
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Inicio
        </a>
        <a
          href="/productos"
          on:click|preventDefault={() => navigate("/productos")}
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Productos
        </a>
        <a
          href="/carrito"
          on:click|preventDefault={() => navigate("/carrito")}
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Carrito ({cartItemCount})
        </a>
        <a
          href="/login"
          on:click|preventDefault={() => navigate("/login")}
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
        >
          Login
        </a>
      </div>
    </div>
  {/if}
</nav>
