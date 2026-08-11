<script lang="ts">
import Vue from "vue";
import { GET_PATIENTS } from "./graphql/queries/getPatients";
import { CREATE_PATIENT } from "./graphql/mutations/createPatient";
import { PATIENT_FIELDS } from "./graphql/fragments/patient";
import {apolloClient} from "./apollo/apollo";
import {GET_PATIENT} from "./graphql/queries/getPatient";
import {UPDATE_PATIENT} from "./graphql/mutations/updatePatient";
import {DELETE_PATIENT} from "./graphql/mutations/deletePatient";

export default Vue.extend({
  name: "App",

  data() {
    return {
      patients: [] as Patient[],
      patient: null as Patient | null,
      loading: false,
      error: null as Error | null,
      patientsSubscription: null as any,
    };
  },

  async mounted() {
    await this.getPatients();
    await this.getPatient("2");
  },

  beforeDestroy() {
    this.patientsSubscription?.unsubscribe();
  },

  methods: {
    async getPatients() {
      this.loading = true;

      this.patientsSubscription = apolloClient
          .watchQuery<GetPatientsData>({
            query: GET_PATIENTS,
            returnPartialData: false,
          })
          .subscribe({
            next: ({ data }) => {

              if (!data?.patients) {
                return;
              }
              this.patients = data.patients;
              this.loading = false;
            },

            error: (error) => {
              this.error = error;
              this.loading = false;
            },
          });
    },

    async getPatient(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.query({
          query: GET_PATIENT,
          variables: {
            id
          }
        });
        this.patient = data.patient;
        console.log("patient avec l'id", this.patient);
      } catch (error) {
        this.error = error as Error;
      } finally {
        this.loading = false;
      }
    },

    async createPatient() {
      try {
        const result =
            await apolloClient.mutate<CreatePatientData>({
              mutation: CREATE_PATIENT,

              variables: {
                input: {
                  firstName: "Paul",
                  lastName: "Nzuzi",
                },
              },

              update(cache, { data }) {
                if (!data?.createPatient) {
                  return;
                }

                cache.modify({
                  fields: {
                    patients(existingPatients = []) {
                      const newPatientRef =
                          cache.writeFragment({
                            data: data.createPatient,
                            fragment: PATIENT_FIELDS,
                          });

                      return [
                        ...existingPatients,
                        newPatientRef,
                      ];
                    },
                  },
                });
              },
            });

        console.log(
            "Created patient:",
            result.data?.createPatient
        );
      } catch (error) {
        console.error(
            "Create patient error:",
            error
        );
      }
    },

    async updatePatient(
        id: string,
        input: UpdatePatientInput
    ) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.mutate({
          mutation: UPDATE_PATIENT,
          variables: {
            id,
            input
          }
        });

        this.patient = data?.updatePatient ?? null;

        console.log(
            "Updated patient:",
            this.patient
        );
      } catch (error) {
        this.error = error as Error;
      } finally {
        this.loading = false;
      }
    },

    async deletePatient(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.mutate({
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

        console.log("Deleted patient:", data?.deletePatient);
        if (data?.deletePatient) {
          this.patient = null
        }
      } catch (error) {
        this.error = error as Error;
      } finally {
        this.loading = false;
      }
    }
  },
});
</script>

<template>
  <div>
    <p>Vue 2 + Vuex 3</p>

    <h1>Patients</h1>

    <p v-if="loading">Loading ...</p>

    <p v-else-if="error">
      Error: {{ error.message }}
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

    <button @click="createPatient">
      Create patient
    </button>

    <h1>Patient</h1>
    <div v-if="loading">
      ...Loading
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else-if="patient">
      <p>ID: {{ patient.id }} </p>
      <p>First name: {{ patient.firstName }} </p>
      <p>Last name: {{ patient.lastName }} </p>
    </div>

    <button
        v-if="patient"
        @click="updatePatient(patient?.id, { firstName: 'Aline Updated' })"
    >
      Update patient
    </button>

    <button
        v-if="patient"
        @click="deletePatient(patient.id)"
    >
      Delete Patient
    </button>
  </div>
</template>
