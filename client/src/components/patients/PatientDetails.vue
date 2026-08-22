<script lang="ts">
import Vue from 'vue'
import {
  DeletePatientData,
  GetPatientData,
  Patient,
  UpdatePatientData
} from "../../types/types";
import {
  ObservableQuery
} from "@apollo/client";
import {
  apolloClient
} from "../../apollo/apollo";
import {
  GET_PATIENT
} from "../../graphql/patients/queries/getPatient";
import {
  UPDATE_PATIENT
} from "../../graphql/patients/mutations/updatePatient";
import {
  DELETE_PATIENT
} from "../../graphql/patients/mutations/deletePatient";

export default Vue.extend({
  name: "PatientDetails",

  props: {
    patientId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      patient: null as Patient | null,
      loading: false,
      error: null as Error | null,
      patientQuery: null as ObservableQuery<GetPatientData> | null,
    }
  },

  watch: {
    patientId: {
      immediate: true,

      handler(id: string | null) {
        if (!id) {
          this.patient = null;
          return;
        }
        this.watchPatient(id);
      }
    }
  },

  beforeDestroy() {
    this.patientQuery?.stopPolling()
  },

  methods: {
    watchPatient(id: string) {
      this.patientQuery?.stopPolling()

      this.loading = true;
      this.error = null;

      this.patientQuery = apolloClient.watchQuery<GetPatientData>({
        query: GET_PATIENT,
        variables: {
          id
        },
        fetchPolicy: "cache-and-network"
      })

      this.patientQuery?.subscribe({
        next: ({ data, loading }) => {
          this.loading = loading;

          if(data) {
            this.patient = data.patient;
          }
          console.log("PATIENT",data?.patient)
        },

        error: (error) => {
          this.error = error;
          this.loading = false;
        }
      })
    },

    async updatePatient() {
      if(!this.patient) {
        return;
      }

      this.error = null;
      try {
        const { data } = await apolloClient.mutate<UpdatePatientData>({
          mutation: UPDATE_PATIENT,
          variables: {
            id: this.patient.id,
            input: {
              firstName: "Aline Updated"
            }
          }
        })

        if (data?.updatePatient) {
          console.log("Updated patient", data.updatePatient)
        }
      } catch (error) {
        this.error = error as Error;
      }
    },

    async deletePatient() {
      if(!this.patient) {
        return;
      }

      const id = this.patient.id;

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
          })
          cache.gc()
        }
      })
      this.patient = null
    }
  }
})
</script>

<template>
  <section>
    <h1>Patient</h1>
    <div v-if="loading">
      ...Loading
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else-if="patient">
      <p>
        ID: {{ patient.id }}
      </p>
      <p>
        First name: {{ patient.firstName }}
      </p>
      <p>
        Last name: {{ patient.lastName }}
      </p>

      <h2>Appointments</h2>
      <ul v-if="patient.appointments?.length">
        <li
            v-for="appointment in patient.appointments"
            :key="appointment.id"
        >
          <strong>
            {{ appointment.reason }}
          </strong>
          -
          {{ appointment.scheduledAt }}
        </li>
      </ul>
      <p v-else>
        No appointments
      </p>
    </div>
    <p v-else>
      Select a patient
    </p>

    <button
        v-if="patient"
        @click="updatePatient"
    >
      Edit Patient
    </button>
  </section>
</template>

<style scoped>

</style>