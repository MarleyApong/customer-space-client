import React, { useEffect, useState, useRef } from "react"
import * as RemixIcons from "react-icons/ri"
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import HeaderMain from '../../../components/HeaderMain'
import SelectOption from '../../../components/SelectOption'
import SearchInput from '../../../components/SearchInput'
import logoPlaceholder from "../../../assets/img/avatar/table.jpg"
import { sortOption } from "../../../data/optionFilter"
import CustomDataTable from "../../../components/CustomDataTable"
import dateFormat from "dateformat"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Access from "../../../utils/utilsAccess"
import { Table } from "../../../services/tableService"
import useHandleError from "../../../hooks/useHandleError"
import Qrcode from 'qrcode'
import config from "../../../config"


const Tables = () => {
   const Navigate = useNavigate()
   const access = Access()
   const idUser = localStorage.getItem('id')

   const [data, setData] = useState([])
   const [oneData, setOneData] = useState([])
   const [loading, setLoading] = useState(true)
   const [order, setOrder] = useState('asc')
   const [filter, setFilter] = useState('tableNumber')
   const [search, setSearch] = useState('')
   const [limit, setLimit] = useState(10)
   const [page, setPage] = useState(1)
   const [totalPages, setTotalPages] = useState(0)
   const [id, setId] = useState('')
   const [showDetailCompanyModal, setshowDetailCompanyModal] = useState(false)
   const [refresh, setRefresh] = useState(0)
   const [allCount, setAllCount] = useState(0)
   const [qr, setQr] = useState('')

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

   // GET RESEARCH VALUE
   const handleSearchChange = (e) => {
      setSearch(e.target.value)
   }

   const generateQRCode = (webpage) => {
      Qrcode.toDataURL(webpage, {
         width: 800,
         margin: 2,
         color: {
            // colors
         },
      }, (err, url) => {
         if (err) {
            toast.error("Impossible de générer le QR code !")
         } else {
            setQr(url)
         }
      })
   }

   // FETCH ALL DATA
   useEffect(() => {
      const loadData = async () => {
         try {
            if (access === 23 || access === 22) {
               const res = await Table.getTablesByUser(idUser, order, filter, search, limit, page)
               setData(res.data.content.data)
               setAllCount(res.data.content.totalElements)
               setTotalPages(res.data.content.totalPages)
            }
            else if (access === 12 || access === 13) {
               const res = await Table.getAll(order, filter, search, limit, page)
               setData(res.data.content.data)
               setAllCount(res.data.content.totalElements)
               setTotalPages(res.data.content.totalPages)
            }
         }
         catch (err) {
            useHandleError(err, Navigate)
         }
         finally {
            setLoading(false)
         }
      }

      loadData()
   }, [access, idUser, order, filter, search, refresh, limit, page])

   // FETCH ONE DATA
   useEffect(() => {
      Table.getOne(id).then((res) => {
         setOneData(res.data.content)
         const webPage = `${config.frontUrl}#/page/${res.data.content.webPage}`
         generateQRCode(webPage)
      }).catch((err) => {
         useHandleError(err, Navigate)
      })
   }, [id, refresh])

   // DELETED TABLE
   const deleteTable = (id) => {
      const confirm = window.confirm("Voulez-vous vraiment effectuer cette action ?")
      if (confirm) {
         Table.deleted(id).then((res) => {
            toast.success("Produit supprimé avec succès !")
            setRefresh((current) => current + 1)
         }).catch((err) => {
            useHandleError(err, Navigate)
         })
      }
   }

   // FILTER SELECT TAG DATA
   const filterOptions = [
      { value: 'tableNumber', label: 'Nom de la table' },
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
         name: "#",
         cell: (row, index) => index + 1,
         maxWidth: '50px'
      },
      {
         name: 'Table',
         selector: row => row.tableNumber,
         wrap: true,
      },
      {
         name: 'Date créat.',
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
               <button className="Btn Send" title="Modifier" onClick={() => Navigate(`/managers/tables/update/${row.id}`)}>
                  <RemixIcons.RiPenNibLine fontSize={15} />
               </button>
               {access === 13 && <button className="Btn Error" title="Supprimer" onClick={() => deleteTable(row.id)}>
                  <RemixIcons.RiDeleteBin2Line fontSize={15} />
               </button>}
            </div>
         )
      },
   ]

   if (access === 13 || access === 23) {
      columns.splice(2, 0, {
         name: 'Entreprise',
         selector: row => row.Company ? row.Company.name : '',
         wrap: true,
      })
   }

   if (access === 13) {
      columns.splice(3, 0, {
         name: 'Organisation',
         selector: row => row.Company ? row.Company.Organization.name : '',
         wrap: true,
      })
   }

   return (
      <>
         <HeaderMain total={allCount} />

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
                  Detail de la table : {oneData.name}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body className="body-react-bootstrap">
               <div className="container">
                  <div className="row ">
                     <div className="col-md-6 d-flex shadow align-items-center justify-content-center overflow-hidden p-2">
                        <img className="object-fit-cover" src={logoPlaceholder} alt="" width="100%" height="400px" />
                     </div>
                     {oneData.id && (
                        <div className="col-md-6 infoDetail ml-4 ">
                           <div className="fw-bold fs-2 shadow p-2 mb-4">{oneData.tableNumber.toUpperCase()}</div>
                           <div className="mb-3">Ajouté le : {dateFormat(oneData.createdAt, 'dd-mm-yyyy HH:MM:ss')}</div>
                           <div className="mb-3">Modifié le : {dateFormat(oneData.updatedAt, 'dd-mm-yyyy HH:MM:ss')}</div>
                           {qr && (
                              <div className="qr-code d-flex flex-column" style={{ width: '100px' }}>
                                 < img src={qr} />
                                 <a className="Btn" style={{ textDecoration: "none" }} href={qr} download={"Table: " + oneData.tableNumber + '.png'}>Télécharger</a>
                              </div>
                           )}
                           <>
                              <h5 className="mb-3 mt-3 p-2 shadow">Affiliation</h5>
                              <div className="ps-4">
                                 <p className="mb-2"><span className="fw-bold">Organisation :</span> {oneData.Company.Organization.name || 'Aucune'}</p>
                                 <p className="mb-2"><span className="fw-bold">Entreprise :</span> {oneData.Company.name || 'Aucune'}</p>
                              </div>
                           </>
                        </div>
                     )}
                  </div>
               </div>
            </Modal.Body>
            <Modal.Footer className="footer-react-bootstrap d-flex justify-content-between">
               <div className="d-lg-flex d-sm-block">
                  <Button onClick={() => Navigate(`/managers/tables/update/${oneData.id}`)} className="Btn Send  me-2" title="Modifier infos"><RemixIcons.RiPenNibLine />Modifier le prod.</Button>
               </div>
               <div>
                  <Button onClick={hideModal} className="Btn Error" title="Fermer"><RemixIcons.RiCloseLine />Fermer</Button>
               </div>
            </Modal.Footer>
         </Modal >
      </>
   )
}

export default Tables