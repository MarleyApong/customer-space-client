import React, { useEffect, useState } from "react"
import * as RemixIcons from "react-icons/ri"
import Modal from 'react-bootstrap/Modal'
import HeaderMain from '../../components/HeaderMain'
import SelectOption from '../../components/SelectOption'
import SearchInput from '../../components/SearchInput'
import { StatusOption, sortOption } from "../../data/optionFilter"
import CustomDataTable from "../../components/CustomDataTable"
import dateFormat from "dateformat"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import Access from "../../utils/utilsAccess"
import useHandleError from "../../hooks/useHandleError"
import { Orders } from "../../services/orderService"
import { User } from "../../services/userService"
import EventOrder from "../../components/EventOrder"
import config from "../../config"

const Order = () => {
   const Navigate = useNavigate()
   const access = Access()
   const idUser = localStorage.getItem('id')
   const eventOrder = EventOrder()
   const statusOption = StatusOption()

   //GET ID COMPANY
   const { idComp } = useParams()

   const [data, setData] = useState([])
   const [oneData, setOneData] = useState([])
   const [currentIdOrder, setCurrentIdOrder] = useState(localStorage.getItem('currentIdOrder'))
   const [company, setCompany] = useState('')
   const [loading, setLoading] = useState(true)
   const [order, setOrder] = useState('asc')
   const [filter, setFilter] = useState('name')
   const [status, setStatus] = useState('')
   const [search, setSearch] = useState('')
   const [limit, setLimit] = useState(10)
   const [page, setPage] = useState(1)
   const [totalPages, setTotalPages] = useState(0)
   const [id, setId] = useState('')
   const [showDetailCompanyModal, setshowDetailCompanyModal] = useState(false)
   const [refresh, setRefresh] = useState(0)
   const [allCount, setAllCount] = useState(0)

   // GET ID OF STATUS
   let idStatus = ''
   const objetFounded = statusOption.filter((item, _) => item.label === 'inactif').map((status, _) => status.value)
   if (objetFounded) {
      idStatus = objetFounded.toString()
   }

   // RECOVERING THE ID OF THE SELECTED LINE
   const patch = (itemId) => {
      setshowDetailCompanyModal(true)
      setId(itemId)
   }

   // CLOSE THE TEMPLATE MODAL
   const hideModal = () => {
      setshowDetailCompanyModal(false)
      setRefresh((current) => current + 1)
   }

   // GET ORDER VALUE
   const handleOrderChange = (e) => {
      setOrder(e.target.value)
   }

   // GET FILTER VALUE
   const handleFilterChange = (e) => {
      setFilter(e.target.value)
   }

   // GET STATUS VALUE
   const handleStatusChange = (e) => {
      setStatus(e.target.value)
   }

   // GET RESEARCH VALUE
   const handleSearchChange = (e) => {
      setSearch(e.target.value)
   }

   // GET COMPANY BY USER
   useEffect(() => {
      const loadCompany = async () => {
         try {
            if (access === 20) {
               const res = await User.getOrganizationCompany(idUser)
               const idCompany = res.data.content.Company.id
               setCompany(idCompany)
            }
            else {
               setCompany(idComp)
            }
         } catch (err) {
         }
      }

      loadCompany()
   }, [idUser, access])

   console.log("comp", company);

   // FETCH ALL DATA
   useEffect(() => {
      const loadData = async () => {
         try {
            if (access === 20) {
               let res = await Orders.getOrderByCompany(company, order, filter, search, status, limit, page)
               setData(res.data.content.data)
               setAllCount(res.data.content.totalElements)
               setTotalPages(res.data.content.totalPages)
            }
            else {
               let res = await Orders.getOrderByCompany(idComp, order, filter, search, status, limit, page)
               setData(res.data.content.data)
               setAllCount(res.data.content.totalElements)
               setTotalPages(res.data.content.totalPages)
            }
         } catch (err) {
            useHandleError(err, Navigate)
         } finally {
            setLoading(false)
         }
      }

      loadData()
   }, [access, idUser, order, filter, status, search, refresh, limit, page, eventOrder, company])


   // FETCH ONE DATA
   useEffect(() => {
      Orders.getOne(id).then((res) => {
         setOneData(res.data.content)
      }).catch((err) => {
         useHandleError(err, Navigate)
      })
   }, [id, refresh])

   // FILTER SELECT TAG DATA
   const filterOptions = [
      { value: 'name', label: 'commande n°' },
      { value: 'createdAt', label: 'date de créat.' },
   ]

   // SYSTEM PAGINATION
   const handlePageChange = (newPage) => {
      setPage(newPage)
   }

   const handleLimitChange = (newLimit) => {
      setLimit(newLimit)
   }

   // FORMATTING JSON DATA TO MAKE IT MORE READABLE
   const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>

   // HEADING AND DISPLAY PRINCIPLE OF THE TABLE
   const columns = [
      {
         name: 'Commande N°',
         selector: row => row.name,
         wrap: true,
      },
      {
         name: 'Table',
         selector: row => row.Table.tableNumber,
         wrap: true,
      },
      {
         name: 'Produit',
         selector: row => row.Orders_Products.length,
         wrap: true,
      },
      {
         name: 'Date',
         selector: row => dateFormat(new Date(row.createdAt), 'dd-mm-yyyy HH:MM:ss'),
         wrap: true,
      },
      {
         name: 'Actions',
         cell: (row) => (
            <div className="d-flex ">
               <button className="Btn Update" title="Détails" onClick={() => patch(row.id)}>
                  <RemixIcons.RiEyeLine fontSize={15} />
               </button>
            </div>
         )
      },
   ]

   // TAKE AND FINISH ORDER
   const handleTakeOrder = async (idOrder) => {
      try {
         if (currentIdOrder === idOrder) {
            // FINISH ORDER
            await Orders.finalizeOrder(idOrder, idUser)
            setCurrentIdOrder(null)
            localStorage.removeItem('currentIdOrder')
            toast.success("Commande terminée avec succès !")
            hideModal()
         }
         else {
            // TAKE ORDER
            await Orders.underTreatment(idOrder, idUser)
            setCurrentIdOrder(idOrder)
            localStorage.setItem('currentIdOrder', idOrder)
            toast.success("Commande prise en charge avec succès !")
            hideModal()
         }
      }
      catch (err) {
         toast.error("Une erreur s'est produite !")
      }
   }

   // CANCEL ORDER
   const cancelOrder = (idOrder) => {
      if (confirm("Voulez-vous vraiment annuler cette commande ?")) {
         Orders.cancelOrder(idOrder, idUser)
            .then((res) => {
               toast.success("Commande annulée !")
               hideModal()
            })
            .catch((err) => {
               useHandleError(err, Navigate)
            })
      }
   }

   return (
      <>
         <HeaderMain total={0} />

         <div className="OptionFilter">
            <SelectOption
               label="Trier par"
               id="sort"
               name={order}
               value={order}
               onChange={handleOrderChange}
               options={sortOption}
            />

            <SelectOption
               label="Filtrer par"
               id="filter"
               name={filter}
               value={filter}
               onChange={handleFilterChange}
               options={filterOptions}
            />

            <div className="AllOptionBox" style={{ background: 'var(--active-color)', color: '#fff', paddingLeft: '3px' }}>
               <label htmlFor='status'>Status : </label>
               <select className="input ml-2"
                  id="status"
                  name={status}
                  value={status}
                  onChange={handleStatusChange}>
                  <option value="">Nouvelle cmd.</option>
                  <option value="progress">en cours de trait.</option>
                  <option value="actif">traitée</option>
                  <option value="inactif">annulée</option>
               </select>
            </div>

            <SearchInput
               filter={filter}
               placeholder="Tapez ici.."
               ariaLabel="Search"
               value={search}
               onChange={handleSearchChange}
            />
         </div>

         <CustomDataTable
            loading={loading}
            columns={columns}
            data={data}
            ExpandedComponent={ExpandedComponent}
            paginationPerPage={limit}
            paginationTotalRows={allCount}
            currentPage={page}
            totalPages={totalPages}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
         />
         <Modal
            show={showDetailCompanyModal}
            onHide={hideModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal-react-bootstrap">
            <Modal.Header closeButton className="header-react-bootstrap">
               <Modal.Title id="contained-modal-title-vcenter" className="title-react-bootstrap">
                  Detail de la commande : {oneData.name}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body className="body-react-bootstrap">
               <div className="container">
                  {oneData.id && (
                     <div className="row ">
                        <div className="col-md-12">
                           <div className="fw-bold shadow p-2 mb-4">Coomande n° {oneData.name.toUpperCase()}</div>
                           <div className="mb-3 d-flex flex-column">
                              <span className="mb-3">Table : {oneData.Table.tableNumber}</span>
                              <span className="mb-3">Ajouté le : {dateFormat(oneData.createdAt, 'dd-mm-yyyy HH:MM:ss')}</span>
                              <span className="mb-3">Modifié le : {dateFormat(oneData.updatedAt, 'dd-mm-yyyy HH:MM:ss')}</span>
                           </div>
                           <div className="fw-bold shadow p-2 mb-3">Produit(s)</div>
                           <div className="mb-3 sm-cart">
                              {oneData.Orders_Products.map((item, index) => (
                                 <div className="d-flex align-items-center mb-2 border border-1 p-1" key={index}>
                                    <img src={config.serverUrl + item.Product.picture} alt="" style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px", borderRadius: "5px" }} />
                                    <div className="d-flex flex-column">
                                       <span>Produit: {item.Product.name}</span>
                                       <span>Prix: {item.Product.price}</span>
                                       <span>Qté: {item.quantity}</span>
                                    </div>
                                 </div>
                              ))}
                              <span className="fw-bold">Total de la commande: {oneData.total} FCFA</span>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </Modal.Body>
            <Modal.Footer className="footer-react-bootstrap d-flex justify-content-between">
               <div className="d-flex">
                  {access === 20 && oneData.id && oneData.Status !== null && oneData.Status && oneData.Status.name === 'actif' ? (
                     <button className="Btn" disabled={true}>
                        <RemixIcons.RiCheckDoubleLine size={15} />
                        Commande traitée
                     </button>
                  ) : null}

                  {(access === 20 && oneData.id && oneData.idUser && !oneData.Status) && (
                     <button
                        onClick={() => handleTakeOrder(oneData.id)}
                        className="Btn Update"
                        disabled={oneData.idUser !== idUser ? true : false}
                        title="Finaliser la commande">
                        <RemixIcons.RiCheckboxMultipleFill size={15} />
                        Finaliser
                     </button>
                  )}

                  {(access === 20 && oneData.id && !oneData.idUser && !oneData.Status) && (
                     <button onClick={() => handleTakeOrder(oneData.id)} className="Btn Success" title="Prendre la commande">
                        <RemixIcons.RiCheckboxMultipleLine size={15} />
                        Prendre commande
                     </button>
                  )}

                  {(access === 20 && oneData.id) && (
                     !oneData.idUser && !oneData.Status ? (
                        <button className="Btn Error ms-1" onClick={() => cancelOrder(oneData.id)}>
                           Annuler la Cmd.
                        </button>
                     ) : (oneData.idUser && oneData.Status && oneData.Status.name === 'inactif') ?
                        (
                           <button className="Btn" onClick={() => toast.error("Cette commande a été annulée !")}>
                              Commande annulée
                           </button>

                        ) : null)
                  }
               </div>

               <button onClick={hideModal} className="Btn Error" title="Fermer"><RemixIcons.RiCloseLine /></button>
            </Modal.Footer>
         </Modal >
      </>
   )
}

export default Order
