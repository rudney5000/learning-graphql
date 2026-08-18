<script lang="ts">
import Vue from 'vue'
import {Patient} from "../../types/types.ts";

export default Vue.extend({
  name: "PatientForm",

  props: {
    patient: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      firstName: "",
      lastName: "",
    }
  },

  watch: {
    patient: {
      immediate: true,

      handler(patient: Patient | null) {
        if(!patient) {
          this.firstName = ""
          this.lastName = ""
          return;
        }

        this.firstName = patient.firstName
        this.lastName = patient.lastName
      }
    }
  },

  computed: {
    loading(): boolean {
      return this.$store.getters["patients/loading"]
    },
    error(): Error | null {
      return this.$store.getters["patients/error"]
    },

    isEditMode(): boolean {
      return !!this.patient
    }
  },

  methods: {
    async submit() {
      if(this.isEditMode && this.patient) {
        await this.$store.dispatch("patients/updatePatient", {
          id: this.patient.id,
          input: {
            firstName: this.firstName,
            lastName: this.lastName,
          }
        })
      } else {
        await this.$store.dispatch("patients/createPatient", {
          firstName: this.firstName,
          lastName: this.lastName,
        })
      }
      await this.$store.dispatch("patients/getPatients");

      this.$emit("Saved")
    }
  }
})
</script>

<template>
  <form @submit.prevent="submit">
    <h2>
      {{ isEditMode ? "Edit Patient" : "Create Patient" }}
    </h2>
    <div>
      <label>First Name</label>
      <input v-model="firstName" type="text" required />
    </div>
    <div>
      <label>Last Name</label>
      <input v-model="lastName" type="text" required />
    </div>
    <button type="submit" :disabled="loading">
      {{ loading ? "Saving..." : "Save" }}
    </button>
    <p v-if="error">
      {{ error.message }}
    </p>
  </form>
</template>

<style scoped>

</style>