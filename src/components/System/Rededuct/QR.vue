<template>
  <TransactionTable
      smsApiUrl="/api/problem-transactions-sms"
      qrApiUrl="/api/problem-transactions-qr"
      title="QR Транзакции"
  />
</template>

<script>
import TransactionTable from "./TrasnsactionTable.vue";

export default {
  name: "QR",
  components: {
    TransactionTable,
  },
};
</script>
