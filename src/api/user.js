export const login = params => {
    let authStr = btoa(params.username + ":" + params.password)
    return Vue.axios.get("/oauth", {

    })
}

export const logout = () => {
    return Vue.axios.post("/logout")
}