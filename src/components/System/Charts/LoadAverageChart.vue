<template>
  <div>
    <canvas id="loadAverageChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['loadAverage'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('loadAverageChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1 min', '5 min', '15 min'],
        datasets: [
          {
            label: 'Load Average',
            data: this.loadAverage,
            backgroundColor: ['#ff6384'],
            borderColor: ['#ff6384'],
            fill: false,
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
