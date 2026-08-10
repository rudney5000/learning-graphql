<script lang="ts">
import Vue from 'vue'
import {apolloClient} from "./apollo.ts";
import {GET_PATIENTS} from "./graphql/queries/getPatients.ts";

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
    console.log('Component mounted.', this.patients)
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
  </div>
</template>

<style scoped>

</style>