import Axios from "./callerService"

const route = 'products'

const getAll = (order, filter, search, limit, page) => {
   return Axios.get(`/${route}?limit=${limit}&page=${page}&sort=${order}&filter=${filter}&k=${search}`)
}

const getProductsByUser = (idUser, order, filter, search, limit, page) => {
   return Axios.get(`/${route}/users/${idUser}?limit=${limit}&page=${page}&sort=${order}&filter=${filter}&k=${search}`)
}

const getOne = (id) => {
   return Axios.get(`/${route}/${id}`)
}

const add = (data) => {
   return Axios.put(`/${route}`, data)
}

const update = (id, data) => {
   return Axios.patch(`/${route}/${id}`, data)
}

const changeStatus = (id) => {
   return Axios.patch(`/${route}/${id}/status`)
}

const changePicture = (id, data) => {
   return Axios.patch(`/${route}/${id}/profile-image`, data)
}

const deleted = (id) => {
   return Axios.delete(`/${route}/${id}`)
}

export const Product = {
   getAll,
   getProductsByUser,
   getOne,
   add,
   update,
   changeStatus,
   changePicture,
   deleted
}