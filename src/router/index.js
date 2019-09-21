import Vue from 'vue'
import Router from 'vue-router'
import {constantRouterMap,asyncRouterMap} from './config'

import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


const routes = constantRouterMap.concat(asyncRouterMap)

Vue.use(Router)



const router = new Router({
    mode: 'history',
    //mode: "hash",
    linkActiveClass: "active",
    routes: routes
})






NProgress.configure({showSpinner:false})

// permission judge function
export function hasPermission(perms) {
    if (store.getters.roles.indexOf('admin') >= 0) return true // admin permission passed directly
    if (!perms) return true
    return store.getters.permissions.some(permission => permission === perms)
}

const annoList = ['/login']

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (sessionStorage.getItem(global.TOKEN)) {
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        } else {
            console.log(store)
            if (store.getters.roles.length === 0) {
                store.dispatch('loginUser').then(response => {
                    // const roles = response.data.data.roles
                    // store.dispatch('GenerateRoutes',{roles}).then(() => {
                    //     router.addRoutes(store.getters.addRouters)
                    //     next({...to, replace:true})
                    // })
                    const data = response.data
                    store.dispatch('GenerateRoutes',data).then(() => {
                        router.addRoutes(store.getters.addRouters)
                        next({...to, replace:true})
                    })
                }).catch((err) => {
                    store.dispatch('FedLogout').then(() => {
                        Message.error(err || 'Verification failed, please login again')
                        next({path:'/'})
                    })
                })
            } else {
                if (hasPermission(to.perms)) {
                    next()
                } else {
                    next({path: '/401', replace:true, query: {noGoBack: true}})
                }
            }

        }
    } else {
        if (annoList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})


export default router

