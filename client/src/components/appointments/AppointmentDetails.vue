<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "AppointmentDetails",

  computed: {
    appointment(): Appointment | null{
      return this.$store.getters["appointments/appointment"]
    },

    loading(): boolean {
      return this.$store.getters["appointments/loading"];
    },

    error(): Error | null {
      return this.$store.getters["appointments/error"];
    },
  },

  async mounted() {
    await this.$store.dispatch("appointments/getAppointment", "a2")
  },

  methods: {
    updateAppointment() {
      if(!this.appointment) {
        return
      }

      return this.$store.dispatch("appointments/updateAppointment", {
        id: this.appointment.id,
        input: {
          reason: "Consultation Updated",
        }
      })
    },
    deleteAppointment() {
      if(!this.appointment) {
        return
      }
      return this.$store.dispatch("appointments/deleteAppointment", this.appointment.id);
    },

  },
})
</script>

<template>
  <section>
    <h1>Appointment</h1>

    <p v-if="loading">
      Loading...
    </p>

    <p v-else-if="error">
      Error: {{ error.message }}
    </p>

    <div v-else-if="appointment">
      <p>
        ID: {{ appointment.id }}
      </p>

      <p>
        Patient ID:
        {{ appointment.patientId }}
      </p>

      <p>
        Reason:
        {{ appointment.reason }}
      </p>

      <p>
        Scheduled at:
        {{ appointment.scheduledAt }}
      </p>

      <button @click="updateAppointment">
        Update Appointment
      </button>

      <button @click="deleteAppointment">
        Delete Appointment
      </button>
    </div>
  </section>
</template>

<style scoped>

</style>