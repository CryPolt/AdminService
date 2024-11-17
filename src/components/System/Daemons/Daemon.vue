<template>
  <div class="daemon-monitor-container">
    <!-- Tab Navigation -->
    <div class="tabs">
      <button :class="{ active: selectedNode === '172.30.1.214' }" @click="setNode('172.30.1.214')">172.30.1.214</button>
      <button :class="{ active: selectedNode === '172.30.1.215' }" @click="setNode('172.30.1.215')">172.30.1.215</button>
      <button :class="{ active: selectedNode === '172.30.1.217' }" @click="setNode('172.30.1.217')">172.30.1.217</button>
      <button :class="{ active: selectedNode === '172.30.1.218' }" @click="setNode('172.30.1.218')">172.30.1.218</button>
    </div>

    <!-- Status Section -->
    <div class="status-box">
      <h3>Daemon Status for {{ selectedNode }}:</h3>
      <p>
        Daemon active: {{ daemonData.status }},
        uptime: {{ daemonData.uptime }},
        total processes: {{ daemonData.totalProcesses }},
        memory usage: {{ daemonData.memoryUsage }} MB
      </p>
    </div>

    <!-- Alert Section for Warnings -->
    <div v-if="daemonData.memoryUsage > 2000" class="alert-box">
      <p>Warning: Memory usage exceeds 2000 MB!</p>
    </div>

    <!-- Daemon Status Card with Scrollable Content -->
    <div class="daemon-status-card">
      <h3>Daemon Status for {{ selectedNode }}</h3>
      <div class="action-buttons">
        <button @click="fetchDaemonStatus" class="btn primary">Refresh Status</button>
      </div>

      <!-- Scrollable section for raw Daemon data -->
      <div class="scrollable-status">
        <pre>{{ daemonData.rawStatus }}</pre>
      </div>
    </div>

    <!-- Host Statistics -->
    <div class="host-stats-card">
      <h3>Host Statistics</h3>
      <p><strong>Response Time:</strong> {{ daemonData.responseTime }} ms</p>
      <p><strong>CPU Usage:</strong> {{ daemonData.cpuUsage }}%</p>
      <p><strong>Memory Usage:</strong> {{ daemonData.memoryUsage }} / 24164 MB</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaemonMonitorDashboard',
  data() {
    return {
      daemonData: {
        status: 'inactive',
        uptime: 'N/A',
        totalProcesses: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        responseTime: 'N/A',
        rawStatus: '',
      },
      selectedNode: '172.30.1.214', // Default node
      loading: true,
      error: null,
    };
  },
  methods: {
    setNode(node) {
      this.selectedNode = node;
      this.fetchDaemonStatus(); // Fetch data for the selected node
    },
    async fetchDaemonStatus() {
      try {
        const response = await fetch(`http://localhost:3000/api/daemon?node=${this.selectedNode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Daemon status');
        }
        const data = await response.json();

        // Extract relevant Daemon data
        this.daemonData = {
          status: this.extractData(data.rawStatus, 'Daemon active:'),
          uptime: this.extractData(data.rawStatus, 'Uptime:'),
          totalProcesses: this.extractData(data.rawStatus, 'Processes:'),
          memoryUsage: this.extractData(data.rawStatus, 'Memory:'),
          cpuUsage: this.extractData(data.rawStatus, 'CPU:'),
          responseTime: this.extractData(data.rawStatus, 'Response Time:'),
          rawStatus: data.rawStatus.trim(),
        };
        this.loading = false;
      } catch (error) {
        this.error = error.message;
        this.loading = false;
      }
    },
    extractData(statusText, key) {
      const regex = new RegExp(`${key}\\s*(\\d+|[\\w]+)`, 'i');
      const match = statusText.match(regex);
      return match ? match[1] : 'N/A';
    },
  },
  mounted() {
    this.fetchDaemonStatus(); // Fetch data for the default node when mounted
  },
};
</script>

<style scoped>
/* Base Styles */
.daemon-monitor-container {
  padding: 20px;
  background-color: #2c3e50;
  color: #ecf0f1;
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

/* Tab Styles */
.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  background-color: #4b5d73;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.tabs button.active {
  background-color: #1e2a38;
}

.tabs button:hover {
  opacity: 0.9;
}

/* Status Box */
.status-box {
  background-color: #34495e;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.status-box h3 {
  margin: 0 0 10px 0;
}

/* Alert Box */
.alert-box {
  background-color: #e74c3c;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-box p {
  margin: 0;
}

/* Daemon Status Card */
.daemon-status-card {
  background-color: #34495e;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.daemon-status-card h3 {
  margin-bottom: 15px;
}

/* Scrollable status section */
.scrollable-status {
  max-height: 300px;
  overflow-y: auto;
  background-color: #2c3e50;
  padding: 15px;
  border-radius: 5px;
  color: #ecf0f1;
}

.scrollable-status pre {
  background-color: #2c3e50;
  color: #ecf0f1;
  font-size: 14px;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

/* Host Stats Card */
.host-stats-card {
  background-color: #34495e;
  padding: 20px;
  border-radius: 8px;
}

.host-stats-card h3 {
  margin-bottom: 15px;
}

/* Action Buttons */
.action-buttons {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: white;
}

.btn.primary {
  background-color: #2a3b50;
}

.btn:hover {
  opacity: 0.9;
}
</style>
