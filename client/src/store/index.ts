import Vue from "vue";
import Vuex, {StoreOptions} from "vuex";
import patients, {
    PatientsState
} from "./modules/patients";
import appointments, {
    AppointmentsState
} from "./modules/appointments";
import auth from "./modules/auth";

Vue.use(Vuex)

export interface RootState {
    patients: PatientsState;
    appointments: AppointmentsState;
}

const store: StoreOptions<RootState> = {
    modules: {
        patients,
        appointments,
        auth
    }
}

export default new Vuex.Store<RootState>(store)