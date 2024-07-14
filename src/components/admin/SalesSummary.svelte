<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import type { Sale } from "../../types";
  import { API_URL } from "../../config";

  let canvas: HTMLCanvasElement;
  let chart: Chart | null = null;
  let totalRevenue = 0;
  let sales: Sale[] = [];

  onMount(async () => {
    await loadSales();
    createChart();
  });

  async function loadSales() {
    try {
      const response = await fetch(`${API_URL}/api/sales`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      sales = await response.json();
      calculateTotalRevenue();
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    }
  }

  function calculateTotalRevenue() {
    totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  }

  function createChart() {
    if (canvas && sales.length > 0) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: sales.map((s) => s.productId.name),
            datasets: [
              {
                label: "Ventas por producto",
                data: sales.map((s) => s.totalPrice),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }
</script>

<div class="bg-white shadow-lg rounded-lg p-6 border-4 border-gray-800">
  <h2 class="text-2xl font-semibold mb-4 text-gray-800">Resumen de Ventas</h2>
  <p class="text-lg mb-4 text-gray-700">
    Ingresos totales: <span class="font-bold text-green-600"
      >${totalRevenue.toLocaleString()}</span
    >
  </p>
  <div class="h-64">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
