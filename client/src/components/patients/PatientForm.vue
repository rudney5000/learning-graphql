<script lang="ts">
import Vue from 'vue'
import {
  CreatePatientData,
  Patient,
  UpdatePatientData
} from "../../types/types";
import {
  apolloClient
} from "../../apollo/apollo";
import {
  UPDATE_PATIENT
} from "../../graphql/patients/mutations/updatePatient";
import {
  CREATE_PATIENT
} from "../../graphql/patients/mutations/createPatient";
import {
  PATIENT_FIELDS
} from "../../graphql/patients/fragments/patient";

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
      loading: false,
      error: null as Error | null,
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
    isEditMode(): boolean {
      return !!this.patient
    }
  },

  methods: {
    async submit() {
      this.loading = true;
      this.error = null;

      try {
        if(this.isEditMode && this.patient) {
          const { data } = await apolloClient.mutate<UpdatePatientData>({
            mutation: UPDATE_PATIENT,
            variables: {
              id: this.patient.id,
              input: {
                firstName: this.firstName,
                lastName: this.lastName
              }
            }
          })

          console.log("Updated patient:", data?.updatePatient)
        } else {
          const { data } = await apolloClient.mutate<CreatePatientData>({
            mutation: CREATE_PATIENT,
            variables: {
              input: {
                firstName: this.firstName,
                lastName: this.lastName
              }
            },
            update(cache, {data}) {
              if (!data?.createPatient) {
                return;
              }

              const newPatientRef = cache.writeFragment({
                  data: data.createPatient,
                  fragment: PATIENT_FIELDS
              });

              cache.modify({
                fields: {
                  patients(existingPatients = []) {
                    return [
                      ...existingPatients,
                      newPatientRef
                    ]
                  }
                }
              })
            }
          })
          console.log("Created patient:", data?.createPatient)
        }
        this.$emit("saved")
      } catch (error) {
        this.error = error as Error;
      } finally {
        this.loading = false;
      }
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