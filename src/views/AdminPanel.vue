<template>
  <div class="admin-container flex flex-col min-h-screen bg-gray-900 text-white">
    <header class="flex items-center justify-between p-4 bg-gray-800">
      <h1 class="text-2xl font-semibold">Admin Panel</h1>
      <nav class="space-x-4">
        <router-link to="/dashboard" class="nav-button">Dashboard</router-link>
        <router-link to="/systemstats" class="nav-button">System Stats</router-link>
        <router-link to="/epayment" class="nav-button">Epayment</router-link>
        <router-link to="/erp" class="nav-button">ERP</router-link>
        <router-link to="/logout" class="nav-button bg-red-500">Logout</router-link>
      </nav>
    </header>

    <main class="flex-grow p-8">
      <router-view /> <!-- Контент изменяется в зависимости от маршрута -->
    </main>

    <footer class="p-4 bg-gray-800 text-center">
      <p>&copy; 2024 Admin Panel. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
};
</script>

<style scoped>
.nav-button {
  @apply px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600;
}

</style>
