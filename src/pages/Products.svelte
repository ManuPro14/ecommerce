<script lang="ts">
  
  const products = [
    {
      id: 1,
      name: "Smartphone XYZ",
      price: 599.99,
      description:
        "Un smartphone de última generación con cámara de alta resolución.",
      image: "/public/img/smartphone.webp",
    },
    {
      id: 2,
      name: "Laptop ABC",
      price: 1299.99,
      description:
        "Laptop potente para profesionales y gamers, con pantalla 4K y 32GB de RAM.",
      image: "/public/img/laptop.jpg",
    },
    {
      id: 3,
      name: "Auriculares Noise-Cancel",
      price: 199.99,
      description:
        "Auriculares con cancelación de ruido para una experiencia inmersiva.",
      image: "/public/img/auriculares.jpg",
    },
    {
      id: 4,
      name: "Smartwatch 1000",
      price: 299.99,
      description:
        "Smartwatch con seguimiento de actividad y notificaciones en tiempo real.",
      image: "/public/img/smartwatch.jpg",
    },
  ];
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
      {#each products as product (product.id)}
        <div
          class="bg-white rounded-xl shadow-md overflow-hidden w-[300px] h-[550px]"
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

