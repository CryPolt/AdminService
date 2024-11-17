<template>
  <div>
    <canvas id="memoryChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['memory'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('memoryChart').getContext('2d');
    const usedMemory = ((this.memory.used / this.memory.total) * 100).toFixed(2);
    const freeMemory = (100 - usedMemory).toFixed(2);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Used Memory', 'Free Memory'],
        datasets: [
          {
            data: [usedMemory, freeMemory],
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
