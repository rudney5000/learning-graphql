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
  ObservableQuery,
  Reference
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
          const previousPatientId = this.appointment.patientId

          const { data } = await apolloClient.mutate<UpdateAppointmentData>({
            mutation: UPDATE_APPOINTMENT,

            variables: {
              id: this.appointment.id,
              input: {
                patientId: this.patientId,
                scheduledAt: this.scheduledAt,
                reason: this.reason
              }
            },

            update(cache, { data }) {
              const updatedAppointment = data?.updateAppointment

              if (!updatedAppointment) {
                return;
              }

              const appointmentRef = cache.writeFragment({
                data: updatedAppointment,
                fragment: APPOINTMENT_FIELDS
              });

              cache.modify({
                fields: {
                  appointments(existingConnection, { readField }) {
                    if(!existingConnection) {
                      return existingConnection
                    }

                    const existingItems = existingConnection.items ?? []

                    const items = existingItems.filter(
                        (ref: Reference) =>
                            readField("id", ref) !== updatedAppointment.id
                    )

                    items.push(appointmentRef)

                    items.sort((a: Reference, b: Reference) => {
                      const dateA = readField<string>("scheduledAt", a)
                      const dateB = readField<string>("scheduledAt", b)

                      return (
                          new Date(dateA ?? "").getTime() -
                          new Date(dateB ?? "").getTime()
                      )
                    })
                    return {
                      ...existingConnection,
                      items
                    }
                  }
                }
              })

              const previousPatientCacheId = cache.identify({
                __typename: "Patient",
                id: previousPatientId
              })

              if(previousPatientCacheId) {
                cache.modify({
                  id: previousPatientCacheId,
                  fields: {
                    appointments(existingAppointments = [], { readField }) {
                      return existingAppointments.filter(
                          (appointmentRef: Reference) =>
                              readField("id", appointmentRef) !== updatedAppointment.id
                      )
                    }
                  }
                })
              }

              const newPatientCacheId = cache.identify({
                __typename: "Patient",
                id: updatedAppointment.patientId
              })

              if(newPatientCacheId) {
                cache.modify({
                  id: newPatientCacheId,
                  fields: {
                    appointments(existingAppointments = [], { readField }) {
                      const appointments = existingAppointments.filter(
                          (appointmentRef: Reference) =>
                              readField("id", appointmentRef) !== updatedAppointment.id
                      )

                      appointments.push(appointmentRef)

                      appointments.sort((a: Reference, b: Reference) => {
                        const dateA = readField<string>("scheduledAt", a)
                        const dateB = readField<string>("scheduledAt", b)

                        return (
                            new Date(dateA ?? "").getTime() -
                            new Date(dateB ?? "").getTime()
                        )
                      })
                      return appointments
                    }
                  }
                })
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
              const newAppointment = data?.createAppointment
              if (!newAppointment) {
                return;
              }

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
                      const alreadyExists = existingAppointments.some(
                          (appointmentRef: Reference) =>
                              readField("id", appointmentRef) === newAppointment.id
                      )

                      if(alreadyExists) {
                        return existingAppointments
                      }

                      const appointments = [
                        ...existingAppointments,
                        newAppointmentRef
                      ]

                      appointments.sort((a, b) => {
                        const dateA = readField<string>("scheduledAt", a)
                        const dateB = readField<string>("scheduledAt", b)

                        return (
                            new Date(dateA ?? "").getTime() -
                            new Date(dateB ?? "").getTime()
                        )
                      })

                      return appointments
                    }
                  }
                })
              }

              cache.modify({
                fields: {
                  appointments(existingConnection, { readField }) {
                    if(!existingConnection) {
                      return existingConnection
                    }

                    const existingItems = existingConnection.items ?? []

                    const alreadyExists = existingItems.some(
                        (appointmentRef: Reference) =>
                            readField("id", appointmentRef) === newAppointment.id
                    )

                    if(alreadyExists) {
                      return existingConnection
                    }

                    const items = [
                      ...existingItems,
                      newAppointmentRef
                    ]

                    items.sort((a: Reference, b: Reference) => {
                      const dateA = readField<string>("scheduledAt", a)
                      const dateB = readField<string>("scheduledAt", b)

                      return (
                          new Date(dateA ?? "").getTime() -
                          new Date(dateB ?? "").getTime()
                      )
                    })
                    return {
                      ...existingConnection,
                      items,
                      total: existingConnection.total + 1
                    }
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