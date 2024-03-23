import React from 'react'
import logo from '../../assets/logo.png'

const Loader = ({loading}) => {
  return (
    <div className={`${loading? "":"hidden"}  flex items-center justify-center bg-zinc-900 w-full h-screen`}>
        <img className='w-[75%] md:w-[30%]' src={logo} alt="Loading..." />
      
    </div>
  )
}

export default Loader
