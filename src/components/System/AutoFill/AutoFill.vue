<template>
  <div class="autofill-panel">
    <h1>Autofill Data</h1>
    <p>Здесь вы можете просмотреть данные автозаполнения за выбранный период</p>

    <div class="autofill-inputs">
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

    <div class="buttons">
      <button class="btn-fetch" @click="fetchAutofillData" :disabled="loading">Fetch Data</button>
      <button class="btn-export" @click="exportAutofillData" :disabled="loading">Export to Excel</button>
    </div>

    <div v-if="data" class="autofill-data-table-container">
      <h2 style="text-align: center">Summary Data</h2>
      <table>
        <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in rows" :key="row.metric">
          <td>{{ row.metric }}</td>
          <td>{{ row.value }}тг</td>
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
    async fetchAutofillData() {
      if (!this.startDate || !this.endDate) {
        this.error = "Please select both start and end dates.";
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const query = `start_date=${this.formattedStartDate}&end_date=${this.formattedEndDate}`;
        const response = await fetch(`/api/autofill?${query}`);
        if (!response.ok) throw new Error("Failed to fetch data.");
        const result = await response.json();
        this.data = result;
        this.rows = [
          { metric: "Успешных Автопополнений", value: result.totalSuccessfulAutofills },
          { metric: "Сумма", value: result.totalAutofillAmount },
          { metric: "Всего успешных Автополнений", value: result.totalAccountsWithAutofill },
        ];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async exportAutofillData() {
      if (!this.startDate || !this.endDate) {
        this.error = "Please select both start and end dates.";
        return;
      }
      try {
        const query = `start_date=${this.formattedStartDate}&end_date=${this.formattedEndDate}`;
        const response = await fetch(`/api/autofill/export?${query}`);
        if (!response.ok) throw new Error("Failed to export data.");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "autofill_data.xlsx";
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
.autofill-panel {
  padding: 40px;
  background: linear-gradient(135deg, #1e2a38, #141a24);
  min-height: 100vh;
  color: #f4f4f4;
  border-radius: 12px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 36px;
  color: #ffcc00;
  margin-bottom: 20px;
}

p {
  text-align: center;
  font-size: 18px;
  color: #b3bcc7;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.datepicker-input {
  padding: 10px;
  border: 1px solid #394a59;
  border-radius: 5px;
  background-color: #152233;
  color: white;
  cursor: pointer;
  width: 200px;
}

.buttons {
  text-align: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin: 5px;
  background-color: #28a745;
  color: white;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
  text-align: center;
}

.loading {
  text-align: center;
  color: #ffcc00;
  font-weight: bold;
}

table {
  width: 80%;
  margin: 20px auto;
  border-collapse: collapse;
  background-color: #2d3a50;
}

table, th, td {
  border: 1px solid #394a59;
}

th, td {
  padding: 10px;
  text-align: left;
  color: #f4f4f4;
}

th {
  background-color: #394a59;
  font-weight: bold;
}
</style>
