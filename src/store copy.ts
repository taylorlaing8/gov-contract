import { createStore } from 'vuex'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

interface tokenResponse {
    access: string
    refresh: string
}

const store = createStore({
    state: {
        jwt: localStorage.getItem('t'),
        jwtr: localStorage.getItem('tr'),
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
            localStorage.setItem('t', newTokens.access)
            localStorage.setItem('tr', newTokens.refresh)
            state.jwt = newTokens.access
            state.jwtr = newTokens.refresh
        },
        removeTokens(state: any) {
            localStorage.removeItem('t')
            localStorage.removeItem('tr')
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
                token: store.state.jwtr,
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
                const orig_iat = decoded.orig_iat
                if (
                    exp - Date.now() / 1000 < 1800 &&
                    Date.now() / 1000 - orig_iat < 628200
                ) {
                    store.dispatch('refreshToken')
                } else if (exp - Date.now() / 1000 < 1800) {
                    // DO NOTHING, DO NOT REFRESH
                } else {
                    // PROMPT USER TO RE-LOGIN, THIS ELSE CLAUSE COVERS THE CONDITION WHERE A TOKEN IS EXPIRED AS WELL
                    store.commit('removeTokens')
                }
            }
        },
    },
})

export default store
