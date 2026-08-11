import Vue from "vue";
import Vuex from "vuex";
import patients from "./modules/patients";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        patients
    }
})