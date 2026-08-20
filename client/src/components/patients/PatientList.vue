<script lang="ts">
import Vue from 'vue'
import {
  DeletePatientData,
  GetPatientsData,
  Patient
} from "../../types/types";
import {ObservableQuery} from "@apollo/client";
import {
  apolloClient
} from "../../apollo/apollo";
import {
  GET_PATIENTS
} from "../../graphql/patients/queries/getPatients";
import {
  DELETE_PATIENT
} from "../../graphql/patients/mutations/deletePatient";

export default Vue.extend({
  name: "PatientList",

  data() {
    return {
      patients: [] as Patient[],
      loading: false,
      error: null as Error | null,
      patientsQuery: null as ObservableQuery<GetPatientsData> | null
    }
  },

  mounted() {
    this.watchPatients()
  },

  beforeDestroy() {
    this.patientsQuery?.stopPolling()
  },

  methods: {
    selectPatient(id: string) {
      this.$emit("select", id)
    },
    async deletePatient(id: string) {
      try {
        await apolloClient.mutate<DeletePatientData>({
          mutation: DELETE_PATIENT,
          variables: {
            id
          },
          update(cache) {
            cache.evict({
              id: cache.identify({
                __typename: "Patient",
                id
              })
            });
            cache.gc()
          }
        });
      } catch (error) {
        this.error = error as Error;
      }
    },

    watchPatients() {
      this.patientsQuery = apolloClient.watchQuery<GetPatientsData>({
        query: GET_PATIENTS,
        fetchPolicy: "cache-and-network",
        returnPartialData: false
      })

      this.patientsQuery.subscribe({
        next: ({ data, loading }) => {
          this.loading = loading;


          if (data?.patients) {
            this.patients = data.patients;
          }
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      })
    },
  },
})
</script>

<template>
  <section>
    <h1>Patients</h1>

    <p v-if="loading">
      Loading patients...
    </p>

    <p v-else-if="error">
      Error: {{ error.message }}
    </p>

    <ul v-else>
      <li
          v-for="patient in patients"
          :key="patient.id"
      >
        <span>
          {{ patient.firstName }}
          {{ patient.lastName }}
        </span>

        <button @click="selectPatient(patient.id)">
          View
        </button>
        <button @click="deletePatient(patient.id)">
          Delete
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>

</style>