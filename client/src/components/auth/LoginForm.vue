<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
  name: "LoginForm",

  data() {
    return {
      username: "doctor",
      password: "1234",
    }
  },

  computed: {
    loading(): boolean {
      return this.$store.getters["auth/loading"];
    },

    error(): Error | null {
      return this.$store.getters["auth/error"];
    },
  },

  methods: {
    async login() {

      await this.$store.dispatch("auth/login", {
        username: this.username,
        password: this.password,
      });

      const isAuthenticated =
          this.$store.getters["auth/isAuthenticated"];

      if (!isAuthenticated) {
        return;
      }

      const redirect = this.$route.query.redirect;

      if (typeof redirect === "string") {
        await this.$router.push(redirect);
        return;
      }

      await this.$router.push({
        name: "patients",
      });
    }
  }
})
</script>

<template>
  <form v-on:submit.prevent="login">
    <div>
      <label>
        Username
      </label>
      <input v-model="username" required  type="text"/>
    </div>
    <div>
      <label>
        Password
      </label>
      <input v-model="password" required  type="password"/>
    </div>
    <button type="submit" :disabled="loading">
      {{ loading ? "Loading..." : "Login" }}
    </button>
    <p v-if="error">
      {{ error.message }}
    </p>
  </form>
</template>

<style scoped>

</style>