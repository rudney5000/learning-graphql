<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "ForbiddenPage"
})
</script>

<template>
  <section>
    <h1>403</h1>
    <h2>Forbidden</h2>
    <p>
      You don't have access to this page.
    </p>
    <router-link :to="{ name: 'patients' }">
      Back to Patients
    </router-link>
  </section>
</template>

<style scoped>

</style>