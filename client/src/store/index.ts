import Vue from "vue";
import Vuex, {StoreOptions} from "vuex";
import auth, {AuthState} from "./modules/auth";

Vue.use(Vuex)

export interface RootState {
    auth: AuthState;
}

const store: StoreOptions<RootState> = {
    modules: {
        auth
    }
}

export default new Vuex.Store<RootState>(store)