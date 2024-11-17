<template>
  <div id="app">
    <div v-if="isAuthenticated">
      <div class="app-wrapper">
        <Sidebar />
        <div class="content">
          <Navbar />
          <main class="main-content">
            <router-view></router-view>
          </main>
        </div>
      </div>
    </div>

    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/common/SideBar.vue";
import Navbar from "./components/common/Navbar.vue";

export default {
  name: "App",
  components: {
    Sidebar,
    Navbar,
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem("token");
    },
  },
};
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: "Arial", sans-serif;
  background-color: #152233;
}

.app-wrapper {
  display: flex;
  height: 100%;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #152233;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  color: #b3bcc7;
  overflow-y: auto;
}
</style>
