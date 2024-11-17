<template>
  <div class="admin-core-panel">
    <h1>Admin Core Panel</h1>
    <p>Добро пожаловать в панель Admin Core</p>

    <div class="core-features-grid">
      <div v-for="feature in coreFeatures" :key="feature.name" class="core-feature-card" @click="navigate(feature.route)">
        <h2>{{ feature.name }}</h2>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AdminCore',
  data() {
    return {
      coreFeatures: [
        {
          name: 'System Stats',
          description: 'View detailed system statistics and metrics.',
          route: 'SystemStats',
        },
        {
          name: 'FPM Monitoring',
          description: 'Monitor and manage FPM processes and performance.',
          route: 'FPM',
        },
        {
          name: 'Daemons Management',
          description: 'Control and configure background daemons.',
          route: 'Daemon',
        },
      ],
    };
  },
  methods: {
    navigate(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
<style scoped>
.admin-core-panel {
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

.core-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.core-feature-card {
  background-color: #2d3a50;
  color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.core-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
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
