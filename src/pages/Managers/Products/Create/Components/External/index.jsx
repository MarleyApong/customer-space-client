import React, { useCallback, useEffect, useState } from "react"
import * as RemixIcons from "react-icons/ri"
import toast from "react-hot-toast"
import { Organization } from "../../../../../../services/organizationService"
import { Company } from "../../../../../../services/companyService"
import { Product } from "../../../../../../services/productService"

const External = ({ Navigate, access, idStatus, idUser, CustomSelect }) => {
   const order = 'asc'
   const filter = 'name'
   const status = 'actif'
   const search = ''
   const limit = 20
   const page = 0

   const [file, setFile] = useState('')
   const [selectedCompanyValue, setSelectedCompanyValue] = useState({})
   const [company, setCompany] = useState([])
   const [product, setProduct] = useState({
      idCompany: "",
      name: "",
      category: "",
      price: "",
   })

   // RETURN THE SELECTED VALUE FROM THE CUSTOMSELECT COMPONENT
   const handleCompanyValue = useCallback((value) => {
      setSelectedCompanyValue(value)
   }, [])

   // PUSH SELECTED ID OF COMPANY
   if (access === 23) {
      product.idCompany = selectedCompanyValue.value
   }
   else if (access === 22 && company.length > 0) {
      product.idCompany = company[0].id
   }

   // SET ALL VALUE
   const handleAdd = (e) => {
      const { name, value } = e.target
      setProduct({
         ...product,
         [name]: value,
      })
   }

   // CHOISE PICTURE
   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
   }

   useEffect(() => {
      Company.getCompanyByUser(idUser, order, filter, search, idStatus, limit, page)
         .then((res) => {
            setCompany(res.data.content.data)
         })
         .catch((error) => console.error('Erreur lors de la récupération des entreprises par organisation :', error))
   }, [idUser, idStatus])

   // ADD PRODUCT
   const handleSubmit = (e) => {
      e.preventDefault()
      if (
         product.idCompany === ""
         || product.name === ""
         || file === '') {
         toast.error("Les champs marqués par une etoile sont obligations !")
      }
      else {
         const formData = new FormData()
         Object.keys(product).forEach((key) => {
            formData.append(key, product[key])
         })
         if (file) {
            formData.append('picture', file)
         }

         Product.add(formData)
            .then((res) => {
               toast.success("Produit ajouté avec succès !")
               Navigate('/managers/products')
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
               <label htmlFor="name" className="form-label">
                  Nom du produit :
                  <span className="text-danger taille_etoile">*</span>
               </label>
               <input
                  type="text"
                  className="form-control no-focus-outline"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleAdd}
                  autoComplete='off'
                  required
               />
            </div>
            <div className="col-md-6">
               <label htmlFor="category" className="form-label">
                  Catégorie :
                  <span className="text-danger taille_etoile">*</span>
               </label>

               <input
                  type="text"
                  className="form-control no-focus-outline"
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleAdd}
                  autoComplete='off'
                  required
               />
            </div>
            <div className="col-md-6">
               <label htmlFor="price" className="form-label">
                  Prix:
                  <span className="text-danger fs-5">*</span>
               </label>
               <input
                  type="number"
                  className="form-control no-focus-outline"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleAdd}
                  autoComplete='off'
                  required
               />
            </div>
            <div className="col-md-6">
               <label htmlFor="picture" className="form-label">
                  Image du produit :
                  <span className="text-danger taille_etoile">*</span>
               </label>
               <input
                  type="file"
                  className="form-control no-focus-outline"
                  id="picture"
                  name="picture"
                  onChange={handleFileChange}
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