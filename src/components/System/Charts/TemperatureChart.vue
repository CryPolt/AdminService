<template>
  <div>
    <canvas id="temperatureChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['temperature'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('temperatureChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CPU Temperature (°C)'],
        datasets: [
          {
            label: 'Temperature',
            data: [this.temperature.toFixed(1)],
            backgroundColor: '#ff6384',
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
