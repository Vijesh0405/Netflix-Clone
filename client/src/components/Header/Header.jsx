import React,{useState,useEffect} from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { Link, useLocation } from "react-router-dom";
import { GrSearch } from "react-icons/gr";

const Header = () => {
  const location = useLocation();
  const [show,handleShow] = useState(false);

  const transitionNavbar = () =>{
      if(window.scrollY >100){
          handleShow(true);
      }else{
          handleShow(false)
      }
  }

  useEffect(()=>{
      window.addEventListener('scroll',transitionNavbar);
      return () => window.removeEventListener('scroll',transitionNavbar);
  },[])


  return (
    <nav className={`w-full h-16 ${show && 'bg-zinc-900'} flex items-center p-6 fixed left-0 top-0 right-0 z-10 `}>
      <div className="w-36 md:w-[15%] lg:w-[10%] flex items-center h-full">
        <img className="w-40 md:w-36" src={logo} alt="logo" />
      </div>

      <div className="flex w-[90%] justify-between items-center ">
        <div className="hidden md:flex md:items-center md:gap-6 md:ml-12 ">
          <NavLink to={"/"}>Home</NavLink>
          <NavLink to={"/tvShows"}>TV Shows</NavLink>
          <NavLink to={"/movies"}>Movies</NavLink>
          <NavLink to={"/new&popular"}>New & Popular</NavLink>
          <NavLink to={"/myList"}>My List</NavLink>
        </div>
        <div className="flex items-center gap-8 fixed right-2">
          <button className="flex items-center ">
            <GrSearch className="text-white text-2xl cursor-pointer" />
          </button>

          <Link to={"/login"}>
            <img
              className="w-8 h-8 rounded cursor-pointer"
              src={avatar}
              alt="avatar"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={` hover:text-white cursor-pointer ${
        isActive ? "text-white" : "text-gray-300"
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;
