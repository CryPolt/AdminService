<template>
  <div>
    <canvas id="diskChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  props: ['disk'],
  mounted() {
    Chart.register(...registerables);
    const ctx = document.getElementById('diskChart').getContext('2d');
    const diskData = this.disk.map(partition => {
      const used = ((partition.used / partition.size) * 100).toFixed(2);
      return { mount: partition.mount, used };
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: diskData.map(d => d.mount),
        datasets: [
          {
            label: 'Disk Usage (%)',
            data: diskData.map(d => d.used),
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
