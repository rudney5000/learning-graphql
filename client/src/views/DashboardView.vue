<script lang="ts">
import Vue from 'vue'
import AppointmentDetails from "../components/appointments/AppointmentDetails.vue";
import AppointmentList from "../components/appointments/AppointmentList.vue";
import PatientDetails from "../components/patients/PatientDetails.vue";
import PatientList from "../components/patients/PatientList.vue";
import AuthPanel from "../components/auth/AuthPanel.vue";

export default Vue.extend({
  name: "DashboardView",
  components: {
    AuthPanel,
    PatientList,
    PatientDetails,
    AppointmentList,
    AppointmentDetails
  }
})
</script>

<template>
  <section>
    <AuthPanel />
    <p>Patients</p>
    <PatientList />
    <PatientDetails />
    <h1>Appointments</h1>
    <AppointmentList/>
    <AppointmentDetails />
  </section>
</template>

<style scoped>

</style>