<template>
  <div class="external-user">
    <h1>External User Lookup</h1>
    <p>Найдите externalUserId по номеру телефона с +7....</p>

    <form @submit.prevent="fetchExternalUserId">
      <label for="phone">Phone Number:</label>
      <input
          id="phone"
          type="text"
          v-model="phone"
          placeholder="Enter phone number"
          required
      />
      <button type="submit">Search</button>
    </form>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="externalUserId" class="result">
      <h2>External User ID:</h2>
      <p>{{ externalUserId }}</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExternalUser",
  data() {
    return {
      phone: "",
      externalUserId: null,
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchExternalUserId() {
      this.loading = true;
      this.error = null;
      this.externalUserId = null;

      try {
        const response = await fetch("/api/external-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: this.phone }),
        });

        const data = await response.json();

        if (response.ok) {
          this.externalUserId = data.externalUserId;
        } else {
          this.error = data.error || "Failed to fetch External User ID.";
        }
      } catch (err) {
        this.error = "An unexpected error occurred.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.external-user {
  padding: 20px;
  background-color: #1b2733;
  color: #f1f5f9;
  border-radius: 10px;
}

h1 {
  font-size: 24px;
  color: #38bdf8;
}

p {
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border: 1px solid #334155;
  border-radius: 5px;
  background-color: #0f172a;
  color: #f1f5f9;
}

button {
  padding: 10px;
  background-color: #38bdf8;
  color: #1e293b;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #60a5fa;
}

.loading,
.error,
.result {
  margin-top: 20px;
}

.error {
  color: #f87171;
}
</style>
