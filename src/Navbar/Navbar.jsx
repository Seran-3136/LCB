import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../assets/logo.png'
import './Navbar.css'
const Navbar = () => {
  return (
    <nav>
    <div className='types'>
        <img src={logo} width={80} height={80} />
        <div className='types1'>
        <Link to='/Login'>Sign-In</Link>
        <Link to='/Map'>Map</Link>
        
        </div>
       
    </div>
      
    </nav>
  )
}

export default Navbar
