import React from 'react';
import avatarImage from '../../assets/formBg.webp';
import logo from '../../assets/logo.png';
import { Link,useLocation } from 'react-router-dom';
import Input from './Input';
import Button from './Button';

const Login = () => {
    const location = useLocation();
    const header = location.pathname === '/login' ? 'Sign In' : 'Sign Up';
    const value = location.pathname === '/login' ? 'Sign In' : 'Sign Up';
    const to= location.pathname === '/login' ? '/signup' : '/login';
    const option= location.pathname === '/login' ? 'Sign Up now.' : 'Sign In now.';
    
    
   
  
   
   

   


    const signup =location.pathname === '/signup';
  return (
    <div className="bg-cover bg-center w-full h-screen relative" style={{backgroundImage: `url(${avatarImage})`}}>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className='absolute top-0 left-0 w-60 flex items-center p-8'>
        <img src={logo} alt='logo' />
      </div>
      <form className="absolute inset-0 opacity-75 bg-black m-auto w-[450px] h-[600px] flex flex-col gap-6 px-16 py-8">
            
        <h1 className=' text-white text-3xl font-bold' style={{opacity: 1, important: true}}>{header}</h1>       
         <Input name="Email" />
         <Input name="Password"  />
         <Button 
         value={value}
         buttonTo={'/'}
         />
           
           {location.pathname === '/login' ?<Link to={'/forgotPassword'} className="text-white text-center">Forgot password ?</Link>: ""
}
          <div className='flex items-center text-white '>
            <input className='mr-2 w-4 h-4 border-none outline-none hover:cursor-pointer' type="checkbox" name="remember" id="remember" />
            <label className='cursor-pointer' htmlFor="remember">Remember me</label>
          </div>

          <div className='text-white flex items-center'>
            <p className='text-gray-400 '>New to Netflix? <Link to={to} className='text-white'>{option}</Link></p>
          </div>
          <p className='text-gray-400 '>This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.</p>
      </form>
    </div>
  );
};

export default Login;
