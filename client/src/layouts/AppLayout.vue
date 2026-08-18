<script lang="ts">
import Vue from 'vue'
import {User} from "../types/types";

export default Vue.extend({
  name: "AppLayout",

  computed: {
    user(): User | null {
      return this.$store.getters["auth/user"];
    }
  },

  methods: {
    async logout() {
      await this.$store.dispatch("auth/logout")

      await this.$router.push({name: "login"});
    }
  }
})
</script>

<template>
  <div>
    <header>
      <strong>Medical App</strong>
      <div v-if="user">
        <span>
          {{ user.id }}
        </span>
        <span>
          {{ user.role }}
        </span>
        <button @click="logout">
          Logout
        </button>
      </div>
    </header>

    <aside>
      <nav>
        <router-link :to="{ name: 'patients' }">
          Patients
        </router-link>
        <router-link :to="{ name: 'appointments' }">
          Appointments
        </router-link>
      </nav>
    </aside>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<style scoped>

</style>