<script lang="ts">
import Vue from 'vue'
import {
  Appointment,
  Patient
} from "../../types/types";

export default Vue.extend({
  name: "AppointmentForm",

  props: {
    appointment: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      patientId: "",
      scheduleAt: "",
      reason: ""
    }
  },

  watch: {
    appointment: {
      immediate: true,

      handler(appointment: Appointment | null)  {
        if(!appointment) {
          this.patientId = ""
          this.scheduleAt = ""
          this.reason = ""
          return;
        }

        this.patientId = appointment.patientId;
        this.scheduleAt = appointment.scheduledAt
        this.reason = appointment.reason
      }
    }
  },

  computed: {
    patients(): Patient[] {
      return this.$store.getters["patients/patients"]
    },
    loading(): boolean {
      return this.$store.getters["appointments/loading"]
    },
    error(): Error | null {
      return this.$store.getters["appointments/error"]
    },

    isEditMode(): boolean {
      return !!this.appointment
    }
  },

  async mounted() {
    await this.$store.dispatch("patients/getPatients")
  },

  methods: {
    async submit() {
      if(this.isEditMode && this.appointment) {
        await this.$store.dispatch("appointments/updateAppointment", {
          id: this.appointment.id,
          input: {
            patientId: this.patientId,
            scheduledAt: this.scheduleAt,
            reason: this.reason,
          }
        })
      } else {
        await this.$store.dispatch("appointments/createAppointment", {
          patientId: this.patientId,
          scheduledAt: this.scheduleAt,
          reason: this.reason,
        })
      }

      await this.$store.dispatch("appointments/getAppointments")

      this.$emit("saved")
    }
  }
})
</script>

<template>
  <div>
    <label>Patient</label>

    <select v-model="patientId" required>
      <option value="" disabled>
        Select a patient
      </option>

      <option
          v-for="patient in patients"
          :key="patient.id"
          :value="patient.id"
      >
        {{ patient.firstName }} {{ patient.lastName }}
      </option>
    </select>

    <form @submit.prevent="submit">
      <h2>
        {{ isEditMode ? "Edit Appointment" : "Create Appointment" }}
      </h2>
      <div>
        <label>Patient ID</label>
        <input v-model="patientId" type="text" />
      </div>
      <div>
        <label>ScheduleAt</label>
        <input v-model="scheduleAt" type="text" required />
      </div>
      <div>
        <label>Reason</label>
        <input v-model="reason" type="text" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Save" }}
      </button>
      <p v-if="error">
        {{ error.message }}
      </p>
    </form>
  </div>

</template>

<style scoped>

</style>