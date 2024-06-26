import Axios from "./callerService"

const route = 'customers'

const getAll = (order, filter, search, limit, page) => {
   return Axios.get(`/${route}?limit=${limit}&page=${page}&sort=${order}&filter=${filter}&k=${search}`)
}

const getCustomersByUser = (idUser, order, filter, search, limit, page) => {
   return Axios.get(`/${route}/users/${idUser}?limit=${limit}&page=${page}&sort=${order}&filter=${filter}&k=${search}`)
}


const getOne = (id) => {
   return Axios.get(`/${route}/${id}`)
}

const update = (id, data) => {
   return Axios.patch(`/${route}/${id}`, data)
}

const deleted = (id) => {
   return Axios.delete(`/${route}/${id}`)
}

export const Customer = {
   getAll,
   getCustomersByUser,
   getOne,
   update,
   deleted
}