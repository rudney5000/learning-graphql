<script lang="ts">
import Vue  from 'vue'
import {Appointment} from "../../types/types";

export default Vue.extend({
  name: "AppointmentList",

  computed: {
    appointments(): Appointment[] {
      return this.$store.getters["appointments/appointments"]
    },

    loading(): boolean {
      return this.$store.getters["appointments/loading"];
    },

    error(): Error | null {
      return this.$store.getters["appointments/error"];
    },
  },

  async mounted() {
    await this.$store.dispatch("appointments/getAppointments")
  },

  methods: {
    async selectAppointment(id: string) {
      await this.$store.dispatch("appointments/getAppointment", id)
    },
    async deleteAppointment(id: string) {
      await this.$store.dispatch("appointments/deleteAppointment", id)

      await this.$store.dispatch("appointments/getAppointments")
    }

  },
})
</script>

<template>
  <section>
    <h1> Appointments </h1>
    <div v-if="loading">
      Loading appointments ...
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <ul v-else>
      <li
          v-for="appointment in appointments"
          :key="appointment.id"
      >
        <strong>{{ appointment.reason }}</strong>
        -
        {{ appointment.scheduledAt }}
        -
        Patient ID: {{ appointment.patientId }}

        <button @click="selectAppointment(appointment.id)">
          View
        </button>

        <button @click="deleteAppointment(appointment.id)">
          Delete
        </button>
      </li>
    </ul>

  </section>
</template>

<style scoped>

</style>