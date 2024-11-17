<template>
  <div class="bank-cards-panel">
    <h1>Bank Cards Data</h1>
    <p>Здесь вы можете просмотреть данные банковских карт за выбранный период</p>

    <div class="bank-cards-inputs">
      <div class="input-group">
        <label for="startDate">Start Date:</label>
        <input
            type="text"
            :value="formattedStartDate"
            @click="toggleCalendar('start')"
            readonly
            class="datepicker-input"
        />
        <CalendarPicker
            v-if="showStartCalendar"
            v-model="startDate"
            @close="closeCalendar('start')"
        />
      </div>

      <div class="input-group">
        <label for="endDate">End Date:</label>
        <input
            type="text"
            :value="formattedEndDate"
            @click="toggleCalendar('end')"
            readonly
            class="datepicker-input"
        />
        <CalendarPicker
            v-if="showEndCalendar"
            v-model="endDate"
            @close="closeCalendar('end')"
        />
      </div>
    </div>

    <div class="button-group">
      <button class="btn-fetch" @click="fetchBankCardsData" :disabled="loading">Fetch Data</button>
      <button class="btn-export" @click="exportBankCardsData" :disabled="loading">Export to Excel</button>
    </div>

    <div v-if="data" class="bank-cards-data-table-container">
      <h2>Bank Cards Summary Data</h2>
      <table>
        <thead>
        <tr>
          <th>Bank</th>
          <th>Active Cards Count</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in rows" :key="row.bank">
          <td>{{ row.bank }}</td>
          <td>{{ row.activeCards }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import CalendarPicker from "@/components/common/CalendarPicker.vue";

export default {
  components: { CalendarPicker },
  data() {
    return {
      startDate: null,
      endDate: null,
      showStartCalendar: false,
      showEndCalendar: false,
      data: null,
      loading: false,
      error: null,
      rows: [],
    };
  },
  computed: {
    formattedStartDate() {
      return this.startDate
          ? this.startDate.toISOString().split("T")[0]
          : "Выберите дату";
    },
    formattedEndDate() {
      return this.endDate
          ? this.endDate.toISOString().split("T")[0]
          : "Выберите дату";
    },
  },
  methods: {
    toggleCalendar(type) {
      if (type === "start") {
        this.showStartCalendar = !this.showStartCalendar;
        this.showEndCalendar = false;
      } else if (type === "end") {
        this.showEndCalendar = !this.showEndCalendar;
        this.showStartCalendar = false;
      }
    },
    closeCalendar(type) {
      if (type === "start") this.showStartCalendar = false;
      if (type === "end") this.showEndCalendar = false;
    },
    async fetchBankCardsData() {
      if (!this.startDate || !this.endDate) {
        this.error = "Please select both start and end dates.";
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const query = `start_date=${this.formattedStartDate}&end_date=${this.formattedEndDate}`;
        const response = await fetch(`/api/bankcards?${query}`);
        if (!response.ok) throw new Error("Failed to fetch data.");
        const result = await response.json();
        this.data = result;
        this.rows = result.bankCardsData.map((card) => ({
          bank: card.issuer,
          activeCards: card.active_cards_count,
        }));
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async exportBankCardsData() {
      if (!this.startDate || !this.endDate) {
        this.error = "Please select both start and end dates.";
        return;
      }
      try {
        const query = `start_date=${this.formattedStartDate}&end_date=${this.formattedEndDate}`;
        const response = await fetch(`/api/bankcards/export?${query}`);
        if (!response.ok) throw new Error("Failed to export data.");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bank_cards_data.xlsx";
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
.bank-cards-panel {
  padding: 40px;
  background-color: #1b2733;
  min-height: 100vh;
  color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bank-cards-inputs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.bank-cards-data-table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

h2 {
  margin-bottom: 20px;
}

table {
  width: 60%;
  border-collapse: collapse;
  background-color: #2d3a50;
  color: #f4f4f4;
}

table, th, td {
  border: 1px solid #555;
}

th, td {
  padding: 12px;
  text-align: left;
}

th {
  background-color: #3b4a60;
  color: white;
}

td {
  background-color: #1e2a38;
  color: #f4f4f4;
}

.btn-fetch {
  background-color: #28a745;
  margin-right: 10px;
}

.btn-export {
  background-color: #007bff;
}
</style>
