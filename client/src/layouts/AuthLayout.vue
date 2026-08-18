<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "AuthLayout"
})
</script>

<template>
  <section>
    <header>
      <h1> Medical App </h1>
    </header>
    <main>
      <router-view />
    </main>
  </section>
</template>

<style scoped>

</style>