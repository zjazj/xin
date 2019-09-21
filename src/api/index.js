import axios from 'axios'
import store from '@/store' // store引用
import qs from "qs";
import router from '../router'
import { Message } from "element-ui";
require('../utils/constant')
axios.defaults.baseURL = process.env.BASE_API;
axios.defaults.timeout = 5000
import NProgress from 'nprogress'
//get
export const get = params => {return axios.get(params.url,params.params)}
//登录
export const login = params => {return axios.post('login',params)}
//登出
export const logout = params => {return axios.post('logout',params)}
//当前用户信息
export const loginInfo = params => {return axios.get('login/info')}
//刷新 token
export const tokenRefresh = params => {return axios.get('token/refresh')}

//功能生成
export const generator = params => {return axios.post('generator/add',params)}
//监控信息
export const actuator = params => {return axios.get('actuator')}

//组织列表
export const organizationList = params => {return axios.get('sysOrganization/list',{params:params})}
//组织新增
export const organizationSave = params => {return axios.post('sysOrganization/save',params)}
//组织更新
export const organizationUpdate = params => {return axios.post('sysOrganization/update',params)}
//组织信息
export const organizationInfo = params => {return axios.get('sysOrganization/info/'+params)}
//组织删除
export const organizationDelete = params => {return axios.delete('sysOrganization/delete/'+params)}

//菜单列表
export const resourceList = params => {return axios.get('sysResource/list',{params:params})}
//菜单新增
export const resourceSave = params => {return axios.post('sysResource/save',params)}
//菜单更新
export const resourceUpdate = params => {return axios.post('sysResource/update',params)}
//菜单信息
export const resourceInfo = params => {return axios.get('sysResource/info/'+params)}
//菜单删除
export const resourceDelete = params => {return axios.delete('sysResource/delete/'+params)}

//角色分页列表
export const rolePage = params => {return axios.get('sysRole/page',{params:params})}
//角色列表
export const roleList = params => {return axios.get('sysRole/list',{params:params})}
//角色新增
export const roleSave = params => {return axios.post('sysRole/save',params)}
//角色更新
export const roleUpdate = params => {return axios.post('sysRole/update',params)}
//角色信息
export const roleInfo = params => {return axios.get('sysRole/info/'+params)}
//角色删除
export const roleDelete = params => {return axios.delete('sysRole/delete/'+params)}

//用户分页列表
export const userPage = params => {return axios.get('sysUserInfo/page',{params:params})}
//用户列表
export const userList = params => {return axios.get('sysUserInfo/list',{params:params})}
//用户新增
export const userSave = params => {return axios.post('sysUserInfo/save',params)}
//用户更新
export const userUpdate = params => {return axios.post('sysUserInfo/update',params)}
//用户信息
export const userInfo = params => {return axios.get('sysUserInfo/info/'+params)}
//用户删除
export const userDelete = params => {return axios.delete('sysUserInfo/delete/'+params)}

//日志分页列表
export const logPage = params => {return axios.get('sysLog/page',{params:params})}

//用户-角色-分页
export const roleUserPage = params => {return axios.get('sysRoleUser/page',{params:params})}
//用户-角色-删除
export const roleUserDelete = params => {return axios.delete('sysRoleUser/delete/'+params)}
//用户-角色-批量保存
export const roleUserSaveBatch = params => {return axios.post('sysRoleUser/saveBatch',params)}

//用户-角色-分页
export const roleResourceList = params => {return axios.get('sysRoleResource/list',{params:params})}
//用户-角色-批量保存
export const roleResourceSaveBatch = params => {return axios.post('sysRoleResource/saveBatch/'+params.type,params)}

//定时任务-分页
export const quartzPage = params => {return axios.get('quartz/page',{params:params})}
//定时任务-新增
export const quartzSave = params => {return axios.post('quartz/save',params)}
//定时任务-暂停
export const quartzPause = params => {return axios.post('quartz/pause',params)}
//定时任务-恢复
export const quartzResume = params => {return axios.post('quartz/resume',params)}
//定时任务-恢复
export const quartzDelete = params => {return axios.post('quartz/delete',params)}


//数据字典-分页
export const dictPage = params => {return axios.get('sysDict/page',{params:params})}
//数据字典列表
export const dictList = params => {return axios.get('sysDict/list',{params:params})}
//数据字典新增
export const dictSave = params => {return axios.post('sysDict/save',params)}
//数据字典更新
export const dictUpdate = params => {return axios.post('sysDict/update',params)}
//数据字典信息
export const dictInfo = params => {return axios.get('sysDict/info/'+params)}
//数据字典删除
export const dictDelete = params => {return axios.delete('sysDict/delete/'+params)}


//数据字典项列表
export const dictItemList = params => {return axios.get('sysDictItem/list',{params:params})}
//数据字典项新增
export const dictItemSave = params => {return axios.post('sysDictItem/save',params)}
//数据字典项更新
export const dictItemUpdate = params => {return axios.post('sysDictItem/update',params)}
//数据字典项信息
export const dictItemInfo = params => {return axios.get('sysDictItem/info/'+params)}
//数据字典项删除
export const dictItemDelete = params => {return axios.delete('sysDictItem/delete/'+params)}

//cms栏目-分页
export const cmsChannelPage = params => {return axios.get('cmsChannel/page',{params:params})}
//cms栏目列表
export const cmsChannelList = params => {return axios.get('cmsChannel/list',{params:params})}
//cms栏目新增
export const cmsChannelSave = params => {return axios.post('cmsChannel/save',params)}
//cms栏目更新
export const cmsChannelUpdate = params => {return axios.post('cmsChannel/update',params)}
//cms栏目信息
export const cmsChannelInfo = params => {return axios.get('cmsChannel/info/'+params)}
//cms栏目删除
export const cmsChannelDelete = params => {return axios.delete('cmsChannel/delete/'+params)}


window.isRefreshing = false;
// 存储请求的数组 
let refreshSubscribers = []; 
/*将所有的请求都push到数组中*/ 
function subscribeTokenRefresh(cb) { 
    refreshSubscribers.push(cb); 
} 
// 数组中的请求得到新的token之后自执行，用新的token去请求数据 
function onRrefreshed(token) { 
    refreshSubscribers.map(cb => cb(token)); 
}

axios.interceptors.request.use(
    config => {
        
        NProgress.start();
        const token = sessionStorage.getItem(global.TOKEN)
        if (token!=null) {
            config.headers['x-access-token'] = token
            
            if ( store.getters.tokenExpired<=new Date() && config.url.indexOf('token/refresh') === -1 
                && config.url.indexOf('login')===-1){
                if (!window.isRefresh) {
                    window.isRefreshing = true
                    tokenRefresh().then(result => {
                        store.commit('SET_TOKEN',result.data.data.token)
                        store.commit('SET_TOKEN_EXPIRED',result.data.data.tokenExpired)
                        sessionStorage.setItem(global.TOKEN,result.data.data.token)
                        window.isRefreshing = false
                        onRrefreshed(result.data.data.token); /*执行onRefreshed函数后清空数组中保存的请求*/
                        config.headers['x-access-token'] = result.data.data.token 
                        refreshSubscribers = []
                    })
                    /*把请求(token)=>{....}都push到一个数组中*/ 
                    let retry = new Promise((resolve, reject) => { 
                        /*(token) => {...}这个函数就是回调函数*/ 
                        subscribeTokenRefresh((token) => { 
                            config.headers['x-access-token'] = token
                            /*将请求挂起*/ 
                            resolve(config) 
                        }) 
                    }); 
                    return retry

                }
            }
            
        }
        if (config.method === 'post') {
            config.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=utf-8"
            config.data = {
                ...config.data,
                _t: Date.parse(new Date())/1000
            }
            config.data = qs.stringify(config.data);
        } else if (config.method === 'get') {
            config.data = {
                _t: Date.parse(new Date())/1000
            }
        }
        return config;
    },
    err => {
        // error 的回调信息,看贵公司的定义
        Message({
            showClose: true,
            message: error.data.msg || '系统异常，请联系管理员',
            type: "error"
        });
        return Promise.reject(err)
    }
)
axios.interceptors.response.use(
    response => {
        NProgress.done();
        if (response.data.code === -1){
            Message({
                showClose: true,
                message: response.data.msg || '未知错误',
                type: "error"
              });
            if (response.data.msg === 'token invalid') {
                sessionStorage.clear()
                router.replace({
                    path: '/login',
                    query: {redirect: router.currentRoute.fullPath}
                })
                
            }
            
            return Promise.reject(response.data);
        } else {
            
        }
        return response
    },
    error => {
        NProgress.done();
         //token过期判断
         if (error.message) {
             let message = error.message || '系统异常，请联系管理员'
            if ('Network Error'===error.message) {
                message = '请检查网络或服务器！'
            }
            Message({
                showClose: true,
                message: message,
                type: "error"
            });
        } else {
            if (!sessionStorage.getItem(global.TOKEN)) {
                // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
                router.push({
                    path: "/login"
                });
            } else {
                // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
                if (error.response.status === 403) {
                    router.push({
                    path: "/error/403"
                    });
                } else if (error.response.status === 500) {
                    router.push({
                    path: "/error/500"
                    });
                } else if (error.response.status === 502) {
                    router.push({
                    path: "/error/502"
                    });
                } else if (error.response.status === 404) {
                    router.push({
                    path: "/error/404"
                    });
                } else {
                    Message({
                        showClose: true,
                        message: '未知错误',
                        type: "error"
                    });
                }


            }
        }
        return Promise.reject(error)
    }
)


