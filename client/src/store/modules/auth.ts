import {
    ActionTree,
    GetterTree,
    MutationTree
} from "vuex";
import {
    RootState
} from "../index";
import {
    apolloClient
} from "../../apollo/apollo";
import {
    LOGIN
} from "../../graphql/auth/mutations/login";

interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    error: Error | null;
}

const state: AuthState = {
    token: localStorage.getItem("access_token"),
    user: null,
    loading: false,
    error: null,
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

    LOGOUT(state) {
        state.token = null
        state.user = null
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

            const {
                token,
                user
            } = data.login

            localStorage.setItem("access_token", token)

            commit("SET_AUTH", { token, user })
        } catch (error) {
            commit("SET_ERROR", error as Error)
        } finally {
            commit("SET_LOADING", false)
        }
    },

    logout({ commit }) {
        localStorage.removeItem("access_token");

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
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}