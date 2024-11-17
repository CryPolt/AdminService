<template>
  <div>
    <canvas id="networkChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['network'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('networkChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Received (KB/s)', 'Transmitted (KB/s)'],
        datasets: [
          {
            label: 'Network Traffic',
            data: [this.network.received.toFixed(2), this.network.transmitted.toFixed(2)],
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
