import React from 'react'
import logo from '../../assets/logo.png';
import avatar from '../../assets/avatar.png';
import { Link,useLocation } from 'react-router-dom';
import { GrSearch } from "react-icons/gr";


const Header = () => {

    const location = useLocation();

  return (
    <nav className='w-full h-18 bg-zinc-900 flex items-center p-6 '>
      <div className='w-[10%] flex items-center h-full'>
        <img className='w-36' src={logo} alt='logo' />
      </div>

      <div className='flex w-[90%] justify-between items-center'>
      <div className='flex items-center gap-6 ml-12 '>
       
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/tvShows'} >TV Shows</NavLink>
        <NavLink to={'/movies'} >Movies</NavLink>
        <NavLink to={'/new&popular'} >New & Popular</NavLink>
        <NavLink to={'/myList'} >My List</NavLink>

        
      </div>
      <div className='flex items-center gap-8'>
          <button className='flex items-center '>
          <GrSearch className='text-white text-2xl cursor-pointer' />
          </button>

          <Link to={'/login'}>
            <img className='w-8 h-8 rounded cursor-pointer' src={avatar} alt="avatar" />
          </Link>
          

        </div>
      </div>
    </nav>
  );

}

  const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={` hover:text-white cursor-pointer ${isActive ? 'text-white'  : 'text-gray-300'}`}>
            {children}
        </Link>
    );
}



export default Header;
