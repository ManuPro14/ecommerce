<script lang="ts">
  import { cart } from "../stores/cartStore";
  import type { CartItem } from "../stores/cartStore";

  let products: any[] = [];

  async function fetchProducts() {
    const response = await fetch("http://localhost:5000/api/products");
    products = await response.json();
    console.log(products);
  }

  fetchProducts();

  function addToCart(product: (typeof products)[0]) {
    const cartItem: CartItem = {
      _id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    cart.addToCart(cartItem);
  }
</script>

<div class="bg-gradient-to-r from-blue-500 to-purple-600 py-20 min-h-screen">
  <div class="container mx-auto px-4">
    <h1 class="text-5xl font-bold mb-4 text-white text-center">
      Nuestros Productos
    </h1>
    <p class="text-xl text-white text-center mb-8">
      Descubre nuestra amplia gama de productos de alta calidad
    </p>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"
    >
      {#each products as product (product._id)}
        <div
          class="bg-white rounded-xl shadow-md overflow-hidden w-[300px] h-[550px] p-4"
        >
          <img
            src={product.image}
            alt={product.name}
            class="w-80 h-80 object-cover object-center"
          />
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2">{product.name}</h3>
            <p class="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
            <p class="text-sm text-gray-500 mb-4">{product.description}</p>
            <button
              on:click={() => addToCart(product)}
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
