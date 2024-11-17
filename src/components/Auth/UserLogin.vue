<template>
  <div class="login-wrapper">
    <h1>Авторизация</h1>
    <form @submit.prevent="login" class="login-form">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Вход</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("userId", data.userId); // Сохраняем userId
          localStorage.setItem("userName", data.userName); // Сохраняем userName
          this.$router.push("/").then(() => window.location.reload());
        } else {
          this.error = data.message;
        }
      } catch (err) {
        this.error = "Ошибка при авторизации";
      }
    },
  },
};

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #1e2a3a;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
}

h1 {
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px;
  background-color: #2f3b4c;
  border-radius: 10px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}

input {
  padding: 10px;
  border: 1px solid #4b5d73;
  border-radius: 5px;
  background-color: #1e2a3a;
  color: #fff;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.5);
}

input::placeholder {
  color: #b3bcc7;
}

button {
  padding: 10px;
  background-color: #4b5d73;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  background-color: #3e4f65;
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.6);
}

p {
  color: #ff6b6b;
}
</style>
