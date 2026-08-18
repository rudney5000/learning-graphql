import Vue from "vue";
import VueRouter, {Route, RouteConfig} from "vue-router";
import store from "../store";
import LoginPage from "../views/auth/LoginPage.vue";
import AppLayout from "../layouts/AppLayout.vue";
import PatientsPage from "../views/patients/PatientsPage.vue";
import AppointmentsPage from "../views/appointments/AppointmentsPage.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import {User} from "../types/types.ts";
import ForbiddenPage from "../views/ForbiddenPage.vue";

Vue.use(VueRouter)

const routes: RouteConfig[] = [
    {
        path: '/login',
        component: AuthLayout,
        meta: {
            public: true,
        },
        children: [
            {
                path: '',
                name: 'login',
                component: LoginPage,
            }
        ]
    },
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: 'patients',
                name: 'patients',
                component: PatientsPage,
                meta: {
                    requiresAuth: true,
                    roles: ["DOCTOR", "ADMIN", "NURSE"]
                }
            },
            {
                path: 'appointments',
                name: 'appointments',
                component: AppointmentsPage,
                meta: {
                    requiresAuth: true,
                    roles: ["DOCTOR", "ADMIN"]
                }
            },
        ]
    },
    {
        path: "*",
        redirect: '/patients'
    },
    {
        path: '/403',
        name: "forbidden",
        component: ForbiddenPage,
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach(async (to: Route, _from: Route, next) => {
    const initialized = store.getters["auth/initialized"];

    if (!initialized) {
        await store.dispatch("auth/me")
    }

    const isAuthenticated = store.getters["auth/isAuthenticated"];

    const requiresAuth = to.matched.some((route) => route.meta?.requiresAuth)

    if(requiresAuth && !isAuthenticated){
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

    const allowedRoles = to.matched
        .flatMap((route) => route.meta?.roles ?? [])

    if (allowedRoles.length > 0) {
        const user = store.getters["auth/user"] as User | null

        if (!user || !allowedRoles.includes(user.role)) {
            next({
                name: "forbidden",
            })

            return
        }
    }

    next();
})

export default router;