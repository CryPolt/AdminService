<template>
  <div class="super-admin-dashboard">
    <h1>Super Admin Dashboard</h1>
    <div class="admin-panels-grid">
      <div v-for="panel in adminPanels" :key="panel.name" class="admin-panel-card" @click="navigate(panel.route)">
        <h2>{{ panel.name }}</h2>
        <p>{{ panel.description }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SuperAdminDashboard',
  data() {
    return {
      adminPanels: [
        {
          name: 'Admin Core',
          description: 'Manage core functionalities of the system.',
          route: 'AdminCore',
        },
        {
          name: 'Admin PAO',
          description: 'Handle PAO system administration.',
          route: 'AdminPAO',
        },
        {
          name: 'Admin Pay',
          description: 'Oversee the payment system operations.',
          route: 'AdminPay',
        },
        {
          name: 'Admin QA',
          description: 'Manage QA operations and tracking.',
          route: 'AdminQA',
        },
        {
          name: 'Admin Support',
          description: 'Manage Support operations and tracking.',
          route: 'AdminSupport',
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
.super-admin-dashboard {
  padding: 40px;
  background-color: #1b2733;
  min-height: 100vh;
}

h1 {
  text-align: center;
  font-size: 36px;
  color: #f4f4f4;
  margin-bottom: 30px;
  font-weight: bold;
}

.admin-panels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.admin-panel-card {
  background-color: #2d3a50;
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.admin-panel-card:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #fff;
}

p {
  font-size: 16px;
  color: #b3bcc7;
}
</style>
