<script lang="ts">
import Vue from 'vue'
import {apolloClient} from "./apollo/apollo";
import {GET_PATIENTS} from "./graphql/queries/getPatients";
import {CREATE_PATIENT} from "./graphql/mutations/createPatient";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

export default Vue.extend({
  data() {
    return {
      patients: [] as Patient[],
      loading: false,
      error: null as Error | null,
    };
  },

  async mounted() {
    await this.getPatients();
  },

  methods: {
    async getPatients() {
      this.loading = true;
      try {
        const { data } = await apolloClient.query<{
          patients: Patient[];
        }>({
          query: GET_PATIENTS
        });
        if(data) {
          this.patients = data.patients;
        }
      } catch (error) {
        this.error = error instanceof Error
            ? error
            : new Error('Unknown error');
      } finally {
        this.loading = false;
      }

      console.log("les patients", this.patients);
    },
    async createPatient() {
      try {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_PATIENT,
          variables: {
            input: {
              firstName: "Paul",
              lastName: "Nzuzi",
            }
          }
        })

        console.log("Created new patient", data)
      } catch (error) {
        console.error("Create patient error", error)
      }
    }
  }
})
</script>

<template>
  <div>
    <h1>Learning GraphQL</h1>

    <p>Vue 2 + Vuex 3</p>

    <h1> Patients </h1>

    <p v-if="loading">Loading ...</p>
    <p v-else-if="error">
      Error : {{ error.message }}
    </p>

    <ul v-else>
      <li
          v-for="patient in patients"
          :key="patient.id"
      >
        {{ patient.firstName }}
        {{ patient.lastName }}
      </li>
    </ul>

    <button
        @click="createPatient"
    >
      Create patient
    </button>
  </div>
</template>

<style scoped>

</style>