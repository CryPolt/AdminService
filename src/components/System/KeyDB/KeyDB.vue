<!-- src/components/AdminQA/AdminQA.vue -->
<template>
  <div class="admin-qa">
    <h1>KeyDB Management</h1>

    <!-- Компонент для отображения статистики по базам данных -->
    <keydb-stats />

    <!-- Поиск по ключам -->
    <input v-model="searchQuery" placeholder="Search for keys..." @input="searchKeys" />

    <!-- Компонент для отображения ключей -->
    <keydb-keys :search-query="searchQuery" />
  </div>
</template>

<script>
import KeyDBKeys from './KeyDBKeys.vue';
import KeyDBStats from './KeyDBStats.vue';

export default {
  components: {
    KeyDBKeys,
    KeyDBStats
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    searchKeys() {
      // Эта функция вызывается при поиске ключей и обновляет результат
    }
  }
};
</script>

<style scoped>
.admin-qa {
  padding: 20px;
}
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

</style>
