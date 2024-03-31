import React, { useEffect, useState } from 'react'
import './order.scss'
import * as RemixIcons from "react-icons/ri"
import Pagination from '../../../components/Pagination'
import { Product } from '../../../services/productService'
import { Orders } from '../../../services/orderService'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import useHandleError from "../../../hooks/useHandleError"

const Order = () => {
   const Navigate = useNavigate()
   const { company } = useParams()

   // GET PARAMS AFTER  THE (?)
   const location = useLocation()
   const queryParams = new URLSearchParams(location.search)
   const idTable = queryParams.get('fkpngt44tdot')

   const [products, setProducts] = useState([])
   const [cart, setCart] = useState([])
   const [pageable, setPageable] = useState({})
   const [showCart, setShowCart] = useState(false)
   const [mode, setMode] = useState(true)

   const order = 'asc'
   const filter = 'name'
   const search = ''
   const status = 'actif'
   const limit = 16
   const [page, setPage] = useState(1)

   useEffect(() => {
      const loadProducts = async () => {
         const res = await Product.getProductByCompany(company, order, filter, status, search, limit, page)
         // INITIALIZE QUANTITY TO 0
         setProducts(res.data.content.data.map(product => ({ ...product, quantity: 0 })))
         setPageable(res.data.content)
      }

      loadProducts()
   }, [company, page])

   // ADD TO CARD
   const handleAddToCart = (product) => {
      const existingItem = cart.find(item => item.id === product.id)

      if (existingItem) {
         // UPDATE CART ITEM QUANTITY
         const updatedCart = cart.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
         )
         setCart(updatedCart)
      }
      else {
         // ADD PRODUCT TO CART WITH QUANTITY
         const updatedCart = [...cart, { ...product, quantity: 1 }]
         setCart(updatedCart)
      }

      // UPDATE PRODUCT QUANTITY
      const updatedProducts = products.map(item =>
         item.id === product.id ? { ...item, quantity: 1 } : item
      )
      setProducts(updatedProducts)
   }



   // REMOVE PRODUCT FROM CART
   const handleRemoveFromCart = (product) => {
      const updatedCart = cart.filter(item => item.id !== product.id)
      setCart(updatedCart)
   }

   // UPDATE QUANTITY OF PRODUCT
   const updateProductQuantity = (productId, newQuantity) => {
      // LIMIT QUANTITY TO MINIMUM 0 AND MAXIMUM 10
      newQuantity = Math.max(0, Math.min(10, newQuantity));

      // CHECK IF THE PRODUCT EXISTS IN THE CART
      const existingItemIndex = cart.findIndex(item => item.id === productId);

      // IF THE PRODUCT EXISTS IN THE CART
      if (existingItemIndex !== -1) {
         // UPDATE CART ITEM QUANTITY
         const updatedCart = cart.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: newQuantity } : item
         );
         setCart(updatedCart);
      } else {
         // FIND THE PRODUCT IN THE PRODUCTS LIST
         const productToAdd = products.find(item => item.id === productId);

         // ADD PRODUCT TO CART WITH QUANTITY
         if (productToAdd) {
            const updatedCart = [...cart, { ...productToAdd, quantity: 1 }];
            setCart(updatedCart)
         }
      }

      // UPDATE PRODUCT QUANTITY IN PRODUCT LIST
      const updatedProducts = products.map(product =>
         product.id === productId ? { ...product, quantity: newQuantity } : product
      );
      setProducts(updatedProducts)

      // REMOVE PRODUCT FROM CART IF QUANTITY IS ZERO
      if (newQuantity === 0) {
         const updatedCart = cart.filter(item => item.id !== productId)
         setCart(updatedCart)
      }
   }

   // SAVED ORDER
   let totalArray = cart.map(item => item.price * item.quantity)
   let total = 0
   for (let index = 0; index < totalArray.length; index++) {
      total += parseFloat(totalArray[index])
   }

   const orderSummary = {
      orders: cart.map(item => ({
         idProduct: item.id,
         name: item.name,
         price: item.price,
         quantity: item.quantity,
         total: item.price * item.quantity
      })),
      idTable: idTable,
      webPageCompany: company,
      total: total
   }

   const handleSubmitOrder = async (e) => {
      e.preventDefault()
      try {
         if (cart.length > 0) {
            const res = await toast.promise(
               Orders.add(orderSummary),
               {
                  loading: 'Envoi de la commande...',
                  success: <b>Votre commande a été ajoutée !</b>,
                  error: <b>Votre commande n'a pas été envoyée.</b>,
               }
            )

            // RESET CART AND PRODUCT
            const resetProducts = products.map(product => ({ ...product, quantity: 0 }))
            setCart([])
            setProducts(resetProducts)
            toast.success("Nous avons recu votre commande.")
         }
         else {
            toast.error("Selectionner un produit avant de commander")
         }
      } catch (err) {
         useHandleError(err, Navigate)
      }
   }

   return (
      <div className='order'>
         <div className='container-products' >
            <div className='content-title'>
               <button className='Btn Error' onClick={(e) => window.location.reload()}>Nos produits</button>
               <div className='d-flex'>
                  <div className='d-flex'>
                     <button className='Btn Success Btn-size me-1' onClick={() => Navigate(-1)}>
                        <RemixIcons.RiArrowLeftLine size={15} />
                        <span className='btn-text'>Retour</span>
                     </button>
                     <button className='Btn Update Btn-size me-1' onClick={() => setMode(!mode)}>
                        {mode ? <RemixIcons.RiMenu5Line size={15} /> : <RemixIcons.RiListCheck2 size={15} />}
                        <span className='btn-text'>Mode d'affichage</span>
                     </button>
                  </div>
                  <button className='Btn Update Btn-size' onClick={() => setShowCart(true)}>
                     <RemixIcons.RiShoppingCartLine size={15} />
                     <span className='btn-text'>Afficher le panier</span>
                  </button>
               </div>
            </div>

            {mode ?
               <div className='content-menu'>
                  {products.length > 0 ? products.map((product) => (
                     <div className='product' key={product.id}>
                        <img src={product.picture} alt='' />
                        <div className='details'>
                           <div className='resource'>
                              <span className='name-product'>{product.name}</span>
                           </div>
                           <div className='control'>
                              <div className='control-btn'>
                                 <button onClick={() => { updateProductQuantity(product.id, product.quantity - 1); setShowCart(true) }}>-</button>
                                 <span>{product.quantity}</span>
                                 <button onClick={() => { updateProductQuantity(product.id, product.quantity + 1); setShowCart(true) }}>+</button>
                              </div>
                              <span>{product.price} fcfa</span>
                           </div>
                           <div className='add-btn'>
                              <button onClick={() => { handleAddToCart(product); setShowCart(true) }} disabled={cart.some(item => item.id === product.id)}><RemixIcons.RiShoppingCartLine /> panier</button>
                           </div>
                        </div>
                     </div>
                  )) : <div> Aucun produit disponible !</div>}
               </div>
               :
               <div className='content-list'>
                  <table>
                     <thead>
                        <th>Produit</th>
                        <th className='text-center'>Qté</th>
                        <th className='text-center'>P.U</th>
                        <th className='text-end'>Détails</th>
                     </thead>
                     <tbody>
                        {products.length > 0 ? products.map((product) => (
                           <tr key={product.id}>
                              <td >{product.name}</td>
                              <td className='text-center'>
                                 <div className='control-btn'>
                                    <button onClick={() => { updateProductQuantity(product.id, product.quantity - 1); setShowCart(true) }}>-</button>
                                    <span>{product.quantity}</span>
                                    <button onClick={() => { updateProductQuantity(product.id, product.quantity + 1); setShowCart(true) }}>+</button>
                                 </div>
                              </td>
                              <td className='text-center'>{product.price} fcfa</td>
                              <td className='add-btn text-end'>
                                 <button onClick={() => { handleAddToCart(product); setShowCart(true) }} disabled={cart.some(item => item.id === product.id)}>
                                    <RemixIcons.RiShoppingCartLine />
                                    <span> panier</span>
                                 </button>
                              </td>
                           </tr>
                        )) : <div> Aucun produit disponible !</div>}
                     </tbody>
                  </table>
               </div>
            }
            <div className='d-flex justify-content-center align-items-center'>
               <Pagination
                  pageable={pageable}
                  setPage={setPage}
               />
            </div>
         </div>

         <div className={showCart ? 'container-carts-show' : 'container-carts'}>
            <div className='content-title'>
               <span className='title'>Panier à produits</span>
               <div className='close' onClick={() => setShowCart(false)}><RemixIcons.RiCloseLine /></div>
            </div>

            <div className='content'>
               <div className="sm-cart">
                  {cart.map((item, index) => (
                     <div className="cart" key={index}>
                        <img src={item.picture} alt="" />
                        <div className="details">
                           <span>{item.name}</span>
                           <span>{item.price}</span>
                           <div className="control">
                              <div className='control-btn'>
                                 <button onClick={() => updateProductQuantity(item.id, item.quantity - 1)}>-</button>
                                 <span>{item.quantity}</span>
                                 <button onClick={() => updateProductQuantity(item.id, item.quantity + 1)}>+</button>
                              </div>
                              <RemixIcons.RiCloseLine onClick={() => handleRemoveFromCart(item)} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className='total-price'>
                  <span> Montant total: </span>
                  <span>{cart.reduce((total, item) => total + item.price * item.quantity, 0)} fcfa</span>
               </div>

               <div className='submit-order'>
                  <button onClick={() => setShowCart(false)}><RemixIcons.RiArrowLeftLine size={16} /></button>
                  <button onClick={handleSubmitOrder}><RemixIcons.RiTimerLine size={16} />Commander</button>
               </div>
            </div>
         </div>
      </div >
   )
}

export default Order