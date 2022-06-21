import { createStore } from 'vuex'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

interface tokenResponse {
    access: string
    refresh: string
}

const store = createStore({
    state: {
        jwt: localStorage.getItem('jt'),
        jwtr: localStorage.getItem('jtr'),
        endpoints: {
            obtainJWT: '/api/auth/token/',
            refreshJWT: '/api/auth/token/refresh/',
        },
    },
    mutations: {
        updateTokens(
            state: any,
            newTokens: { access: string; refresh: string },
        ) {
            if(newTokens.access) {
                localStorage.setItem('jt', newTokens.access)
                state.jwt = newTokens.access
            }
            if(newTokens.refresh) {
                localStorage.setItem('jtr', newTokens.refresh)
                state.jwtr = newTokens.refresh
            }
        },
        removeTokens(state: any) {
            localStorage.removeItem('jt')
            localStorage.removeItem('jtr')
            state.jwt = null
            state.jwtr = null
        },
    },
    actions: {
        obtainToken({ commit }, payload) {
            return new Promise((res, rej) => {
                axios
                    .post(store.state.endpoints.obtainJWT, payload)
                    .then((response) => {
                        commit('updateTokens', response.data)
                        res(response)
                    })
                    .catch((err) => {
                        console.warn(err)
                        rej(err)
                    })
            })
        },
        refreshToken() {
            const payload = {
                refresh: store.state.jwtr,
            }
            return new Promise((res, rej) => {
                axios
                    .post(store.state.endpoints.refreshJWT, payload)
                    .then((response) => {
                        store.commit('updateTokens', response.data)
                    })
                    .catch((error) => {
                        console.warn(error)
                    })
            })
        },
        inspectToken() {
            const token = store.state.jwt
            if (token) {
                const decoded: any = jwtDecode(token)
                const exp = decoded.exp
                const iat = decoded.iat
                
                if (exp - Date.now() / 1000 > 60 && Date.now() / 1000 - iat < 561600) {
                    if (exp - Date.now() / 1000 < 1800) {
                        store.dispatch('refreshToken')
                    }
                    else {
                        // Do nothing, just continue
                    }
                } else {
                    // Get user to log back in
                    store.commit('removeTokens')
                }
            }
        },
    },
})

export default store
