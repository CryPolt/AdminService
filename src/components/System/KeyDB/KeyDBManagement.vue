<template>
  <div class="keydb-management">
    <h1>KeyDB Management</h1>
    <div class="database-selection">
      <button
          v-for="db in stats"
          :key="db.dbIndex"
          @click="selectDatabase(db.dbIndex)"
          :class="{ active: db.dbIndex === selectedDbIndex }"
      >
        DB {{ db.dbIndex }} ({{ db.keysCount }} keys)
      </button>
    </div>

    <div v-if="selectedDbIndex === 15">
      <select v-model="selectedType" @change="fetchKeysForSelectedType">
        <option value="di_counter">DI Counter</option>
        <option value="qr_token">QR Token</option>
      </select>
    </div>

    <keydb-keys :db-index="selectedDbIndex" :selected-type="selectedType" />
  </div>
</template>

<script>
import KeyDBKeys from "./KeyDBKeys.vue";

export default {
  components: { KeyDBKeys },
  data() {
    return {
      stats: [],
      selectedDbIndex: null,
      selectedType: "di_counter",
    };
  },
  methods: {
    selectDatabase(dbIndex) {
      this.selectedDbIndex = dbIndex;
    },
    async fetchStats() {
      try {
        const response = await fetch("/api/keydb/stats");
        this.stats = await response.json();
        if (this.stats.length > 0) {
          this.selectedDbIndex = this.stats[0].dbIndex;
        }
      } catch (error) {
        console.error("Failed to fetch KeyDB stats:", error);
      }
    },
    fetchKeysForSelectedType() {
      if (this.selectedDbIndex === 15) {
        this.$refs.keydbKeys.fetchKeys();
      }
    },
  },
};
</script>


<style scoped>
.keydb-management {
  padding: 20px;
}

.database-selection {
  margin-bottom: 20px;
}

.db-item {
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f0f0f0;
  cursor: pointer;
}

button.active {
  background-color: #ddd;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

pre {
  background: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  overflow-x: auto;
}

</style>
