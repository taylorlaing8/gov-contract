import axios from 'axios'
import store from '@/store'

export const http = axios.create({
    baseURL: '/api/v1',
    headers: {},
})

export const govHttp = axios.create({
    baseURL: '/api/gov/contract',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

govHttp.interceptors.request.use(
    (config) => {
        if(config.headers) config.headers['Authorization'] = `Bearer ${localStorage.getItem('jt')}`
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)
