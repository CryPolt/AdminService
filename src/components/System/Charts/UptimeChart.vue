<template>
  <div>
    <canvas id="uptimeChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['uptime'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('uptimeChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Uptime (hours)'],
        datasets: [
          {
            label: 'System Uptime',
            data: [this.uptime],
            backgroundColor: ['#36a2eb'],
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
