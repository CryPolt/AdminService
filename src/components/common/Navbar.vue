<template>
  <header class="admin-header">
    <h1>Admin Panel</h1>
    <div class="user-info" ref="userInfo">
      <span @click="toggleDropdown" class="user-name">{{ userName }}</span>
      <div v-if="showDropdown" class="dropdown-menu">
        <button @click="navigateToHistory" class="dropdown-item">История авторизации</button>
        <button @click="logout" class="dropdown-item">Выйти</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "AdminNavbar",
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    userName() {
      return localStorage.getItem("userName") || "User";
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    closeDropdown(event) {
      if (this.$refs.userInfo && !this.$refs.userInfo.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    navigateToHistory() {
      const userId = localStorage.getItem("userId");
      if (userId) {
        this.showDropdown = false;
        this.$router.push({ name: "AuthHistory", params: { userId } });
      } else {
        alert("Идентификатор пользователя отсутствует. Пожалуйста, войдите снова.");
        this.logout();
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login").then(() => window.location.reload());
    },
  },
  mounted() {
    document.addEventListener("click", this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },
};
</script>


<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #1e2a3a;
  border-bottom: 2px solid #394a59;
  color: #fff;
}

.admin-header h1 {
  font-size: 24px;
}

.user-info {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  transition: color 0.3s;
}

.user-name:hover {
  color: #b3bcc7;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: #1e2a3a;
  border: 1px solid #394a59;
  border-radius: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.dropdown-item {
  padding: 10px 20px;
  background-color: transparent;
  color: #fff;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #394a59;
}
</style>
