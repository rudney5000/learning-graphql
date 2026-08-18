<script lang="ts">
import Vue from 'vue'
import {User} from "../../types/types";
import LoginForm from "./LoginForm.vue";

export default Vue.extend({
  name: "AuthPanel",

  components: {
    LoginForm
  },

  computed: {
    user(): User | null {
      return this.$store.getters["auth/user"]
    },

    isAuthenticated(): boolean {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },

  async mounted() {
    await this.$store.dispatch("auth/me");
  },

  methods: {
    async logout() {
      await this.$store.dispatch("auth/logout")

      await this.$router.push({name: "login"});
    }
  },
})
</script>

<template>
  <section>
    <LoginForm v-if="isAuthenticated && user"/>
    <div v-else-if="user">
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