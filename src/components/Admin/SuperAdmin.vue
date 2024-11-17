<template>
  <div class="create-user-section">
    <h2>Create New User</h2>
    <form @submit.prevent="createUser">
      <input v-model="newUser.username" placeholder="Username" required />
      <input v-model="newUser.password" type="password" placeholder="Password" required />
      <select v-model="newUser.role" required>
        <option disabled value="">Select Role</option>
        <option value="Super-Admin">Super-Admin</option>
        <option value="Admin-Core">Admin-Core</option>
        <option value="Admin-PAO">Admin-PAO</option>
        <option value="Admin-Pay">Admin-Pay</option>
        <option value="Admin-QA">Admin-QA</option>
      </select>
      <button type="submit">Create User</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newUser: {
        username: '',
        password: '',
        role: '',
      },
    };
  },
  methods: {
    async createUser() {
      try {
        await fetch('/api/super-admin/users', {
          method: 'POST',
          body: JSON.stringify(this.newUser),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        this.newUser = { username: '', password: '', role: '' };
      } catch (error) {
        console.error('Error creating user:', error);
      }
    },
  },
};
</script>
