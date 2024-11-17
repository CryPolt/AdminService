<template>
  <div>
    <canvas id="cpuChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['cpu'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('cpuChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['CPU Usage', 'Idle'],
        datasets: [
          {
            data: [this.cpu.toFixed(2), (100 - this.cpu).toFixed(2)], // Округление значений
            backgroundColor: ['#ff6384', '#36a2eb'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
