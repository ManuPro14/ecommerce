<section
  class="bg-contactImage relative min-h-screen py-40 bg-cover bg-center bg-no-repeat flex flex-col justify-center w-full"
>
  <div
    class="w-full h-full top-0 absolute backdrop-blur-sm"
    style="background: linear-gradient(to right, rgba(88, 94, 148, 0.9), rgba(143, 143, 148, 0.9));"
  ></div>

  <div class="container mx-auto px-4 z-20">
    <h2 class="text-4xl font-bold mb-8 text-center">Contáctanos</h2>
    <div class="max-w-lg mx-auto">
      <form class="space-y-6">
        <div>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Nombre completo"
            class="mt-1 block w-full text-center border border-gray-300 bg-gray-200 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Correo electrónico"
            class="mt-1 block w-full text-center border border-gray-300 bg-gray-200 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="flex items-center">
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            placeholder="Mensaje"
            class="mt-1 block w-full border text-center border-gray-300 bg-gray-200 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-blue-900 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Enviar Mensaje
          </button>
        </div>
      </form>
    </div>
  </div>
</section>
