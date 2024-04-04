import React, { useEffect, useState } from 'react'
import * as RemixIcons from "react-icons/ri"
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/img/logo/cs-logo-red.png'
import Access from '../../utils/utilsAccess'
import './header.scss'
import toast from 'react-hot-toast'
import EventOrder from '../EventOrder'
import songOfNewOrder from '../../assets/audio/newOrder.wav'
import { Orders } from '../../services/orderService'
import { User } from '../../services/userService'

const Header = ({ sidebar, setSidebar }) => {
    const Navigate = useNavigate()
    const location = useLocation()
    const access = Access()
    const eventOrder = EventOrder()
    const idUser = localStorage.getItem('id')

    const id = localStorage.getItem("id")
    const order = 'asc'
    const filter = 'name'
    const status = ''
    const search = ''
    const limit = 0
    const page = 0

    const [allCount, setAllCount] = useState(0)
    const [company, setCompany] = useState('')
    // const [theme, setTheme] = useState(localStorage.getItem('theme'))

    // REDIRECTION
    const newOrganization = () => Navigate('/organizations/new')
    const newCompany = () => Navigate('/companies/new')
    const newSurvey = () => Navigate('/surveys/new')
    const newUser = () => Navigate('/users/new')
    const newProduct = () => Navigate('/managers/products/new')
    const newTable = () => Navigate('/managers/tables/new')

    const playSuccess = () => {
        new Audio(songOfNewOrder).play()
    }

    // const toggleTheme = () => {
    //     if (theme === 'dark') {
    //         setTheme('light')
    //     }
    //     else {
    //         setTheme('dark')
    //     }
    // }

    useEffect(() => {
        playSuccess()
        if (eventOrder !== '' && access === 20) {
            toast.success("Vous avez une nouvelle commande")
        }
    }, [eventOrder])

    // GET COMPANY BY USER
    useEffect(() => {
        const loadCompany = async () => {
            try {
                const res = await User.getOrganizationCompany(idUser)
                const idCompany = res.data.content.Company.id
                setCompany(idCompany)
            } catch (err) {
            }
        }

        loadCompany()
    }, [idUser])

    // FETCH ALL DATA
    useEffect(() => {
        const loadData = async () => {
            try {
                if (access === 20) {
                    let res = await Orders.getOrderByCompany(company, order, filter, search, status, limit, page)
                    setAllCount(res.data.content.totalElements)
                }
            }
            catch (err) {

            }
        }

        loadData()
    }, [access, idUser, eventOrder, company])

    // useEffect(() => {
    //     const root = document.documentElement
    //     if (theme === 'light') {
    //         root.style.setProperty('--color-primary', '#f1f1f1')
    //         root.style.setProperty('--aside-color', '#fefefe')
    //         root.style.setProperty('--aside-text-color', '#Ed1f24')
    //         root.style.setProperty('--active-color', '#Ed1f24')
    //         root.style.setProperty('--header-color', '#fefefe')
    //         root.style.setProperty('--user-color', '#Ed1f24')
    //         root.style.setProperty('--toggle-color', '#Ed1f24')
    //         root.style.setProperty('--logo-color', '#Ed1f24')
    //         root.style.setProperty('--z-color-1', '#6E659C')
    //         root.style.setProperty('--z-color-2', '#D49D38')
    //         root.style.setProperty('--color-1', '#fff')
    //         root.style.setProperty('--color-2', '#f1f1f1e1')
    //         root.style.setProperty('--color-3', '#000')
    //         root.style.setProperty('--color-modal-head', '#333')
    //         root.style.setProperty('--bg-modal-head', '#fff')
    //         root.style.setProperty('--shadow-color', '#7777773b')
    //         root.style.setProperty('--color-err', '#5d0606')
    //         root.style.setProperty('--color-err-hv', '#Ed1f24')
    //         root.style.setProperty('--color-notification', '#Ed1f24')
    //         root.style.setProperty('--color-scroll', '#Ed1f24')
    //         root.style.setProperty('--color-body-content', '#fff')
    //         root.style.setProperty('--website-color', '#Ed1f24')
    //         root.style.setProperty('--order-color', '#c01d20')
    //     }
    //     else {
    //         root.style.setProperty('--color-primary', '#f1f1f1')
    //         root.style.setProperty('--aside-color', '#333')
    //         root.style.setProperty('--aside-text-color', '#f1f1f1')
    //         root.style.setProperty('--active-color', '#Ed1f24')
    //         root.style.setProperty('--header-color', '#333')
    //         root.style.setProperty('--user-color', '#333')
    //         root.style.setProperty('--toggle-color', '#Ed1f24')
    //         root.style.setProperty('--logo-color', '#Ed1f24')
    //         root.style.setProperty('--z-color-1', '#6E659C')
    //         root.style.setProperty('--z-color-2', '#D49D38')
    //         root.style.setProperty('--color-1', '#fff')
    //         root.style.setProperty('--color-2', '#f1f1f1e1')
    //         root.style.setProperty('--color-3', '#000')
    //         root.style.setProperty('--color-modal-head', '#fefefe')
    //         root.style.setProperty('--bg-modal-head', '#333')
    //         root.style.setProperty('--shadow-color', '#7777773b')
    //         root.style.setProperty('--color-err', '#5d0606')
    //         root.style.setProperty('--color-err-hv', '#333')
    //         root.style.setProperty('--color-notification', '#333')
    //         root.style.setProperty('--color-scroll', '#Ed1f24')
    //         root.style.setProperty('--color-body-content', '#333')
    //         root.style.setProperty('--website-color', '#333')
    //         root.style.setProperty('--order-color', '#c01d20')
    //     }

    //     localStorage.setItem('theme', theme)
    // }, [theme])


    return (
        <header>
            <div className="Left" onClick={() => Navigate('/dashboard')}>
                <div className="Company">
                    <img src={logo} alt="" />
                    <span>CUSTOMER SPACE</span>
                </div>
            </div>
            {/* <div className="Middle">
                <input type="text" name="" id="" placeholder='Rechercher...' />
                <RemixIcons.RiSearch2Line className='Icon' />
            </div> */}
            <div className="Right">
                <div className="Not-SM">
                    {access != 20 && (
                        location.pathname.includes('organizations') && !location.pathname.includes('new') ?
                            <button className='Btn Success' onClick={newOrganization}>
                                <RemixIcons.RiAddLine />
                                <small>Nouvelle Organizat.</small>
                            </button> :
                            location.pathname.includes('companies') && !location.pathname.includes('new') ?
                                <button className='Btn Success' onClick={newCompany}>
                                    <RemixIcons.RiAddLine />
                                    <small>Nouvelle Entreprise</small>
                                </button> :
                                location.pathname.includes('surveys') && !location.pathname.includes('new') ?
                                    <button className='Btn Success' onClick={newSurvey}>
                                        <RemixIcons.RiAddLine />
                                        <small>Nouvelle Enquête</small>
                                    </button> :
                                    location.pathname.includes('users') && !location.pathname.includes('new') ?
                                        <button className='Btn Success' onClick={newUser}>
                                            <RemixIcons.RiAddLine />
                                            <small>Nouveau utilisateur</small>
                                        </button> :
                                        location.pathname.includes('managers') && location.pathname.includes('products') ?
                                            <button className='Btn Success' onClick={newProduct}>
                                                <RemixIcons.RiAddLine />
                                                <small>Ajouter un produit</small>
                                            </button> :
                                            location.pathname.includes('managers') && location.pathname.includes('tables') ?
                                                <button className='Btn Success' onClick={newTable}>
                                                    <RemixIcons.RiAddLine />
                                                    <small>Ajouter une table</small>
                                                </button> :
                                                <button className='Btn Success' onClick={newSurvey}>
                                                    <RemixIcons.RiAddLine />
                                                    <small>Nouvelle Enquête</small>
                                                </button>

                    )}

                    {/* <div className="NotificationIcon" onClick={toggleTheme}>
                        {theme === 'light' ? <RemixIcons.RiMoonLine /> : <RemixIcons.RiSunLine />}
                    </div> */}
                    {access === 20 && (
                        <div className="NotificationIcon" onClick={() => Navigate('/orders')}>
                            <RemixIcons.RiNotification3Line />
                            <span className='newNotification'>{allCount}</span>
                        </div>
                    )}
                </div>
                <div className="NotificationIcon" onClick={() => setSidebar(!sidebar)}>
                    <RemixIcons.RiMenu4Line size={18} />
                </div>
            </div>
        </header >
    )
}

export default Header