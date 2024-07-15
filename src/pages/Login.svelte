<script lang="ts">
  import { updateRoute } from "../stores/route";
  const API_URL = process.env.API_URL;

  let username = "";
  let password = "";
  let error = "";

  async function handleSubmit() {
    console.log("submit");
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el inicio de sesión");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      updateRoute("/admin");
    } catch (err) {
      error = "Error en el inicio de sesión";
    }
  }
</script>

<div class="bg-gray-200 py-40 min-h-screen">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-800">
      Iniciar sesión
    </h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div
      class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 max-w-screen-md border-4 border-gray-800 mx-auto"
    >
      <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            Nombre de usuario
          </label>
          <div class="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              required
              bind:value={username}
              class="appearance-none block w-full bg-gray-200 text-gray-700 px-3 py-2 border border-gray-800 rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              required
              bind:value={password}
              class="appearance-none block w-full bg-gray-200 text-gray-700 px-3 py-2 border border-gray-800 rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </div>

        {#if error}
          <div class="text-red-500 text-sm">{error}</div>
        {/if}

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
