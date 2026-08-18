<script lang="ts">
import Vue from 'vue'
import LoginForm from "../../components/auth/LoginForm.vue";

export default Vue.extend({
  name: "LoginPage",
  components: {LoginForm}
})
</script>

<template>
  <section>
    <h1>Login</h1>
    <LoginForm/>
  </section>
</template>

<style scoped>

</style>