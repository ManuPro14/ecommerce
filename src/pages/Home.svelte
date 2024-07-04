<script lang="ts">
  import ProductCard from "../components/ProductCard.svelte";

  // Simulamos algunos productos
  const products = [
    {
      id: 1,
      name: "Producto 1",
      price: 19.99,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Producto 2",
      price: 29.99,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      name: "Producto 3",
      price: 39.99,
      image: "https://via.placeholder.com/300",
    },
  ];
</script>

<div class="container mx-auto px-4 pt-20">
  <h1 class="text-5xl font-bold mb-4 p-8 text-slate-">Nuestros Productos</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {#each products as product (product.id)}
      <ProductCard {...product} />
    {/each}
  </div>
</div>
