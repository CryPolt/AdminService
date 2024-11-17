<template>
  <div class="system-stats-container">
    <h1 class="title">System Statistics Dashboard</h1>
    <div v-if="loading" class="loading">Loading data...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="charts-grid">
      <div class="chart-card">
        <cpu-chart :cpu="stats.cpu"></cpu-chart>
        <h3>CPU Usage</h3>
      </div>
      <div class="chart-card">
        <memory-chart :memory="stats.memory"></memory-chart>
        <h3>Memory Usage</h3>
      </div>
      <div class="chart-card">
        <disk-chart :disk="stats.disk"></disk-chart>
        <h3>Disk Usage</h3>
      </div>
      <div class="chart-card">
        <network-chart :network="stats.network"></network-chart>
        <h3>Network Usage</h3>
      </div>
      <div class="chart-card">
        <uptime-chart :uptime="stats.uptime"></uptime-chart>
        <h3>Uptime</h3>
      </div>
      <div class="chart-card">
        <load-average-chart :loadAverage="stats.load_average"></load-average-chart>
        <h3>Load Average</h3>
      </div>
      <div class="chart-card">
        <process-chart :topProcesses="stats.top_processes"></process-chart>
        <h3>Top Processes</h3>
      </div>
      <div class="chart-card">
        <temperature-chart :temperature="stats.temperature"></temperature-chart>
        <h3>CPU Temperature</h3>
      </div>
    </div>
  </div>
</template>

<script>
import CpuChart from '../Charts/CpuChart.vue';
import MemoryChart from '../Charts/MemoryChart.vue';
import DiskChart from '../Charts/DiskChart.vue';
import NetworkChart from '../Charts/NetworkChart.vue';
import UptimeChart from '../Charts/UptimeChart.vue';
import LoadAverageChart from '../Charts/LoadAverageChart.vue';
import ProcessChart from '../Charts/ProcessChart.vue';
import TemperatureChart from '../Charts/TemperatureChart.vue';

export default {
  name: 'SystemStats',
  components: {
    CpuChart,
    MemoryChart,
    DiskChart,
    NetworkChart,
    UptimeChart,
    LoadAverageChart,
    ProcessChart,
    TemperatureChart,
  },
  data() {
    return {
      stats: null,
      loading: true,
      error: null,
      intervalId: null,
    };
  },
  methods: {
    async fetchSystemStats() {
      try {
        const response = await fetch('http://localhost:3000/api/system-stats');
        const data = await response.json();
        this.stats = data;
        this.loading = false;
      } catch (err) {
        this.error = 'Failed to fetch system stats';
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchSystemStats();
    // Для реального времени: обновляем данные каждые 5 секунд
    this.intervalId = setInterval(this.fetchSystemStats, 5000);
  },
  beforeUnmount() { // Замена beforeDestroy на beforeUnmount
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.system-stats-container {
  padding: 20px;
  background-color: transparent;
  border-radius: 15px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  color: #2e3e4e;
}

.title {
  text-align: center;
  color: #f4f4f4;
  font-size: 36px;
  margin-bottom: 20px;
  font-weight: 700;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.chart-card {
  background-color: #2a3b50;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.chart-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.15);
}

.chart-card h3 {
  margin-top: 15px;
  font-size: 20px;
  font-weight: 600;
  color: #f4f4f4;
}

.loading {
  font-size: 22px;
  color: #95a5a6;
  text-align: center;
}

.error {
  color: #e74c3c;
  text-align: center;
  font-size: 22px;
}

/* Добавление плавных анимаций для загрузки */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.loading {
  animation: pulse 1s infinite ease-in-out;
}

</style>
