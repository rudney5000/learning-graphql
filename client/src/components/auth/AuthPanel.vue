<script lang="ts">
import Vue from 'vue'
import {User} from "../../types/types.ts";

export default Vue.extend({
  name: "AuthPanel",

  computed: {

    user(): User | null {
      return this.$store.getters["auth/user"]
    },

    isAuthenticated(): boolean {
      return this.$store.getters["auth/isAuthenticated"];
    },

    authLoading(): boolean {
      return this.$store.getters["auth/loading"];
    },

    authError(): Error | null {
      return this.$store.getters["auth/error"];
    },
  },

  async mounted() {
    await this.$store.dispatch("auth/me");

    if(!this.isAuthenticated) {
      return;
    }
  },

  methods: {
    logout() {
      return this.$store.dispatch("auth/logout")
    }
  },
})
</script>

<template>
  <section>
    <div v-if="isAuthenticated && user">
      <p>
        Connected user: {{ user.id }}
      </p>
      <p>
        Role: {{ user.role }}
      </p>
      <button @click="logout">
        Logout
      </button>
    </div>
  </section>
</template>

<style scoped>

</style>