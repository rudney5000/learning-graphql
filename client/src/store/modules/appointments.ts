import {
    ActionTree,
    GetterTree,
    MutationTree
} from "vuex";
import {
    apolloClient
} from "../../apollo/apollo";
import {
    GET_APPOINTMENTS
} from "../../graphql/appointments/queries/getAppointments";
import {
    GET_APPOINTMENT
} from "../../graphql/appointments/queries/getAppointment";
import {
    CREATE_APPOINTMENT
} from "../../graphql/appointments/mutations/createAppointment";
import {
    APPOINTMENT_FIELDS
} from "../../graphql/appointments/fragments/appointment";
import {
    UPDATE_APPOINTMENT
} from "../../graphql/appointments/mutations/updateAppointment";
import {
    DELETE_APPOINTMENT
} from "../../graphql/appointments/mutations/deleteAppointment";
import {
    RootState
} from "../index";
import {
    Appointment,
    CreateAppointmentData,
    CreateAppointmentInput,
    DeleteAppointmentData,
    GetAppointmentData,
    GetAppointmentsData,
    UpdateAppointmentData,
    UpdateAppointmentPayload
} from "../../types/types";

export interface AppointmentsState {
    appointments: Appointment[];
    appointment: Appointment | null;
    loading: boolean;
    error: Error | null;
}

const state: AppointmentsState = {
    appointments: [],
    appointment: null,
    loading: false,
    error: null,
}

const mutations: MutationTree<AppointmentsState> = {
    SET_LOADING(state, loading: boolean) {
        state.loading = loading
    },

    SET_ERROR(state, error: Error | null) {
        state.error = error
    },

    SET_APPOINTMENTS(state, appointments: Appointment[]) {
        state.appointments = appointments
    },

    SET_APPOINTMENT(state, appointment: Appointment | null) {
        state.appointment = appointment
    }
}

const actions: ActionTree<AppointmentsState, RootState> = {
    async getAppointments({ commit }) {
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const result = await apolloClient.query<GetAppointmentsData>({
                query: GET_APPOINTMENTS,
            });

            if(!result.data) return
            commit("SET_APPOINTMENTS", result.data.appointments)
        } catch (e) {
            commit("SET_ERROR", e as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async getAppointment({ commit }, id: string){
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const { data } = await apolloClient.query<GetAppointmentData>({
                query: GET_APPOINTMENT,
                variables: {
                    id
                }
            });

            if(!data) return

            commit("SET_APPOINTMENT", data.appointment)
        } catch (e) {
            commit("SET_ERROR", e as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async createAppointment({ commit }, input: CreateAppointmentInput) {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);
        try {
            const { data } = await apolloClient.mutate<CreateAppointmentData>({
                mutation: CREATE_APPOINTMENT,
                variables: {
                    input
                },
                update(cache, { data }) {
                    if (!data?.createAppointment) {
                        return;
                    }
                    cache.modify({
                        fields: {
                            appointments(existingAppointments = []) {
                                const newPatientRef =
                                    cache.writeFragment({
                                        data: data.createAppointment,
                                        fragment: APPOINTMENT_FIELDS
                                    });

                                return [
                                    ...existingAppointments,
                                    newPatientRef
                                ]
                            }
                        }
                    })
                }
            })
            console.log("Created appointment:", data?.createAppointment);
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async updateAppointment(
        { commit },
        payload: UpdateAppointmentPayload
    ){
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const { data } = await apolloClient.mutate<UpdateAppointmentData>({
                mutation: UPDATE_APPOINTMENT,
                variables: {
                    id: payload.id,
                    input: payload.input
                }
            });

            if (!data?.updateAppointment){
                return
            }

            commit("SET_APPOINTMENT", data.updateAppointment);

            console.log(
                "Updated appointment",
                data?.updateAppointment
            )
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async deleteAppointment({ commit }, id: string) {
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const { data } = await apolloClient.mutate<DeleteAppointmentData>({
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
            });

            console.log("Deleted appointment:", data?.deleteAppointment);
            if(data?.deleteAppointment) {
                commit("SET_APPOINTMENT", null)
            }
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    }
}

const getters: GetterTree<AppointmentsState, RootState> = {
    appointments: (state) => state.appointments,
    appointment: (state) => state.appointment,
    loading: (state) => state.loading,
    error: (state) => state.error,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}