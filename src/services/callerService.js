import axios from "axios"
import { Account } from "./accountService"

const Axios = axios.create({
    baseURL: 'http://localhost:8000',
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