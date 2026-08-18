import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJyb2xlIjoiRE9DVE9SIiwiaWF0IjoxNzg2MzEyNTM5fQ.KoteCxvpfy_0N5fO8hhUj34Z5rFV5Hfhb4DViAvjT1I"
localStorage.setItem("access_token", token)

new Vue({
    store,
    router,
    render: (h) => h(App),
}).$mount("#app");