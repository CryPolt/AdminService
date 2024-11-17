<template>
  <div class="error-message">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',  // Измените имя компонента
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>

.error-message {
  text-align: center;
  color: red;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid red;
  border-radius: 5px;
}
</style>
