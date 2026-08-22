<script lang="ts">
import Vue from 'vue'
import {
  Appointment,
  DeleteAppointmentData,
  GetAppointmentData,
  UpdateAppointmentData
} from "../../types/types";
import {
  ObservableQuery
} from "@apollo/client";
import {
  apolloClient
} from "../../apollo/apollo";
import {
  GET_APPOINTMENT
} from "../../graphql/appointments/queries/getAppointment";
import {
  UPDATE_APPOINTMENT
} from "../../graphql/appointments/mutations/updateAppointment";
import {
  DELETE_APPOINTMENT
} from "../../graphql/appointments/mutations/deleteAppointment";

export default Vue.extend({
  name: "AppointmentDetails",

  data() {
    return {
      loading: false,
      error: null as Error | null,
      appointment: null as Appointment | null,
      appointmentQuery: null as ObservableQuery<GetAppointmentData> | null,
      subscription: null as ReturnType<ObservableQuery<GetAppointmentData>["subscribe"]> | null,
    }
  },

  props: {
    appointmentId: {
      type: String,
      default: null
    }
  },

  watch: {
    appointmentId: {
      immediate: true,
      handler(id: string | null) {
        if(!id) {
          this.appointment = null
          return
        }
        this.watchAppointment(id)
      }
    }
  },

  beforeDestroy() {
    this.subscription?.unsubscribe()
  },

  methods: {
    watchAppointment(id: string) {
      this.subscription?.unsubscribe()

      this.loading = true
      this.error = null

      this.appointmentQuery = apolloClient.watchQuery<GetAppointmentData>({
        query: GET_APPOINTMENT,
        variables: {
          id
        },
        fetchPolicy: "cache-and-network"
      })

      this.subscription = this.appointmentQuery?.subscribe({
        next: ({ data, loading }) => {
          this.loading = loading

          if(data?.appointment) {
            this.appointment = data.appointment
          }
        },

        error: (error) => {
          this.error = error
          this.loading = false
        }
      })
    },

    // async updateAppointment() {
    //   if(!this.appointment) {
    //     return
    //   }
    //   this.error = null
    //   try {
    //     const { data } = await apolloClient.mutate<UpdateAppointmentData>({
    //       mutation: UPDATE_APPOINTMENT,
    //       variables: {
    //         id: this.appointment.id,
    //         input: {
    //           reason: "Consultation Updated"
    //         }
    //       }
    //     })
    //
    //     if (data?.updateAppointment) {
    //       console.log("Updated appointment",data.updateAppointment)
    //     }
    //   } catch (error) {
    //     this.error = error as Error
    //   }
    // },

    editAppointment() {
      if (!this.appointment) {
        return
      }

      this.$emit("edit", this.appointment)
    },

    async deleteAppointment() {
      if(!this.appointment) {
        return
      }

      const id = this.appointment.id

      await apolloClient.mutate<DeleteAppointmentData>({
        mutation: DELETE_APPOINTMENT,
        variables: {
          id
        },

        update(cache) {
          cache.evict({
            id: cache.identify({
              __typename: "Appointment",
              id
            })
          })
          cache.gc()
        }
      })
      this.appointment = null
    }
  }
})
</script>

<template>
  <section>
    <h1>Appointment</h1>

    <p v-if="loading">
      Loading...
    </p>

    <p v-else-if="error">
      Error: {{ error.message }}
    </p>

    <div v-else-if="appointment">
      <p>
        ID: {{ appointment.id }}
      </p>

      <p>
        Patient ID:
        {{ appointment.patientId }}
      </p>

      <p>
        Reason:
        {{ appointment.reason }}
      </p>

      <p>
        Scheduled at:
        {{ appointment.scheduledAt }}
      </p>
    </div>
    <p v-else>
      Select a appointment
    </p>
    <button
        v-if="appointment"
        @click="editAppointment"
    >
      Edit Appointment
    </button>
  </section>
</template>

<style scoped>

</style>