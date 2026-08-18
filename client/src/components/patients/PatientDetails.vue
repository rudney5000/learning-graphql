<script lang="ts">
import Vue from 'vue'
import {Patient} from "../../types/types";

export default Vue.extend({
  name: "PatientDetails",

  computed: {
    patient(): Patient | null {
      return this.$store.getters["patients/patient"];
    },

    loading(): boolean {
      return this.$store.getters["patients/loading"];
    },

    error(): Error | null {
      return this.$store.getters["patients/error"];
    },
  },
})
</script>

<template>
  <section>
    <h1>Patient</h1>
    <div v-if="loading">
      ...Loading
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else-if="patient">
      <p>
        ID: {{ patient.id }}
      </p>
      <p>
        First name: {{ patient.firstName }}
      </p>
      <p>
        Last name: {{ patient.lastName }}
      </p>

      <h2>Appointments</h2>
      <ul v-if="patient.appointments?.length">
        <li
            v-for="appointment in patient.appointments"
            :key="appointment.id"
        >
          <strong>
            {{ appointment.reason }}
          </strong>
          -
          {{ appointment.scheduledAt }}
        </li>
      </ul>
      <p v-else>
        No appointments
      </p>
    </div>
    <p v-else>
      Select a patient
    </p>

    <button
        v-if="patient"
        @click="$emit('edit')"
    >
      Edit Patient
    </button>
  </section>
</template>

<style scoped>

</style>