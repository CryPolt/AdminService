<template>
  <div class="keydb-stats">
    <h2>Database Statistics</h2>
    <table>
      <thead>
      <tr>
        <th>Database</th>
        <th>Keys Count</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="db in stats" :key="db.dbIndex">
        <td>DB {{ db.dbIndex }}</td>
        <td>{{ db.keysCount }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stats: [], // Store statistics for databases
    };
  },
  mounted() {
    this.fetchStats(); // Fetch stats when component mounts
  },
  methods: {
    async fetchStats() {
      try {
        const response = await fetch('/api/keydb/stats');
        this.stats = await response.json();
      } catch (error) {
        console.error('Failed to fetch KeyDB stats:', error);
      }
    },
  },
};
</script>

<style scoped>
.keydb-stats {
  margin-bottom: 30px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

</style>
