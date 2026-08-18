<script lang="ts">
import Vue from 'vue'
import AppointmentDetails from "../../components/appointments/AppointmentDetails.vue";
import AppointmentList from "../../components/appointments/AppointmentList.vue";

export default Vue.extend({
  name: "AppointmentsPage",
  components: {
    AppointmentList,
    AppointmentDetails
  }
})
</script>

<template>
  <section>
    <h1>Appointments</h1>
    <AppointmentList/>
    <AppointmentDetails />
  </section>
</template>

<style scoped>

</style>