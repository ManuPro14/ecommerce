<script lang="ts">
  import { currentRoute } from "../stores/route";

  let isMenuOpen = false;

  function navigate(path: string) {
    history.pushState(null, "", path);
    currentRoute.set(path);
    isMenuOpen = false;
  }
</script>

<nav class="bg-slate-500 shadow-md fixed top-0 left-0 right-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center">
          <span class="text-2xl font-bold text-slate-900">Manu Ecommerce</span>
        </div>
      </div>

      <div class="hidden md:flex md:items-center md:space-x-4">
        <a
          href="/"
          class=" hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >Inicio</a
        >
        <a
          href="/productos"
          class=" hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >Productos</a
        >
        <a
          href="/carrito"
          class=" hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >Carrito</a
        >
        <a
          href="/login"
          class=" hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >Login</a
        >
      </div>

      <!-- Botón de menú hamburguesa solo para móviles -->
      <div class="flex items-center md:hidden">
        <button
          on:click={() => (isMenuOpen = !isMenuOpen)}
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50"
          >Inicio</a
        >
        <a
          href="/productos"
          on:click|preventDefault={() => navigate("/productos")}
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50"
          >Productos</a
        >
        <a
          href="/carrito"
          on:click|preventDefault={() => navigate("/carrito")}
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50"
          >Carrito</a
        >
        <a
          href="/login"
          on:click|preventDefault={() => navigate("/login")}
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50"
          >Login</a
        >
      </div>
    </div>
  {/if}
</nav>
