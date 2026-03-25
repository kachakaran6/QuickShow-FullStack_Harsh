import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30'>
      <Link to="/" className="logo-container">
        <span className='logo-text'>Movie<span>Swift</span></span>
      </Link>
    </div>
  )
}

export default AdminNavbar
