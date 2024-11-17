<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">Разделы</h2>
    <nav class="sidebar-menu">
      <ul>
        <li
            v-for="(item, index) in filteredMenuItems"
            :key="index"
            :class="{ active: activeRoute === item.route }"
            @click="navigate(item.route)"
        >
          {{ item.label }}
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      role: localStorage.getItem('role') || '', // Роль пользователя
      activeRoute: this.$route.name, // Текущий маршрут
      menuItems: [
        {label: 'Super Admin Panel', route: 'SuperAdminDashoard', roles: ['Super-Admin']},
        {label: 'Dashboard', route: 'Dashboard', roles: ['Super-Admin', 'Admin-Core']},
        {label: 'System Stats', route: 'SystemStats', roles: ['Super-Admin', 'Admin-Core']},
        {label: 'Epayment System', route: 'EpaymentSystem', roles: ['Super-Admin', 'Admin-Pay']},
        {label: 'ERP System', route: 'ErpSystem', roles: ['Super-Admin', 'Admin-PAO']},
        {label: 'FPM', route: 'FPM', roles: ['Super-Admin', 'Admin-Core']},
        {label: 'Daemons', route: 'Daemon', roles: ['Super-Admin', 'Admin-QA']},
      ],
    };
  },
  computed: {
    filteredMenuItems() {
      // Фильтруем элементы меню, доступные для текущей роли
      return this.menuItems.filter((item) => item.roles.includes(this.role));
    },
  },
  methods: {
    navigate(routeName) {
      this.$router.push({name: routeName});
      this.activeRoute = routeName;
    },
  },
  watch: {
    $route(to) {
      this.activeRoute = to.name;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #1e2a3a, #141a24);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
}

.sidebar-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
}

.sidebar-menu ul li {
  margin: 10px 0;
  padding: 10px 15px;
  background: #1b2733;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.sidebar-menu ul li:hover {
  background: #394a59;
  transform: translateX(5px);
}

.sidebar-menu ul li.active {
  background: #ffcc00;
  color: #1e2a3a;
  font-weight: bold;
}
</style>
