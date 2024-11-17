<template>
  <div class="admin-panel">
    <h1>Admin Panel - Epayment</h1>
    <!-- Logout Button -->
    <form @submit.prevent="logout">
      <button type="submit" class="logout-button">Logout</button>
    </form>

    <!-- Back to Dashboard Button -->
    <router-link to="/dashboard" class="back-button">Back to Dashboard</router-link>

    <!-- Tabs for switching between functionalities -->
    <div class="tabs">
      <div :class="{ active: activeTab === 'check_invoices' }" @click="switchTab('check_invoices')" class="tab">Check Invoices</div>
      <div :class="{ active: activeTab === 'requeue_transactions' }" @click="switchTab('requeue_transactions')" class="tab">Requeue Transactions</div>
    </div>

    <!-- Invoice Checking Tab -->
    <div v-if="activeTab === 'check_invoices'" class="tab-content">
      <h2>Check Invoices</h2>
      <div id="invoice_container">
        <input v-for="(id, index) in invoiceIds" :key="index" v-model="invoiceIds[index]" placeholder="Enter Invoice ID" class="invoice-input" />
      </div>
      <div class="button-container">
        <button @click="addInvoiceInput">Add More Invoices</button>
        <button @click="checkInvoices">Check Invoices</button>
      </div>
      <div v-if="invoiceResults.length" class="invoice-result">
        <h3>Invoice Results</h3>
        <div v-for="(result, invoiceId) in invoiceResults" :key="invoiceId">
          <h4>Result for Invoice ID: {{ invoiceId }}</h4>
          <pre>{{ result }}</pre>
        </div>
      </div>
    </div>

    <!-- Transaction Requeue Tab -->
    <div v-if="activeTab === 'requeue_transactions'" class="tab-content">
      <h2>Requeue Transactions</h2>
      <div id="transaction_container">
        <input v-for="(id, index) in transactionIds" :key="index" v-model="transactionIds[index]" placeholder="Enter Transaction ID" class="invoice-input" />
      </div>
      <div class="button-container">
        <button @click="addTransactionInput">Add More Transactions</button>
        <button @click="requeueTransactions">Requeue Transactions</button>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>


Copy code
<script>
export default {
  name: 'AdminEpaymentsComponent', // Updated to multi-word component name
  data() {
    return {
      activeTab: 'check_invoices',
      invoiceIds: [''],
      transactionIds: [''],
      invoiceResults: [],
      error: null,
    };
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    addInvoiceInput() {
      this.invoiceIds.push('');
    },
    addTransactionInput() {
      this.transactionIds.push('');
    },
    async checkInvoices() {
      try {
        const response = await fetch('http://localhost:3000/api/check-invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoice_ids: this.invoiceIds }),
        });
        const data = await response.json();
        if (response.ok) {
          this.invoiceResults = data.results;
          this.error = null;
        } else {
          this.error = data.error || 'Failed to check invoices';
        }
      } catch (err) {
        this.error = 'Error connecting to the server';
      }
    },
    async requeueTransactions() {
      try {
        const response = await fetch('http://localhost:3000/api/requeue-transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_ids: this.transactionIds }),
        });
        const data = await response.json();
        if (response.ok) {
          this.invoiceResults = data.results;
          this.error = null;
        } else {
          this.error = data.error || 'Failed to requeue transactions';
        }
      } catch (err) {
        this.error = 'Error connecting to the server';
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.$router.push('/login');
    },
  },
};
</script>
<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1e2a3a;
  color: #ffffff;
}

.admin-panel {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background: #2d3a50;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  margin-top: 20px;
}

h1 {
  color: #ffffff;
  text-align: center;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #3b4d63;
}

.tab {
  padding: 10px 20px;
  margin-right: 10px;
  background: #3b4d63;
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
}

.tab.active {
  background: #ffffff;
  color: #333;
}

.invoice-input {
  display: block;
  width: calc(100% - 22px);
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
}

.button-container button {
  padding: 10px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.error {
  color: #ff6b6b;
}
</style>
