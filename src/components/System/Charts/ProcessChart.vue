<template>
  <div>
    <canvas id="processChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['topProcesses'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('processChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topProcesses.map(p => p.command),
        datasets: [
          {
            label: 'CPU Usage by Top Processes (%)',
            data: this.topProcesses.map(p => p.cpu.toFixed(2)),
            backgroundColor: '#36a2eb',
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
