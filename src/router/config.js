import Layout from '@/views/main/main'

export const constantRouterMap = [
    { path:'/login',component:() => import('@/views/login/login'),hidden:true},
    { path:'/404',component:() => import('@/views/error/404'),hidden:true},
    { path: '/401', component: () => import('@/views/error/401'), hidden: true },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        title: 'dashboard',
        children: [
            {
                path: '/dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'dashboard',
                title: 'dashboard',
                icon: 'dashboard'
            },
        ]
    },
    {
        path: '/home',
        component: Layout,
        redirect: '/home/index',
        title: 'home',
        children: [
            {
                path: 'index',
                component: () => import('@/views/home/Home'),
                name: 'home',
                title: 'home',
                icon: 'home'
            },
        ]
    },
    {
        path: '/generator',
        component: Layout,
        redirect: '/generator/index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/generator/index'),
                name: 'generator',
                icon: 'dashboard'
            }
        ]
    },
    {
        path: '/monitor',
        component: Layout,
        redirect: '/monitor/index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/monitor/index'),
                name: 'monitor',
                icon: 'dashboard'
            }
        ]
    },
    {
        path: '/icons',
        component: Layout,
        redirect: '/icons/index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/icons/index'),
                name: 'icons',
                title: 'icons',
                icon: 'dashboard'
            }
        ]
    }

]


export const asyncRouterMap = [

    {
        path: '/error',
        component: Layout,
        redirect: 'noredirect',
        name: 'errorPages',
        title: 'errorPages',
        icon: '404',
        children: [
            { path: '401', component: () => import('@/views/error/401'), name: 'page401', title: 'page401'},
            { path: '404', component: () => import('@/views/error/404'), name: 'page404', title: 'page404'},
        ]
    },
    {
        path: '',
        component: Layout,
        redirect: 'log',
        title: 'log',
        perms: 'sys:log:view',
        children: [
            {
                path: 'log',
                component: () => import('@/views/system/log'),
                name: 'log',
                icon: 'dashboard'
            },
        ]
    },
    {
        path: '/system',
        component: Layout,
        redirect: 'noredirect',
        name: 'system',
        perms: 'sys:system:view',
        icon: 'list',
        children: [
            {
                path: 'organization',
                component: () => import('@/views/system/organization'),
                name: 'organization',
                perms: 'sys:organization:view',
            },
            {
                path: 'resource',
                component: () => import('@/views/system/resource'),
                name: 'resource',
                perms: 'sys:resource:view',
            },
            {
                path: 'role',
                component: () => import('@/views/system/role'),
                name: 'role',
                perms: 'sys:role:view',

            },
            {
                path: 'user',
                component: () => import('@/views/system/user'),
                name: 'user',
                perms: 'sys:user:view',
            },
            {
                path: 'scheduler',
                component: () => import('@/views/system/scheduler'),
                name: 'scheduler',
                perms: 'sys:scheduler:view',
            },
            {
                path: 'dict',
                component: () => import('@/views/system/dict'),
                name: 'dict',
                perms: 'sys:dict:view',
            },
        ]
    },
    {
        path: '/manage',
        component: Layout,
        redirect: 'noredirect',
        name: 'system',
        perms: 'cms:manage:view',
        icon: 'list',
        children: [
            {
                path: 'channel',
                component: () => import('@/views/system/cms/cmsChannel'),
                name: 'cmsChannel',
                perms: 'cms:cmsChannel:view',
            },
        ]
    }

]