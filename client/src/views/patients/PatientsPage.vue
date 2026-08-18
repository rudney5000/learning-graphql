<script lang="ts">
import Vue from 'vue'
import PatientDetails from "../../components/patients/PatientDetails.vue";
import PatientList from "../../components/patients/PatientList.vue";
import PatientForm from "../../components/patients/PatientForm.vue";
import {Patient} from "../../types/types";

export default Vue.extend({
  name: "PatientsPage",
  components: {
    PatientForm,
    PatientList,
    PatientDetails
  },

  data() {
    return {
      showForm: false,
    }
  },

  computed: {
    patient(): Patient | null {
      return this.$store.getters["patients/patient"]
    }
  },

  methods: {
    openCreateForm() {
      this.$store.commit("patients/SET_PATIENT", null)
      this.showForm = true;
    },

    openEditForm() {
      if(!this.patient) {
        return;
      }
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
    }
  }
})
</script>

<template>
  <section>
    <p>Patients</p>

    <button @click="openCreateForm">
      Create Patient
    </button>
    <PatientList />
    <PatientDetails @edit="openEditForm" />

    <div v-if="showForm">
      <PatientForm :patient="patient" @saved="closeForm"/>
      <button @click="closeForm">
        Cancel
      </button>
    </div>
  </section>
</template>

<style scoped>

</style>