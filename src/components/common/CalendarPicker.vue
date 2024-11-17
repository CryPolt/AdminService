<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="changeMonth(-1)">&#8592;</button>
      <span>{{ currentMonth }} {{ currentYear }}</span>
      <button @click="changeMonth(1)">&#8594;</button>
    </div>
    <div class="calendar-grid">
      <span v-for="day in weekdays" :key="day" class="weekday">{{ day }}</span>
      <span
          v-for="date in calendarDays"
          :key="date"
          :class="['day', { selected: isSelected(date) }]"
          @click="selectDate(date)"
      >
        {{ date.getDate() }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Date,
  },
  emits: ["update:modelValue", "close"],
  data() {
    const now = new Date();
    return {
      currentMonthIndex: now.getMonth(),
      currentYear: now.getFullYear(),
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    };
  },
  computed: {
    currentMonth() {
      return new Date(this.currentYear, this.currentMonthIndex).toLocaleString("default", { month: "long" });
    },
    calendarDays() {
      const startOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1);
      const endOfMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0);
      const days = [];
      for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      return days;
    },
  },
  methods: {
    changeMonth(direction) {
      this.currentMonthIndex += direction;
      if (this.currentMonthIndex < 0) {
        this.currentMonthIndex = 11;
        this.currentYear--;
      } else if (this.currentMonthIndex > 11) {
        this.currentMonthIndex = 0;
        this.currentYear++;
      }
    },
    selectDate(date) {
      this.$emit("update:modelValue", new Date(date));
      this.$emit("close");
    },
    isSelected(date) {
      return this.modelValue && date.toDateString() === this.modelValue.toDateString();
    },
  },
};
</script>

<style scoped>
.calendar {
  position: absolute;
  background-color: #2d3a50;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 10px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: #ffffff;
}

.day {
  padding: 10px;
  text-align: center;
  background-color: #1e2a38;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.day:hover {
  background-color: #ffcc00;
  color: #152233;
}

.day.selected {
  background-color: #394a59;
  color: #ffffff;
}
</style>
