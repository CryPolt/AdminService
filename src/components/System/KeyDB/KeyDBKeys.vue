<template>
  <div class="keydb-keys">
    <h2>Keys in Database {{ dbIndex }}</h2>
    <input
        v-model="searchQuery"
        placeholder="Search for keys..."
        @input="onSearch"
        class="search-input"
    />
    <div v-if="loading">
      <LoadingSpinner />
    </div>
    <div v-else>
      <table v-if="filteredKeys.length" class="keys-table">
        <thead>
        <tr>
          <th>#</th>
          <th>Key</th>
          <th>Type</th>
          <th v-if="dbIndex === 9 || dbIndex === 10">External_User_Id</th>
          <th v-if="dbIndex === 15 && selectedType === 'qr_token'">Version_MP</th>
          <th>Value</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in paginatedKeys" :key="index">
          <td>{{ index + 1 + (page - 1) * itemsPerPage }}</td>
          <td>{{ item.key }}</td>
          <td>{{ item.type }}</td>
          <td v-if="dbIndex === 9 || dbIndex === 10">{{ item.externalUserId || 'N/A' }}</td>
          <td v-if="dbIndex === 15 && selectedType === 'qr_token'">{{ item.versionMp || 'N/A' }}</td>
          <td class="value-cell" @click="showValue(item.value)">
            <div class="truncated-text">{{ item.value || 'N/A' }}</div>
          </td>
          <td>
            <button class="delete-btn" @click="deleteKey(item.key)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
      <p v-else>No keys found for this database.</p>
    </div>
    <div class="pagination" v-if="filteredKeys.length">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }}</span>
      <button @click="nextPage" :disabled="paginatedKeys.length < itemsPerPage">Next</button>
    </div>

    <!-- Modal for Viewing Full Value -->
    <div v-if="modalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Full Value</h3>
        <pre>{{ selectedValue }}</pre>
        <button class="close-modal-btn" @click="closeModal">Close</button>
      </div>
    </div>

    <!-- Modal for Success/Error Messages -->
    <div v-if="messageModalVisible" class="modal-overlay" @click.self="closeMessageModal">
      <div class="modal-content">
        <h3>{{ modalMessage.type }}</h3>
        <p>{{ modalMessage.text }}</p>
        <button class="close-modal-btn" @click="closeMessageModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

export default {
  props: ["dbIndex", "selectedType"],
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      keys: [],
      searchQuery: "",
      page: 1,
      itemsPerPage: 10,
      loading: false,
      modalVisible: false,
      messageModalVisible: false,
      modalMessage: { type: "", text: "" },
      selectedValue: null,
    };
  },
  computed: {
    filteredKeys() {
      return this.keys.filter((item) => {
        return (
            item.key?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.type?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.value?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.externalUserId?.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    paginatedKeys() {
      const startIndex = (this.page - 1) * this.itemsPerPage;
      return this.filteredKeys.slice(startIndex, startIndex + this.itemsPerPage);
    },
  },
  watch: {
    dbIndex: {
      immediate: true,
      handler() {
        this.fetchKeys();
      },
    },
    selectedType: "fetchKeys",
  },
  methods: {
    async fetchKeys() {
      this.loading = true;
      try {
        let endpoint = `/api/keydb/keys/${this.dbIndex}`;
        if (this.dbIndex === 15 && this.selectedType) {
          endpoint += `/${this.selectedType}`;
        }
        const response = await fetch(endpoint);
        const data = await response.json();
        this.keys = data.keys || [];
      } catch (error) {
        console.error("Failed to fetch keys:", error);
        this.keys = [];
      } finally {
        this.loading = false;
      }
    },
    async deleteKey(key) {
      console.log("Attempting to delete key:", key);

      // Определяем префикс в зависимости от базы
      let prefix = "";
      if (this.dbIndex === 5) {
        prefix = "sms:";
      } else if (this.dbIndex === 15) {
        prefix = "di_counter:";
      }

      // Формируем ключ с учетом префикса
      const formattedKey = key.startsWith(prefix) ? key : `${prefix}${key}`;

      if (confirm(`Are you sure you want to delete the key "${formattedKey}"?`)) {
        try {
          const response = await fetch(`/api/keydb/keys/${this.dbIndex}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: formattedKey }), // Отправляем корректный ключ
          });

          const result = await response.json();

          if (response.ok && result.success) {
            this.showMessage("Success", result.message || "Key deleted successfully.");
            await this.fetchKeys(); // Обновляем список ключей после удаления
          } else {
            console.error(`[ERROR] Server response: ${result.error || result.message}`);
            this.showMessage("Error", result.error || result.message || "Failed to delete key.");
          }
        } catch (error) {
          console.error("[ERROR] Failed to delete key:", error);
          this.showMessage("Error", "An error occurred while deleting the key.");
        }
      }
    }
    ,
    showMessage(type, text) {
      this.modalMessage = {type, text};
      this.messageModalVisible = true;
    },
    closeMessageModal() {
      this.messageModalVisible = false;
      this.modalMessage = {type: "", text: ""};
    },
    nextPage() {
      if (this.page * this.itemsPerPage < this.filteredKeys.length) {
        this.page++;
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    onSearch() {
      this.page = 1;
    },
    showValue(value) {
      this.selectedValue = value;
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedValue = null;
    },
  },
};
</script>

<style scoped>
.keydb-keys {
  margin-top: 20px;
}

.keys-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.search-input {
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.value-cell {
  max-width: 150px;
  cursor: pointer;
}

.truncated-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  color: #333;
}

.close-modal-btn {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.close-modal-btn:hover {
  background-color: #c0392b;
}
</style>
