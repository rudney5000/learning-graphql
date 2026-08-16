<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data() {
    return {};
  },

  computed: {
    appointments(): Appointment[] {
      return this.$store.getters["appointments/appointments"]
    },

    appointment(): Appointment | null{
      return this.$store.getters["appointments/appointment"]
    },

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

    appointmentsLoading(): boolean {
      return this.$store.getters["appointments/loading"];
    },

    appointmentsError(): Error | null {
      return this.$store.getters["appointments/error"];
    },
  },

  async mounted() {
    await this.$store.dispatch("patients/getPatients")
    await this.$store.dispatch("patients/getPatient", "2")
    await this.$store.dispatch("appointments/getAppointment", "a2")
    await this.$store.dispatch("appointments/getAppointments")
    await this.createPatient()
    await this.updatePatient()
    await this.deletePatient()
    await this.createAppointment()
    await this.updateAppointment()
    await this.deleteAppointment()
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
    },

    createAppointment() {
      return this.$store.dispatch("appointments/createAppointment", {
        patientId: "2",
        scheduledAt: new Date().toISOString(),
        reason: "Consultation"
      })
    },
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
    }
  },
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

    <h1> Appointments </h1>
    <div v-if="appointmentsLoading">
      Loading appointments ...
    </div>
    <div v-else-if="appointmentsError">
      Error: {{ appointmentsError.message }}
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
    <button v-if="appointment" @click="updateAppointment">
      Update Appointment
    </button>
    <button v-if="appointment" @click="deleteAppointment">
      Delete Appointment
    </button>
  </div>
</template>
