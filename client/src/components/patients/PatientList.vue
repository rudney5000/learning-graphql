<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "PatientList",

  computed: {
    patients(): Patient[] {
      return this.$store.getters["patients/patients"];
    },

    loading(): boolean {
      return this.$store.getters["patients/loading"];
    },

    error(): Error | null {
      return this.$store.getters["patients/error"];
    }
  },

  async mounted() {
    await this.$store.dispatch("patients/getPatients")
  },

  methods: {
    createPatient() {
      return this.$store.dispatch("patients/createPatient", {
        firstName: "Paul",
        lastName: "Doe",
      })
    }
  },

})
</script>

<template>
  <section>
    <h1>Patients</h1>

    <p v-if="loading">
      Loading ...
    </p>

    <p v-else-if="error">
      Error: {{ error.message }}
    </p>

    <ul v-else>
      <li
          v-for="patient in patients"
          :key="patient.id"
      >
        {{ patient.firstName }}
        {{ patient.lastName }}
      </li>
    </ul>

    <button @click="createPatient">
      Create patient
    </button>
  </section>
</template>

<style scoped>

</style>