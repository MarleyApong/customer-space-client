import axios from "axios"
import { Account } from "./accountService"

const Axios = axios.create({
    baseURL: 'https://magical-galileo.212-227-211-20.plesk.page',
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
})

// INTERCEPTOR OF TOKEN
Axios.interceptors.request.use(request => {
    if (Account.isLogged()) {
        const token = localStorage.getItem('lkiy-')
        request.headers.Authorization = 'Bearer ' + token
    }
    return request
})

export default Axios