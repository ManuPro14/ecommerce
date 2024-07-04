<script lang="ts">
  import { currentRoute } from "./stores/route";
  import Navbar from "./components/Navbar.svelte";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";

  function handleRouteChange() {
    currentRoute.set(window.location.pathname);
  }

  import { onMount } from "svelte";
  onMount(() => {
    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange();
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  });
</script>

<Navbar />
<main class="pt-16">
  <!-- Añadimos padding-top para evitar que el contenido quede detrás del navbar -->
  {#if $currentRoute === "/"}
    <Home />
  {:else if $currentRoute === "/login"}
    <Login />
  {:else}
    <p>Página no encontrada</p>
  {/if}
</main>
