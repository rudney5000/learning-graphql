<script lang="ts">
import Vue from 'vue'

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

  async mounted() {
    await this.$store.dispatch("patients/getPatient", "2")
  },

  methods: {

    updatePatient() {
      if(!this.patient) {
        return
      }
      return this.$store.dispatch("patients/updatePatient", {
        id: this.patient.id,
        input: {
          firstName: "Aline Updated",
        }
      })
    },

    deletePatient() {
      return this.$store.dispatch("patients/deletePatient", "1")
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

    <button
        v-if="patient"
        @click="updatePatient"
    >
      Update patient
    </button>

    <button
        v-if="patient"
        @click="deletePatient"
    >
      Delete Patient
    </button>
  </section>
</template>

<style scoped>

</style>