import {React, useState} from 'react'
import logo from './images/logo.png'

function LandingNavbar() {

  const [nav, setNav] = useState(false);

  const changeBackground = () => {
    if(window.scrollY >= 50){
      setNav(true);
    }else{
      setNav(false);
    }
  }
  window.addEventListener('scroll', changeBackground);

  return (
    <div className={nav ? 'nav active' : 'nav'}>
      <a href='#' className='logo'>
        <img src={logo} alt='' />
      </a>
      <input type='checkbox' className='menu-btn' id='menu-btn' />
      <label className='menu-icon'>
        <span className='nav-icon'></span>
      </label>
      <ul className='menu'>
        <li><a href='#'>Home</a></li>
        <li><a href='#'>Features</a></li>
        <li><a href='#'>Pricing</a></li>
      </ul>
    </div>
  )
}

export default LandingNavbar