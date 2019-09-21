const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    device: state => state.app.device,
    token: state => state.user.token,
    tokenExpired: state => state.user.tokenExpired,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,

    avatar:state => state.user.avatar,
    realname:state => state.user.realname,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    tagsView:state => state.tagsView.tagsView,
    errorLogs: state => state.errorLog.logs
}

export default getters