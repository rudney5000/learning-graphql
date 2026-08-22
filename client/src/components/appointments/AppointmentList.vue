<script lang="ts">
import Vue  from 'vue'
import {
  Appointment,
  DeleteAppointmentData,
  GetAppointmentsData
} from "../../types/types";
import {
  ObservableQuery
} from "@apollo/client";
import {
  apolloClient} from "../../apollo/apollo";
import {
  DELETE_APPOINTMENT
} from "../../graphql/appointments/mutations/deleteAppointment";
import {
  GET_APPOINTMENTS
} from "../../graphql/appointments/queries/getAppointments";

export default Vue.extend({
  name: "AppointmentList",

  data() {
    return {
      loading: false,
      error: null as Error | null,
      appointments: [] as Appointment[],
      currentPage: 1,
      limit: 2,
      hasNext: false,
      appointmentsQuery: null as ObservableQuery<GetAppointmentsData> | null,
      subscription: null as ReturnType<ObservableQuery<GetAppointmentsData>["subscribe"]> | null,
    }
  },

  mounted() {
    this.watchAppointments()
  },

  beforeDestroy() {
    this.appointmentsQuery?.stopPolling()
  },

  methods: {
    selectAppointment(id: string) {
      this.$emit("select", id)
    },
    async deleteAppointment(id: string) {
      try {
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
            });
            cache.gc()
          }
        })
      } catch (error) {
        this.error = error as Error;
      }
    },

    async loadMore() {
      if (!this.appointmentsQuery) {
        return;
      }

      if (!this.hasNext) {
        return;
      }

      await this.appointmentsQuery.fetchMore({
        variables: {
          page: this.currentPage + 1,
          limit: this.limit,
        }
      })
      this.currentPage++
    },

    watchAppointments() {
      this.appointmentsQuery = apolloClient.watchQuery<GetAppointmentsData>({
        query: GET_APPOINTMENTS,
        variables: {
          page: this.currentPage,
          limit: this.limit
        },
        fetchPolicy: "cache-and-network",
        returnPartialData: false
      })

      this.subscription = this.appointmentsQuery.subscribe({
        next: ({ data, loading }) => {
          this.loading = loading

          if (data?.appointments) {
            this.appointments = data.appointments.items
            this.hasNext = data.appointments.hasNext
          }
        },
        error: (error) => {
          this.error = error as Error;
          this.loading = false;
        }
      })
    },
  },


})
</script>

<template>
  <section>
    <h1> Appointments </h1>
    <div v-if="loading">
      Loading appointments ...
    </div>
    <div v-else-if="error">
      Error: {{ error.message }}
    </div>
    <ul v-else>
      <li
          v-for="appointment in appointments"
          :key="appointment.id"
      >
        <strong>{{ appointment.reason }}</strong>
        -
        {{ appointment.scheduledAt }}
        -
        Patient ID: {{ appointment.patientId }}

        <button @click="selectAppointment(appointment.id)">
          View
        </button>

        <button @click="deleteAppointment(appointment.id)">
          Delete
        </button>
      </li>
    </ul>

    <button
        v-if="hasNext"
        @click="loadMore"
    >
      Load More
    </button>
  </section>
</template>

<style scoped>

</style>