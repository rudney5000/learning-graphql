import {
    ActionTree,
    GetterTree,
    MutationTree
} from "vuex";
import {
    apolloClient
} from "../../apollo/apollo";
import {
    LOGIN
} from "../../graphql/auth/mutations/login";
import {
    ME
} from "../../graphql/auth/queries/me";
import {
    LoginData,
    LoginInput,
    MeData,
    User
} from "../../types/types";
import {
    RootState
} from "../index";

export function getAccessToken(): string | null {
    return localStorage.getItem("access_token");
}

export function setAccessToken(token: string): void {
    localStorage.setItem("access_token", token);
}

export function clearAccessToken(): void {
    localStorage.removeItem("access_token");
}

export interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: Error | null;
    initialized: boolean;
}

const state: AuthState = {
    token: localStorage.getItem("access_token"),
    user: null,
    loading: false,
    error: null,
    initialized: false
}

const mutations: MutationTree<AuthState> = {
    SET_LOADING(state, loading: boolean) {
        state.loading = loading
    },

    SET_ERROR(state, error: Error | null) {
        state.error = error
    },

    SET_AUTH(
        state,
        payload: {
            token: string
            user: User
        }
    ) {
        state.token = payload.token
        state.user = payload.user
    },

    SET_USER(state, user: User | null){
        state.user = user
    },

    LOGOUT(state) {
        state.token = null
        state.user = null
    },

    SET_INITIALIZED(state, initialized: boolean) {
        state.initialized = initialized
    }
}

const actions: ActionTree<AuthState, RootState> = {
    async login(
        { commit },
        input: LoginInput
    ){
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {
            const { data } = await apolloClient.mutate<LoginData>({
                mutation: LOGIN,
                variables: input,
            });

            if (!data) {
                return
            }

            const { token, user } = data.login
            setAccessToken(token)
            commit("SET_AUTH", {
                token,
                user
            })

            commit("SET_INITIALIZED", true)
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    async me ({ commit }){
        commit("SET_LOADING", true)
        commit("SET_ERROR", null)

        try {

            const { data } = await apolloClient.query<MeData>({
                query: ME,
                fetchPolicy: "network-only"
            })

            if (!data?.me) {
                clearAccessToken()
                commit("LOGOUT")
                return
            }

            commit("SET_USER",  data.me)
        } catch (error) {
            clearAccessToken()

            commit("LOGOUT")
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_INITIALIZED", true)
            commit("SET_LOADING", false)
        }
    },

    logout({ commit }) {
        clearAccessToken()
        commit("LOGOUT");
    }
}

const getters: GetterTree<AuthState, RootState> = {
    token: (state) => state.token,
    user: (state) => state.user,
    loading: (state) => state.loading,
    error: (state) => state.error,

    isAuthenticated: (state) => {
        return !!state.token;
    },
    initialized: (state) => state.initialized
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}