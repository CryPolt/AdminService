<template>
  <div class="admin-pay-panel">
    <h1 v-if="!showFeature">Admin PAY Panel</h1>
    <p v-if="!showFeature">Добро пожаловать в панель Admin PAY</p>

    <!-- Features Grid -->
    <div v-if="!showFeature" class="pay-features-grid">
      <div
          v-for="feature in payFeatures"
          :key="feature.name"
          class="pay-feature-card"
          @click="handleFeatureClick(feature.route)"
      >
        <h2>{{ feature.name }}</h2>
        <p>{{ feature.description }}</p>
      </div>
    </div>

    <!-- Feature Section -->
    <div v-if="showFeature === 'TransactionManagement'" class="feature-section">
      <button class="back-button" @click="closeFeature">← Back to Panel</button>
      <h2>Transaction Management</h2>
      <p>View and manage all transactions efficiently.</p>
      <!-- Transaction Management Component or Content -->
    </div>

    <div v-if="showFeature === 'KeyDBManagement'" class="feature-section">
      <button class="back-button" @click="closeFeature">← Back to Panel</button>
      <h2>KeyDB Management</h2>
      <p>Manage KeyDB databases and keys seamlessly.</p>
      <!-- KeyDB Management Component or Content -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPay',
  data() {
    return {
      payFeatures: [
        {
          name: 'Transaction Management',
          description: 'View and manage transactions for PAY services.',
          route: 'TransactionManagement',
        },
        {
          name: 'KeyDB Management',
          description: 'Manage KeyDB databases and keys efficiently.',
          route: 'KeyDBManagement',
        },
      ],
      showFeature: null, // Determines which feature to display
    };
  },
  methods: {
    handleFeatureClick(routeName) {
      this.showFeature = routeName; // Show the selected feature
    },
    closeFeature() {
      this.showFeature = null; // Return to the main panel
    },
  },
};
</script>

<style scoped>
.admin-pay-panel {
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

.pay-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.pay-feature-card {
  background-color: #2d3a50;
  color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.pay-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.feature-section {
  padding: 20px;
  background-color: #2d3a50;
  border-radius: 10px;
  color: white;
}

.back-button {
  background-color: #475569;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #38bdf8;
}
</style>
