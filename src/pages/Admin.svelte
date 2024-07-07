<script lang="ts">
  import { onMount } from "svelte";
  import { currentRoute } from "../stores/route";
  import SalesSummary from "../components/admin/SalesSummary.svelte";
  import { updateRoute } from "../stores/route";

  let isAuthenticated = false;
  let showNotification = false;
  let notificationMessage = "";
  let notificationType: "success" | "error" = "success";

  onMount(() => {
    isAuthenticated = localStorage.getItem("token") !== null;
    if (!isAuthenticated) {
      currentRoute.set("/login");
    }
  });

  function goToInventory() {
    updateRoute("/inventory");
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    currentRoute.set("/login");
  }

  function handleNotification(event: CustomEvent) {
    notificationMessage = event.detail.message;
    notificationType = event.detail.type || "success";
    showNotification = true;
    setTimeout(() => {
      showNotification = false;
    }, 3000);
  }
</script>

{#if isAuthenticated}
  <div class="min-h-screen bg-gray-200 py-32">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8 text-gray-800 text-center">
        Panel de Administrador
      </h1>

      {#if showNotification}
        <div
          class={`fixed top-12 right-4 p-12 rounded-md ${
            notificationType === "success" ? "bg-green-500" : "bg-red-500"
          } text-gray-800`}
        >
          {notificationMessage}
        </div>
      {/if}

      <div class="flex justify-center">
        <SalesSummary />
      </div>

      <div
        class="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <button
          on:click={goToInventory}
          class="bg-green-500 hover:bg-green-600 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-300 shadow-lg"
        >
          Ver Inventario
        </button>
        <button
          on:click={handleLogout}
          class="bg-red-500 hover:bg-red-600 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-300 shadow-lg"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
{:else}
  <p class="text-center text-xl mt-8 text-gray-800">
    Acceso no autorizado. Redirigiendo...
  </p>
{/if}
