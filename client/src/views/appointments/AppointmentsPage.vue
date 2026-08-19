<script lang="ts">
import Vue from 'vue'
import AppointmentDetails from "../../components/appointments/AppointmentDetails.vue";
import AppointmentList from "../../components/appointments/AppointmentList.vue";
import {Appointment} from "../../types/types.ts";
import AppointmentForm from "../../components/appointments/AppointmentForm.vue";

export default Vue.extend({
  name: "AppointmentsPage",
  components: {
    AppointmentForm,
    AppointmentList,
    AppointmentDetails
  },

  data() {
    return {
      showForm: false
    }
  },

  computed: {
    appointment(): Appointment | null {
      return this.$store.getters["appointments/appointment"];
    }
  },

  methods: {
    openCreateForm() {
      this.$store.commit("appointments/SET_APPOINTMENT", null);
      this.showForm = true;
    },

    openEditForm() {
      if(!this.appointment){
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
    <h1>Appointments</h1>

    <button @click="openCreateForm">
      Create Appointment
    </button>
    <AppointmentList/>
    <AppointmentDetails @edit="openEditForm"/>
    <div v-if="showForm">
      <AppointmentForm
          :appointment="appointment"
          @saved="closeForm"
      />
      <button @click="closeForm">
        Cancel
      </button>
    </div>
  </section>
</template>

<style scoped>

</style>