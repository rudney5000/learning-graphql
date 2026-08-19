<script lang="ts">
import Vue from 'vue'
import {Appointment} from "../../types/types";

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
    </div>
    <p v-else>
      Select a appointment
    </p>
    <button
        v-if="appointment"
        @click="$emit('edit')"
    >
      Edit Appointment
    </button>
  </section>
</template>

<style scoped>

</style>