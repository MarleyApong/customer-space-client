import React, { useState } from 'react'
import * as RemixIcons from "react-icons/ri"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { PulseLoader } from 'react-spinners'
import { Authentification } from '../../services/authentificationService'
import { Account } from '../../services/accountService'
import logo from '../../assets/img/logo/cs-logo-red.png'
import './login.scss'

const Login = () => {
   const Navigate = useNavigate()
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [wait, setWait] = useState(true)

   const handleLogin = async (e) => {
      e.preventDefault()
      if (email === "" || password === "") {
         toast.error("Veuillez remplir tous les champs !")
      }
      else {
         setWait(false)
         try {
            const res = await Authentification.login(email, password)
            console.log("res", res);
            const token = res.data.token
            const idUser = res.data.user.id
            const role = res.data.user.Role.id
            const env = res.data.user.Env.id
            const idStatus = res.data.user.Status.id
            setWait(true)
            if (res.data.user.Status.name !== 'actif') {
               toast.error("Accès non authorisé !")
            }
            else {
               Account.saveToken(token, idUser, role, env, idStatus)
               Navigate("/dashboard")
            }

         } catch (err) {
            console.log(err);
            setWait(true)
            if (err.response) {
               if (err.response.data.error.name === 'NotFound') {
                  toast.error("Email ou mot de passe incorrect !")
               }
               else if (err.response.data.error.name === 'ProcessHashFailed') {
                  toast.error("Email ou mot de passe incorrect !")
               }
               else if (err.response.data.error.name === 'MissingData') {
                  toast.error("Veuillez remplir tous les champs !")
               }
               else if (err.response.data.error.name === 'AccessForbidden') {
                  toast.error("Contactez votre administrateur.")
                  toast.error("Accès réfusé !")
               }
               else {
                  toast.error("Oups ! Quelque chose a mal tournée.", {
                     style: {
                        textAlign: 'center',
                        width: 'auto'
                     }
                  })
               }
            }
            else {
               console.log("err", err);
               toast.error("Connexion au serveur a échoué !")
            }
         }
      }
   }

   return (
      <div className="Login">
         <div className="Container">
            <div className="Left">
               {/* <h1>Bienvenue sur customer space</h1>
               <p>Connectez-vous pour continuer</p> */}
               <span>Copyright &#xa9;customer-space 2024 | <a target='_blank' href="https://www.allhcorp.com" rel="noreferrer">made by allhcorp</a> </span>
            </div>
            <div className="Right">
               <form onSubmit={handleLogin} method='post' className="Form">
                  <div className="Logo">
                     <img src={logo} alt="" />
                     <span>customer <strong>space</strong></span>
                  </div>
                  <h2>Connexion</h2>
                  <div className="InputBox">
                     <div className="Icon">
                        <RemixIcons.RiMailLine />
                     </div>
                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' autoComplete='off' />
                  </div>
                  <div className="InputBox">
                     <div className="Icon">
                        <RemixIcons.RiKeyLine />
                     </div>
                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Mot de passe' autoComplete='off' />
                  </div>
                  <div className="InputBox">
                     {
                        wait ?
                           <input type="submit" value='Se connecter' /> :
                           <button>Vérification <PulseLoader color="#fff" size='5' /></button>
                     }
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}

export default Login