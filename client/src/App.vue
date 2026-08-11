<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data() {
    return {};
  },

  computed: {
    patients(): Patient[] {
      return this.$store.getters["patients/patients"];
    },

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
    await this.$store.dispatch("patients/getPatients")
    await this.$store.dispatch("patients/getPatient", "2")
    await this.createPatient()
    await this.updatePatient()
    await this.deletePatient()
  },

  methods: {
    createPatient() {
      return this.$store.dispatch("patients/createPatient", {
        firstName: "Paul",
        lastName: "Doe",
      })
    },

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
    }
  }
});

</script>

<template>
  <div>
    <p>Vue 2 + Vuex 3</p>

    <h1>Patients</h1>

    <p v-if="loading">Loading ...</p>

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

    <h1>Patient</h1>
    <div v-if="loading">
      ...Loading
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else-if="patient">
      <p>ID: {{ patient.id }} </p>
      <p>First name: {{ patient.firstName }} </p>
      <p>Last name: {{ patient.lastName }} </p>

      <h2>Appointments</h2>
      <ul v-if="patient.appointments?.length">
        <li
            v-for="appointment in patient.appointments"
            :key="appointment.id"
        >
          <strong>{{ appointment.reason }}</strong>
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
  </div>
</template>
