import Vue from "vue";
import VueRouter, {Route, RouteConfig} from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import store from "../store";

Vue.use(VueRouter)

const routes: RouteConfig[] = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            public: true,
        }
    },
    {
        path: '/patients',
        name: 'patients',
        component: DashboardView,
        meta: {
            requiresAuth: true,
        }
    },
    {
        path: "*",
        redirect: '/patients'
    }
]
const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach(async (to: Route, _from: Route, next) => {
    const token = localStorage.getItem('access_token');

    const initialized = store.getters["auth/initialized"];

    if (!initialized) {
        await store.dispatch("auth/me")
    }

    const isAuthenticated = store.getters["auth/isAuthenticated"];

    if(to.meta?.requiresAuth && !isAuthenticated){
        next({
            name: "login",
        })
        return
    }

    if(to.name === "login" && isAuthenticated){
        next({
            name: "patients",
        })
        return
    }

    next();
})

export default router;