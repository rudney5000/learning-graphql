<script lang="ts">
import Vue from 'vue'
import {Patient} from "../../types/types";

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

    async selectPatient(id: string) {
      await this.$store.dispatch("patients/getPatient", id)
    },
    async deletePatient(id: string) {
      await this.$store.dispatch("patients/deletePatient", id)

      await this.$store.dispatch("patients/getPatients")
    },

  },

})
</script>

<template>
  <section>
    <h1>Patients</h1>

    <p v-if="loading">
      Loading patients...
    </p>

    <p v-else-if="error">
      Error: {{ error.message }}
    </p>

    <ul v-else>
      <li
          v-for="patient in patients"
          :key="patient.id"
      >
        <span>
          {{ patient.firstName }}
          {{ patient.lastName }}
        </span>

        <button @click="selectPatient(patient.id)">
          View
        </button>
        <button @click="deletePatient(patient.id)">
          Delete
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>

</style>