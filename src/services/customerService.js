import Axios from "./callerService"

const route = 'customers'

const getAll = () => {
   return Axios.get(`/${route}`)
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
   getOne,
   update,
   deleted
}