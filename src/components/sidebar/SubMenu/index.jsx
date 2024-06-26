import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import * as RemixIcons from "react-icons/ri"

const SubMenu = ({ item }) => {
   const [subnav, setSubnav] = useState(false)
   const showSubnav = () => setSubnav(!subnav)

   return (
      <>
         <NavLink to={item.Link} className={(Link) => (Link.isActive ? "LinkActive" : "")} onClick={item.subNav && showSubnav}>
            <i> <item.Icon/></i>
            <span>{item.Display}</span>
            {item.subNav && subnav ? <RemixIcons.RiSubtractLine className='IconText'/> : item.subNav ? <RemixIcons.RiAddLine className='IconText'/> : null}
         </NavLink>
         {
            subnav && item.subNav.map((item, index) => {
               return (
                  <NavLink to={item.Link} key={index} className={(Link) => (Link.isActive ? "LinkActive2 sousMenu" : "sousMenu")}>
                     <i> <item.Icon/></i>
                     <span>{item.Display}</span>
                  </NavLink>
               )
            })
         }
      </>
   )
}

export default SubMenu