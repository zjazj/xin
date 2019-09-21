import {login,logout,loginInfo} from '@/api'

const user = {
    state: {
        id:'',
        state:'',
        code: '',
        token: sessionStorage.getItem(global.TOKEN),
        tokenExpired: '',
        realname:'',
        avatar: '',
        introduction: '',
        permissions: [],
        roles: [], 
        
    },
    mutations: {
        SET_ID: (state,id) => {
            state.id = id
        },
        SET_NAME: (state,realname) => {
            state.realname = realname
        },
        SET_CODE: (state,code) => {
            state.code = code
        },
        SET_TOKEN: (state,token) => {
            state.token = token
        },
        SET_TOKEN_EXPIRED: (state,tokenExpired) => {
            state.tokenExpired = tokenExpired
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSION: (state, permissions) => {
            state.permissions = permissions
        },
    },
    actions: {
        doLogin({commit},userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    let result = response.data.data;
                    commit('SET_ID',result.id)
                    commit('SET_TOKEN',result.token)
                    commit('SET_TOKEN_EXPIRED',result.tokenExpired)
                    sessionStorage.setItem(global.TOKEN,result.token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        logout({commit,state}){
            return new Promise((resolve, reject) => {
                logout(state.token).then(response => {
                    commit('SET_TOKEN','')
                    commit('SET_TOKEN_EXPIRED','')
                    sessionStorage.removeItem(global.TOKEN)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        FedLogout({commit,state}){
            return new Promise(resolve => {
                commit('SET_TOKEN','')
                sessionStorage.removeItem(global.TOKEN)
                resolve()
            })
        },
        loginUser({commit,state}){
            return new Promise((resolve, reject) => {
                loginInfo().then(response => {
                    console.log(response)
                    if (!response.data) {
                        reject('error')
                    }
                    const data = response.data.data

                    if (data.roles && data.roles.length > 0) {
                        commit('SET_ROLES',data.roles)
                    } else {
                        reject('getInfo: roles must be a non-null array !')
                    }
                    
                    commit('SET_NAME', data.realname)
                    commit('SET_AVATAR', data.avatar)
                    commit('SET_PERMISSION', data.permissions)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default user