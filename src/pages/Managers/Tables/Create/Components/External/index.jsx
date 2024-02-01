import React, { useCallback, useEffect, useState } from "react"
import * as RemixIcons from "react-icons/ri"
import toast from "react-hot-toast"
import { Company } from "../../../../../../services/companyService"
import { Table } from "../../../../../../services/tableService"

const External = ({ Navigate, access, idStatus, idUser, CustomSelect }) => {
   const order = 'asc'
   const filter = 'name'
   const status = 'actif'
   const search = ''
   const limit = 20
   const page = 0

   const [selectedCompanyValue, setSelectedCompanyValue] = useState({})
   const [company, setCompany] = useState([])
   const [table, setTable] = useState({
      idCompany: "",
      tableNumber: ""
   })

   // RETURN THE SELECTED VALUE FROM THE CUSTOMSELECT COMPONENT
   const handleCompanyValue = useCallback((value) => {
      setSelectedCompanyValue(value)
   }, [])

   // PUSH SELECTED ID OF COMPANY
   if (access === 23) {
      table.idCompany = selectedCompanyValue.value
   }
   else if (access === 22 && company.length > 0) {
      table.idCompany = company[0].id
   }

   // SET ALL VALUE
   const handleAdd = (e) => {
      const { name, value } = e.target
      setTable({
         ...table,
         [name]: value,
      })
   }

   useEffect(() => {
      Company.getCompanyByUser(idUser, order, filter, search, idStatus, limit, page)
         .then((res) => {
            setCompany(res.data.content.data)
         })
         .catch((error) => console.error('Erreur lors de la récupération des entreprises par organisation :', error))
   }, [idUser, idStatus])

   // ADD TABLE
   const handleSubmit = (e) => {
      e.preventDefault()
      if (
         table.idCompany === "" || table.tableNumber === "") {
         toast.error("Les champs marqués par une etoile sont obligations !")
      }
      else {
         Table.add(table)
            .then((res) => {
               toast.success("Table ajouté avec succès !")
               Navigate('/managers/tables')
            })
            .catch((err) => {
               if (err.response.status === 400) {
                  console.log("erreur:", err);
               }
               else if (err.response.status === 401) {
                  toast.error("La session a expiré !")
                  Account.logout()
                  Navigate("/auth/login")
               }
               else if (err.response.status === 403) {
                  toast.error("Accès interdit !")
               }
               else if (err.response.status === 404) {
                  toast.error("Ressource non trouvée !")
               }
               else if (err.response.status === 415) {
                  toast.error("Erreur, contactez l'administrateur !")
               }
               else if (err.response.status === 500) {
                  toast.error("Erreur interne du serveur !")
               }
            })
      }
   }

   return (
      <blockquote className="blockquote mb-0">
         <form onSubmit={handleSubmit} className="row g-2 form">

            <div className="col-md-6">
               <label htmlFor="tableNumber" className="form-label">
                  Nom / numéro de la table :
                  <span className="text-danger taille_etoile">*</span>
               </label>
               <input
                  type="text"
                  className="form-control no-focus-outline"
                  id="tableNumber"
                  name="tableNumber"
                  value={table.tableNumber}
                  onChange={handleAdd}
                  autoComplete='off'
                  required
               />
            </div>
            {access === 23 && (
               <div className="col-md-6">
                  <label htmlFor="" className="form-label">
                     Nom de l'entreprise :
                     <span className="text-danger taille_etoile">*</span>
                  </label>
                  <CustomSelect data={company} placeholder="Selectionnez une entreprise" onSelectedValue={handleCompanyValue} />
               </div>
            )}
            <div className="col-md-12 d-flex gap-2">
               <button type="submit" className="Btn Send btn-sm">
                  <RemixIcons.RiSendPlaneLine />
                  Ajouter
               </button>
            </div>
         </form>
      </blockquote>
   )
}

export default External