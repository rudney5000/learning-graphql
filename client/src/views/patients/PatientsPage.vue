<script lang="ts">
import Vue from 'vue'
import PatientDetails from "../../components/patients/PatientDetails.vue";
import PatientList from "../../components/patients/PatientList.vue";

export default Vue.extend({
  name: "PatientsPage",
  components: {
    PatientList,
    PatientDetails
  }
})
</script>

<template>
  <section>
    <p>Patients</p>
    <PatientList />
    <PatientDetails />
  </section>
</template>

<style scoped>

</style>