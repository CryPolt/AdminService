<template>
  <div>
    <h1>{{ title }}</h1>
    <div class="transaction-info">
      <p>Всего транзакций: {{ filteredTransactions.length }}</p>
    </div>
    <div class="tab-group">
      <button
          v-for="tab in tabs"
          :key="tab.type"
          :class="{ active: currentTab === tab.type }"
          @click="switchTab(tab.type)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-if="currentTab === 'ALL'" class="info-container">
      <h2>Информация</h2>
      <p>
        Эта вкладка предназначена для отображения всех транзакций и анализа ошибок. Ниже приведены возможные ошибки и их описание:
      </p>
      <ul class="error-list">
        <li>
          <strong>710:</strong> Возникает, когда запрос возвращает больше строк, чем ожидалось. Это может нарушить логику бизнес-процесса.
        </li>
        <li>
          <strong>711:</strong> Данные не найдены для указанных параметров.
        </li>
        <li>
          <strong>728:</strong> Операция прервана из-за бизнес-правила.
        </li>
        <li>
          <strong>719:</strong> Отсутствуют данные в журнале терминалов.
        </li>
        <li>
          <strong>838:</strong> Оплата заблокирована из-за запретов на маршруты.
        </li>
        <li>
          <strong>848:</strong> Нет доступного маршрута для выполнения операции.
        </li>
        <li>
          <strong>712:</strong> Общая необработанная ошибка, возникающая при непредвиденных ситуациях.
        </li>
      </ul>
    </div>
    <div v-if="currentTab === 'EXPORT'" class="export-container">
      <button @click="exportTransactions">Выгрузить для до проводки</button>
    </div>
    <div v-else-if="currentTab !== 'ALL'" class="table-container">
      <table class="transaction-table">
        <thead>
        <tr>
          <th>OID</th>
          <th>Терминал</th>
          <th>Маршрут</th>
          <th>Карта Списания</th>
          <th>Сумма</th>
          <th>Код Транзакции</th>
          <th v-if="currentTab === 'SMS'">WID</th>
          <th v-if="currentTab === 'QR'">MID</th>
          <th>Тип</th>
          <th>Дата</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="transaction in paginatedTransactions" :key="transaction.oid">
          <td>{{ transaction.oid }}</td>
          <td>T{{ transaction.code }}</td>
          <td>{{ transaction.route }}</td>
          <td>{{ transaction.cardDeduct }}</td>
          <td>{{ transaction.price / 100 }} тг</td>
          <td>{{ extractTransactionCode(transaction.response) }}</td>
          <td v-if="transaction.type === 'SMS'">{{ transaction.wid || 'N/A' }}</td>
          <td v-if="transaction.type === 'QR'">{{ transaction.mid || 'N/A' }}</td>
          <td>{{ transaction.type }}</td>
          <td>{{ transaction.createdAt }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination" v-if="currentTab !== 'ALL' && currentTab !== 'EXPORT'">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Назад
      </button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Вперед
      </button>
    </div>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  name: "TransactionTable",
  props: {
    smsApiUrl: { type: String, required: true },
    qrApiUrl: { type: String, required: true },
    title: { type: String, default: "Таблица транзакций" },
  },
  data() {
    return {
      transactions: [],
      loading: false,
      error: null,
      currentTab: "ALL",
      currentPage: 1,
      pageSize: 25,
      tabs: [
        { type: "ALL", label: "Объяснение и ошибки" },
        { type: "SMS", label: "SMS Транзакции" },
        { type: "QR", label: "QR Транзакции" },
        { type: "EXPORT", label: "Выгрузка для до проводки" },
      ],
    };
  },
  computed: {
    filteredTransactions() {
      if (this.currentTab === "ALL") {
        return this.transactions; // All transactions
      }
      if (this.currentTab === "EXPORT") {
        return this.transactions.filter((t) => t.code !== "838"); // Exclude 838
      }
      return this.transactions.filter(
          (transaction) => transaction.type === this.currentTab
      );
    },
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / this.pageSize);
    },
    paginatedTransactions() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.filteredTransactions.slice(
          startIndex,
          startIndex + this.pageSize
      );
    },
  },
  methods: {
    async fetchTransactions() {
      this.loading = true;
      try {
        const [smsResponse, qrResponse] = await Promise.all([
          fetch(this.smsApiUrl).then((res) => res.json()),
          fetch(this.qrApiUrl).then((res) => res.json()),
        ]);
        this.transactions = [
          ...smsResponse.data.map((t) => ({ ...t, type: "SMS" })),
          ...qrResponse.data.map((t) => ({ ...t, type: "QR" })),
        ];
      } catch (error) {
        this.error = "Не удалось загрузить данные.";
      } finally {
        this.loading = false;
      }
    },
    exportTransactions() {
      const smsTransactions = this.transactions
          .filter((t) => t.type === "SMS" && t.code !== "838")
          .map((t) => ({
            Терминал: t.code,
            Маршрут: t.route,
            Бортномер: t.conductor,
            "Карта списания": t.cardDeduct,
            "Сумма (тг)": t.price / 100,
          }));
      const qrTransactions = this.transactions
          .filter((t) => t.type === "QR" && t.code !== "838")
          .map((t) => ({
            Терминал: t.code,
            Маршрут: t.route,
            Бортномер: t.conductor,
            "Карта списания": t.cardDeduct,
            "Сумма (тг)": t.price / 100,
          }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
          workbook,
          XLSX.utils.json_to_sheet(smsTransactions),
          "SMS"
      );
      XLSX.utils.book_append_sheet(
          workbook,
          XLSX.utils.json_to_sheet(qrTransactions),
          "QR"
      );
      XLSX.writeFile(workbook, "transactions.xlsx");
    },
    switchTab(tabType) {
      this.currentTab = tabType;
      this.currentPage = 1;
    },
    changePage(page) {
      this.currentPage = page;
    },
    extractTransactionCode(responseString) {
      try {
        const parsedResponse = JSON.parse(responseString);
        return parsedResponse.data?.transaction || "Проверить вручную";
      } catch (error) {
        console.error("Ошибка при парсинге response:", error);
        return "N/A";
      }
    },
  },
  mounted() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>

.info-container {
  margin: 20px;
  color: #fff;
}

.error-list {
  list-style-type: none;
  padding: 0;
}

.error-list li {
  margin: 10px 0;
}

.error-list strong {
  color: #ffcc00;
}

.table-container {
  overflow-x: auto;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #1e2a38;
  color: white;
}

.transaction-table th,
.transaction-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #394a59;
  min-width: 150px;
}

.transaction-table th {
  background-color: #394a59;
}

.transaction-table tr:hover {
  background-color: #2d3a50;
}

.transaction-info {
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  color: white;
}

.tab-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button.active {
  background-color: #0056b3;
  font-weight: bold;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

.pagination button:hover {
  background-color: #0056b3;
}

.pagination span {
  color: white;
  font-weight: bold;
}

.export-container {
  text-align: center;
  margin: 20px;
}

.export-container button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.export-container button:hover {
  background-color: #0056b3;
}

</style>
