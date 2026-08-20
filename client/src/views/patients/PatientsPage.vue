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
      selectedPatientId: null as string | null,
      selectedPatient: null as Patient | null,
      patientToEdit: null as Patient | null,
    }
  },

  methods: {
    openCreateForm() {
      this.patientToEdit = null
      this.showForm = true;
    },

    openEditForm(patient: Patient) {
      this.patientToEdit = patient
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
    },
    selectPatient(id: string) {
      this.selectedPatientId = id;
    }
  }
})
</script>

<template>
  <section>
    <p>Patients</p>

    <button
        @click="openCreateForm"
    >
      Create Patient
    </button>
    <PatientList
        @select="selectPatient"
    />
    <PatientDetails
        :patient-id="selectedPatientId"
        @edit="openEditForm"
    />

    <div
        v-if="showForm"
    >
      <PatientForm
          :patient="patientToEdit"
          @saved="closeForm"
      />
      <button
          @click="closeForm"
      >
        Cancel
      </button>
    </div>
  </section>
</template>

<style scoped>

</style>