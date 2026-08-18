import Vue from "vue";
import VueRouter, {Route} from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {
                guestOnly: true,
            }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: "*",
            redirect: '/dashboard'
        }
    ]
})

router.beforeEach((to: Route, _from: Route, next) => {
    const token = localStorage.getItem('access_token');

    if(to.matched.some((record) => record.meta?.requiresAuth) && !token){
        next({
            name: "login",
        })
        return
    }

    if(to.matched.some((record) => record.meta?.guestOnly) && token){
        next({
            name: "dashboard",
        })
        return
    }

    next();
})

export default router;