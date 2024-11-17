<template>
  <div class="admin-qa-panel">
    <h1 v-if="!showKeyDB && !showExternalUser">QA Admin Panel</h1>
    <p v-if="!showKeyDB && !showExternalUser">Manage QA-specific features and services efficiently.</p>

    <div v-if="!showKeyDB && !showExternalUser" class="features-grid">
      <div
          v-for="feature in qaFeatures"
          :key="feature.name"
          class="feature-card"
          @click="handleFeatureClick(feature.route)"
      >
        <h2>{{ feature.name }}</h2>
        <p>{{ feature.description }}</p>
      </div>
    </div>

    <div v-if="showKeyDB" class="keydb-management">
      <button class="back-button" @click="closeKeyDB">← Back to Panel</button>
      <h2>KeyDB Management</h2>
      <p>Manage KeyDB Databases and Keys efficiently.</p>

      <div class="tabs">
        <button
            v-for="db in stats"
            :key="db.dbIndex"
            :class="{ active: db.dbIndex === selectedDbIndex }"
            @click="selectDatabase(db.dbIndex)"
        >
          DB {{ db.dbIndex }} ({{ db.keysCount }} keys)
        </button>
      </div>

      <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for keys..."
          class="search-bar"
      />

      <KeyDBKeys :db-index="selectedDbIndex" :search-query="searchQuery" />

      <div v-if="dbInfo" class="db-info">
        <h2>Database Info</h2>
        <pre>{{ dbInfo }}</pre>
      </div>
    </div>

    <div v-if="showExternalUser" class="external-user">
      <button class="back-button" @click="closeExternalUser">← Back to Panel</button>
      <h2>External User Lookup</h2>
      <ExternalUser />
    </div>
  </div>
</template>

<script>
import KeyDBKeys from "@/components/System/KeyDB/KeyDBKeys.vue";
import ExternalUser from "@/components/System/ExternalUser/ExternalUser.vue";

export default {
  name: "AdminQA",
  components: { KeyDBKeys, ExternalUser },
  data() {
    return {
      qaFeatures: [
        {
          name: "KeyDB Management",
          description: "Manage KeyDB databases and keys with ease.",
          route: "KeyDBManagement",
        },
        {
          name: "External User Lookup",
          description: "Find external users by phone number.",
          route: "ExternalUser",
        },
      ],
      stats: [],
      selectedDbIndex: null,
      searchQuery: "",
      dbInfo: null,
      showKeyDB: false,
      showExternalUser: false,
    };
  },
  methods: {
    handleFeatureClick(route) {
      if (route === "KeyDBManagement") {
        this.showKeyDB = true;
        this.fetchStats();
      } else if (route === "ExternalUser") {
        this.showExternalUser = true;
      }
    },
    closeKeyDB() {
      this.showKeyDB = false;
    },
    closeExternalUser() {
      this.showExternalUser = false;
    },
    async fetchStats() {
      try {
        const response = await fetch("/api/keydb/stats");
        const data = await response.json();
        this.stats = data;

        if (data.length > 0) {
          this.selectedDbIndex = data[0].dbIndex;
        }
      } catch (error) {
        console.error("Failed to fetch KeyDB stats:", error);
      }
    },
    selectDatabase(dbIndex) {
      this.selectedDbIndex = dbIndex;
      this.fetchDatabaseInfo(dbIndex);
    },
    async fetchDatabaseInfo(dbIndex) {
      try {
        const response = await fetch(`/api/keydb/info/${dbIndex}`);
        const data = await response.json();
        this.dbInfo = JSON.stringify(data, null, 2);
      } catch (error) {
        console.error("Failed to fetch database info:", error);
      }
    },
  },
};
</script>

<style scoped>
.admin-qa-panel {
  padding: 40px;
  background-color: #1b2733;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: #f1f5f9;
}

h1 {
  text-align: center;
  font-size: 36px;
  color: #38bdf8;
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #b3bcc7;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  background-color: #334155;
  color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  background-color: #475569;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #475569;
  color: #f1f5f9;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #334155;
}

.keydb-management,
.external-user {
  padding: 20px;
  background-color: #2d3a50;
  border-radius: 10px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #334155;
  color: #f1f5f9;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #475569;
}

button.active {
  background-color: #38bdf8;
  color: #1e293b;
  font-weight: bold;
}

.search-bar {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #334155;
  border-radius: 5px;
  background: #0f172a;
  color: #f1f5f9;
}

.search-bar::placeholder {
  color: #64748b;
}

.db-info {
  margin-top: 20px;
  padding: 15px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 5px;
  color: #e2e8f0;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
