import axios from 'axios'

export const http = axios.create({
    baseURL: '/api/v1',
    headers: {},
})

export const govHttp = axios.create({
    baseURL: '/api/gov/contract',
    headers: {},
})

// export const stripeHttp = axios.create({
//     baseURL: 'https://api.stripe.com/v1/',
//     headers: {
//         Authorization: `Bearer ${process.env.VUE_APP_API_SERVER_ROUTE}`,
//     },
// })
