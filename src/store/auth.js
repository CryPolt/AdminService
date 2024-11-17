import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    actions: {
        async register(username, password) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_URL}/register`, {
                    username,
                    password,
                });
                console.log('User registered:', response.data);
            } catch (error) {
                console.error('Registration error:', error.response.data);
            }
        },
        async login(username, password) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_URL}/login`, {
                    username,
                    password,
                });
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            } catch (error) {
                console.error('Login error:', error.response.data);
            }
        },
    },
});
