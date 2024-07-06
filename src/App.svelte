<script lang="ts">
  import { currentRoute } from "./stores/route";
  import Navbar from "./components/Navbar.svelte";
  import Home from "./pages/Home.svelte";
  import Products from "./pages/Products.svelte";
  import Login from "./pages/Login.svelte";
  import Admin from "./pages/Admin.svelte";
  import Cart from "./pages/Cart.svelte";
  import Inventory from "./pages/Inventory.svelte";

  $: path = $currentRoute;
</script>

<Navbar />

<main>
  {#if path === "/"}
    <Home />
  {:else if path === "/productos"}
    <Products />
  {:else if path === "/login"}
    <Login />
  {:else if path === "/admin"}
    <Admin />
  {:else if path === "/inventario"}
    <Inventory />
  {:else if path === "/carrito"}
    <Cart />
  {:else}
    <p>Página no encontrada: {path}</p>
  {/if}
</main>
