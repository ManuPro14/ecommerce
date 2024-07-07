<script lang="ts">
  import { currentRoute } from "../stores/route";

  function navigateToProducts() {
    currentRoute.set("/productos");
  }
</script>

<section
  class="bg-heroImage relative min-h-screen py-40 bg-cover bg-center bg-no-repeat flex flex-col justify-center w-full"
>
  <div
    class="w-full h-full top-0 absolute backdrop-blur-sm"
    style="background: linear-gradient(to right, rgba(88, 94, 148, 0.9), rgba(143, 143, 148, 0.9));"
  ></div>

  <div class="relative z-20 mx-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold mb-4 text-gray-300">
        Bienvenido a Manu Ecommerce
      </h1>
      <p class="text-2xl mb-8 text-gray-300">
        Descubre productos increíbles a precios asombrosos
      </p>
      <button
        on:click={navigateToProducts}
        class="bg-gray-300 text-blue-600 font-bold py-2 px-4 rounded-full hover:bg-blue-100 transition duration-300"
      >
        Ver Productos
      </button>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <svg
          class="w-12 h-12 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          ></path>
        </svg>
        <h2 class="text-2xl font-semibold mb-2 text-gray-300">
          Calidad Premium
        </h2>
        <p>Productos de la más alta calidad para ti</p>
      </div>
      <div class="text-center">
        <svg
          class="w-12 h-12 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        <h2 class="text-2xl font-semibold mb-2 text-gray-300">Envío Rápido</h2>
        <p>Entrega rápida y segura a tu puerta</p>
      </div>
      <div class="text-center">
        <svg
          class="w-12 h-12 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          ></path>
        </svg>
        <h2 class="text-2xl font-semibold mb-2 text-gray-300">
          Garantía Total
        </h2>
        <p>Satisfacción garantizada en cada compra</p>
      </div>
    </div>
  </div>
</section>
