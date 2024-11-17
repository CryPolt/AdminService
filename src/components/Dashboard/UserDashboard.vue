<template>
  <div class="dashboard-wrapper">
    <div class="main-content">
      <component :is="activeComponent" />

      <header class="project-header">
        <h1 class="project-title">Описание по данному порталу</h1>
        <p class="project-description">
          Данный портал предназначен для того чтобы автоматизировать типовые задачи и ускорить рабочий процесс во всех секторах и отделе ДИТ
        </p>
        <button class="dashboard-button" @click="navigateToDashboard">Перейти к своему дашборду</button>
      </header>

      <section class="news-section">
        <h2 class="news-title">Новости</h2>
        <ul class="news-list">
          <li v-for="(news, index) in newsList" :key="index" class="news-item">
            <h3 class="news-item-title">{{ news.title }}</h3>
            <p class="news-item-description">{{ news.description }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>




<script>
// Импортируем компоненты для разных вкладок
import SystemStats from '@/components/System/SystemSats/SystemStats.vue';
import Fpm from "@/components/System/FPM/Fpm.vue";
import Daemon from "@/components/System/Daemons/Daemon.vue";
import SuperAdminDashboard from "../Admin/SuperAdminDasboard.vue"; // Пример дашборда супер-админа

export default {
  components: {
    SystemStats,
    Fpm,
    Daemon,
    SuperAdminDashboard,
  },
  data() {
    return {
      activeComponent: 'UserDashboard', // По умолчанию показываем дашборд
      currentTime: '', // Для отображения текущей даты и времени
      newsList: [ // Статические новости
        {
          title: 'Обновление системы',
          description: 'Система была успешно обновлена до версии 1.2. Новые функции доступны для всех пользователей.',
        },
        {
          title: 'Плановое обслуживание',
          description: '15 ноября 2024 года с 00:00 до 04:00 будут проводиться технические работы. Система будет недоступна.',
        },
        {
          title: 'Новый раздел для отчетов',
          description: 'Добавлен новый раздел для отчетов. Теперь вы можете анализировать данные быстрее и удобнее.',
        },
      ],
    };
  },
  methods: {
    setActiveComponent(component) {
      this.activeComponent = component;
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
    navigateToDashboard() {
      const role = localStorage.getItem('role'); // Получаем роль пользователя

      if (role === 'Super-Admin') {
        this.setActiveComponent('SuperAdminDashboard'); // Устанавливаем компонент супер-админа
      } else if (role === 'Admin-Core') {
        this.setActiveComponent('SystemStats'); // Дашборд для Admin-Core
      } else if (role === 'Admin-Pay') {
        this.setActiveComponent('Fpm'); // Дашборд для Admin-Pay
      } else if (role === 'Admin-QA') {
        this.setActiveComponent('Daemon'); // Дашборд для Admin-QA
      } else {
        this.setActiveComponent('UserDashboard'); // По умолчанию UserDashboard
      }
    },
  },
  mounted() {
    // Устанавливаем начальное время
    this.updateTime();
    // Запускаем обновление времени каждую секунду
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    // Очищаем таймер, чтобы избежать утечек памяти
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1e2a38;
  font-family: 'Arial', sans-serif;
  color: #ffffff;
}
.dashboard-button {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #394a59;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.dashboard-button:hover {
  background-color: #ffcc00;
  color: #1e2a38;
  transform: scale(1.05);
}



.project-header {
  padding: 20px;
  background-color: #152233;
  text-align: center;
  border-bottom: 2px solid #394a59;
}

.project-title {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ffcc00;
}

.project-description {
  font-size: 16px;
  line-height: 1.6;
  color: #b3bcc7;
  max-width: 800px;
  margin: 0 auto;
}


.main-content {
  flex-grow: 1;
  padding: 40px;
  background-color: transparent;
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}


.footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #b3bcc7;
}

.current-time {
  font-size: 16px;
  font-weight: bold;
  color: #ffcc00;
}

.news-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #152233;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 15px;
  text-align: center;
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.news-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #1b2733;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.news-item-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 5px;
}

.news-item-description {
  font-size: 14px;
  color: #b3bcc7;
  line-height: 1.4;
}

</style>
