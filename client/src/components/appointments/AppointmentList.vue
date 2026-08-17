<script lang="ts">
import Vue  from 'vue'

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
    createAppointment() {
      return this.$store.dispatch("appointments/createAppointment", {
        patientId: "2",
        scheduledAt: new Date().toISOString(),
        reason: "Consultation"
      })
    },

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
      </li>
    </ul>

    <button @click="createAppointment">
      Create Appointment
    </button>
  </section>
</template>

<style scoped>

</style>