<template>
  <div class="register">
    <h1>User Registration</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">Username:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Register</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
    <router-link to="/login">Already have an account? Login here</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const register = async () => {
  try {
    await authStore.register(username.value, password.value);
    router.push('/');
  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again.';
  }
};
</script>

<style scoped>
/* Ваши стили */
</style>
