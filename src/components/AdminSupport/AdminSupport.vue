<template>
  <div class="admin-support-panel">
    <h1 v-if="!showTransactionTable">Admin Support Panel</h1>
    <p v-if="!showTransactionTable">Добро пожаловать в панель Admin Support</p>

    <!-- Features Grid -->
    <div v-if="!showTransactionTable" class="support-features-grid">
      <div
          v-for="feature in supportFeatures"
          :key="feature.name"
          class="support-feature-card"
          @click="handleFeatureClick(feature.route)"
      >
        <h2>{{ feature.name }}</h2>
        <p>{{ feature.description }}</p>
      </div>
    </div>

    <!-- Transaction Table -->
    <div v-if="showTransactionTable" class="transaction-table-section">
      <button class="back-button" @click="closeTransactionTable">← Back to Panel</button>
      <TransactionTable
          smsApiUrl="/api/problem-transactions-sms"
          qrApiUrl="/api/problem-transactions-qr"
          title="Таблица транзакций"
      />
    </div>
  </div>
</template>

<script>
import TransactionTable from "@/components/System/Rededuct/TrasnsactionTable.vue";

export default {
  name: "AdminSupport",
  components: {
    TransactionTable,
  },
  data() {
    return {
      supportFeatures: [
        {
          name: "Transaction Management",
          description: "Manage problem transactions efficiently.",
          route: "TransactionTable",
        },
        // Add more support features here
      ],
      showTransactionTable: false, // Track if TransactionTable is visible
    };
  },
  methods: {
    handleFeatureClick(route) {
      if (route === "TransactionTable") {
        this.showTransactionTable = true;
      }
    },
    closeTransactionTable() {
      this.showTransactionTable = false;
    },
  },
};
</script>

<style scoped>
.admin-support-panel {
  padding: 40px;
  background-color: #1b2733;
  min-height: 100vh;
}

h1 {
  text-align: center;
  font-size: 36px;
  color: #f4f4f4;
  margin-bottom: 20px;
}

p {
  text-align: center;
  color: #b3bcc7;
  margin-bottom: 40px;
}

.support-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.support-feature-card {
  background-color: #2d3a50;
  color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.support-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.transaction-table-section {
  padding: 20px;
  background-color: #2d3a50;
  border-radius: 10px;
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

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  color: #b3bcc7;
}
</style>
