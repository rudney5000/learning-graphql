import {
    ActionTree,
    GetterTree,
    MutationTree
} from "vuex";
import {
    apolloClient
} from "../../apollo/apollo";
import {
    GET_PATIENTS
} from "../../graphql/patients/queries/getPatients";
import {
    GET_PATIENT
} from "../../graphql/patients/queries/getPatient";
import {
    CREATE_PATIENT
} from "../../graphql/patients/mutations/createPatient";
import {
    PATIENT_FIELDS
} from "../../graphql/patients/fragments/patient";
import {
    UPDATE_PATIENT
} from "../../graphql/patients/mutations/updatePatient";
import {
    DELETE_PATIENT
} from "../../graphql/patients/mutations/deletePatient";
import {
    RootState
} from "../index";

export interface PatientsState {
    patients: Patient[];
    patient: Patient | null;
    loading: boolean;
    error: Error | null;
}

const state: PatientsState = {
    patients: [],
    patient: null,
    loading: false,
    error: null,
}

const mutations: MutationTree<PatientsState> = {
    SET_LOADING(state, loading: boolean) {
        state.loading = loading
    },

    SET_ERROR(state, error: Error | null) {
        state.error = error
    },

    SET_PATIENTS(state, patients: Patient[]) {
        state.patients = patients
    },

    SET_PATIENT(state, patient: Patient | null) {
        state.patient = patient
    }
}

const actions: ActionTree<PatientsState, RootState> = {
    async getPatients({ commit }) {
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const result = await apolloClient.query<GetPatientsData>({
                query: GET_PATIENTS,
            });

            if(!result.data) return
            commit("SET_PATIENTS", result.data.patients)
        } catch (e) {
            commit("SET_ERROR", e as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async getPatient({ commit }, id: string) {
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const { data } = await apolloClient.query<GetPatientData>({
                query: GET_PATIENT,
                variables: {
                    id
                }
            });

            if(!data) return

            commit("SET_PATIENT", data.patient)
        } catch (e) {
            commit("SET_ERROR", e as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async createPatient({ commit }, input: CreatePatientInput) {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);
        try {
            const { data } = await apolloClient.mutate<CreatePatientData>({
                mutation: CREATE_PATIENT,
                variables: {
                    input
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
                                        fragment: PATIENT_FIELDS
                                    });

                                return [
                                    ...existingPatients,
                                    newPatientRef
                                ]
                            }
                        }
                    })
                }
            })
            console.log("Created patient:", data?.createPatient);
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async updatePatient(
        { commit },
        payload: {
            id: string,
            input: UpdatePatientInput
        }
    ){
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const { data } = await apolloClient.mutate<UpdatePatientData>({
                mutation: UPDATE_PATIENT,
                variables: {
                    id: payload.id,
                    input: payload.input
                }
            });

            commit("SET_PATIENT", data?.updatePatient);

            console.log(
                "Updated patient",
                data?.updatePatient
            )
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async deletePatient({ commit }, id: string) {
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const { data } = await apolloClient.mutate<DeletePatientData>({
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
            if(data?.deletePatient) {
                commit("SET_PATIENT", null)
            }
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    }

}

const getters: GetterTree<PatientsState, RootState> = {
    patients: (state) => state.patients,
    patient: (state) => state.patient,
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