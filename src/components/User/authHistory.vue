<template>
  <div class="history-wrapper">
    <h1>История авторизации</h1>
    <table class="history-table" v-if="authHistory.length">
      <thead>
      <tr>
        <th>Дата</th>
        <th>IP-адрес</th>
        <th>Браузер</th>
        <th>ОС</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="entry in authHistory" :key="entry.timestamp">
        <td>{{ entry.timestamp }}</td>
        <td>{{ entry.ip_address }}</td>
        <td>{{ entry.browser }}</td>
        <td>{{ entry.os }}</td>
      </tr>
      </tbody>
    </table>
    <p v-if="error">{{ error }}</p>
    <p v-else-if="!authHistory.length">История авторизации отсутствует.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authHistory: [],
      error: null,
    };
  },
  async mounted() {
    try {
      const userId = this.$route.params.userId;

      if (!userId) {
        throw new Error("Идентификатор пользователя отсутствует. Пожалуйста, войдите снова.");
      }

      const response = await fetch(`/api/auth-history/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        this.authHistory = data.history;
      } else {
        this.error = data.message;
      }
    } catch (err) {
      this.error = err.message;
    }
  },
};
</script>

<style scoped>
.auth-history {
  max-width: 800px;
  margin: 0 auto;
  color: #333;
}

.loading,
.error,
.no-data {
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  color: #555;
}

.auth-history-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #f9f9f9;
}

.auth-history-table th,
.auth-history-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.auth-history-table th {
  background-color: #007bff;
  color: #fff;
}

.auth-history-table tr:hover {
  background-color: #f1f1f1;
}
</style>
