<script lang="ts">
import Vue from 'vue'
import {
  Appointment,
  CreateAppointmentData,
  GetPatientsData,
  Patient,
  UpdateAppointmentData
} from "../../types/types";
import {
  apolloClient
} from "../../apollo/apollo";
import {
  UPDATE_APPOINTMENT
} from "../../graphql/appointments/mutations/updateAppointment";
import {
  APPOINTMENT_FIELDS
} from "../../graphql/appointments/fragments/appointment";
import {
  ObservableQuery, Reference
} from "@apollo/client";
import {
  GET_PATIENTS
} from "../../graphql/patients/queries/getPatients";
import {
  CREATE_APPOINTMENT
} from "../../graphql/appointments/mutations/createAppointment";

export default Vue.extend({
  name: "AppointmentForm",

  props: {
    appointment: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      patientId: "",
      scheduledAt: "",
      reason: "",
      loading: false,
      error: null as Error | null,

      patients: [] as Patient[],
      patientsQuery: null as ObservableQuery<GetPatientsData> | null
    }
  },

  mounted() {
    this.watchPatients()
  },

  watch: {
    appointment: {
      immediate: true,

      handler(appointment: Appointment | null)  {
        if(!appointment) {
          this.patientId = ""
          this.scheduledAt = ""
          this.reason = ""
          return;
        }

        this.patientId = appointment.patientId;
        this.scheduledAt = appointment.scheduledAt
        this.reason = appointment.reason
      }
    }
  },

  computed: {
    isEditMode(): boolean {
      return !!this.appointment
    }
  },

  beforeDestroy() {
    this.patientsQuery?.stopPolling()
  },

  methods: {
    async submit() {
      this.loading = true;
      this.error = null;

      try {
        if (this.isEditMode && this.appointment) {
          const { data } = await apolloClient.mutate<UpdateAppointmentData>({
            mutation: UPDATE_APPOINTMENT,
            variables: {
              id: this.appointment.id,
              input: {
                patientId: this.patientId,
                scheduledAt: this.scheduledAt,
                reason: this.reason
              }
            }
          })

          if (data?.updateAppointment) {
            console.log("Updated appointment",data.updateAppointment)
          }
        } else {
          const { data } = await apolloClient.mutate<CreateAppointmentData>({
            mutation: CREATE_APPOINTMENT,
            variables: {
              input: {
                patientId: this.patientId,
                scheduledAt: this.scheduledAt,
                reason: this.reason
              }
            },
            update(cache, {data}) {
              if (!data?.createAppointment) {
                return;
              }

              const newAppointment = data.createAppointment

              const newAppointmentRef = cache.writeFragment({
                data: newAppointment,
                fragment: APPOINTMENT_FIELDS
              });

              const patientCacheId = cache.identify({
                __typename: "Patient",
                id: newAppointment.patientId
              })

              if(patientCacheId) {
                cache.modify({
                  id: patientCacheId,
                  fields: {
                    appointments(existingAppointments = [], { readField }) {
                      const exists = existingAppointments.some(
                          (appointmentRef: Reference) =>
                              readField("id", appointmentRef) === newAppointment.id
                      )

                      if(exists) {
                        return existingAppointments
                      }

                      return [
                        ...existingAppointments,
                        newAppointmentRef
                      ]
                    }
                  }
                })
              }

              cache.modify({
                fields: {
                  appointments(existingAppointments = [], { readField }) {
                    const exists = existingAppointments.some(
                        (appointmentRef: Reference) =>
                            readField("id", appointmentRef) === newAppointment.id
                    )

                    if(exists) {
                      return existingAppointments
                    }

                    return [
                      ...existingAppointments,
                      newAppointmentRef
                    ]
                  }
                }
              })
            }
          })
          console.log("Created appointment",data?.createAppointment)
        }
        this.$emit("saved")
      } catch (error) {
        this.error = error as Error;
      } finally {
        this.loading = false;
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
  }
})
</script>

<template>
  <div>
    <label>Patient</label>

    <select v-model="patientId" required>
      <option value="" disabled>
        Select a patient
      </option>

      <option
          v-for="patient in patients"
          :key="patient.id"
          :value="patient.id"
      >
        {{ patient.firstName }} {{ patient.lastName }}
      </option>
    </select>

    <form @submit.prevent="submit">
      <h2>
        {{ isEditMode ? "Edit Appointment" : "Create Appointment" }}
      </h2>
      <div>
        <label>Patient ID</label>
        <input v-model="patientId" type="text" />
      </div>
      <div>
        <label>ScheduledAt</label>
        <input v-model="scheduledAt" type="text" required />
      </div>
      <div>
        <label>Reason</label>
        <input v-model="reason" type="text" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Save" }}
      </button>
      <p v-if="error">
        {{ error.message }}
      </p>
    </form>
  </div>

</template>

<style scoped>

</style>