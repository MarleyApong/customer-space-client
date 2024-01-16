import Axios from "./callerService"

const route = 'surveys'

const getAll = () => {
   return Axios.get(`/${route}`)
}

const getOne = (id) => {
   return Axios.get(`/${route}/${id}`)
}

const add = (id, data) => {
   console.log("id: ", id + "data: ", data);
   return Axios.put(`/${route}/${id}`, data)
}

const update = (id, data) => {
   return Axios.patch(`/${route}/${id}`, data)
}

const changeStatus = (id) => {
   return Axios.patch(`/${route}/${id}/status`)
}

const deleted = (id) => {
   return Axios.delete(`/${route}/${id}`)
}

export const Survey = {
   getAll,
   getOne,
   add,
   update,
   changeStatus,
   deleted
}