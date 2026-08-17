<script lang="ts">
import Vue from "vue";
import PatientList from "./components/patients/PatientList.vue";
import PatientDetails from "./components/patients/PatientDetails.vue";
import AppointmentDetails from "./components/appointments/AppointmentDetails.vue";
import AppointmentList from "./components/appointments/AppointmentList.vue";
import AuthPanel from "./components/auth/AuthPanel.vue";

export default Vue.extend({
  name: "App",

  components: {
    AuthPanel,
    PatientList,
    PatientDetails,
    AppointmentList,
    AppointmentDetails,
  },
});

</script>

<template>
  <section>
    <AuthPanel />
    <p>Vue 2 + Vue 3</p>
    <PatientList />
    <PatientDetails />
    <AppointmentList/>
    <AppointmentDetails />
  </section>
</template>
