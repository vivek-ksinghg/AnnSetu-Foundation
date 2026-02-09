
import React, { useState, useEffect, useContext } from 'react';

import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext.jsx';

const DonorNavbar = () => {
    
     const [open, setOpen] = useState(false);
     const [isScrolled, setIsScrolled] = useState(false);
     const navigate=useNavigate();
   
   const{token,setToken, role}=useContext(AppContext)
   
     const logOut = ()=>{
       setToken(false);
       localStorage.removeItem("token")
       localStorage.removeItem("role");
       navigate("/role")
     }
   
     // Handle scroll to shrink navbar
     useEffect(() => {
       const handleScroll = () => {
         if (window.scrollY > 50) {
           setIsScrolled(true);
         } else {
           setIsScrolled(false);
         }
       };
   
       window.addEventListener('scroll', handleScroll);
       return () => window.removeEventListener('scroll', handleScroll);
     }, []);
   
     const handleClick = () => {
       setOpen(true);
       // Auto-close dropdown after 2 seconds
       setTimeout(() => setOpen(false), 2000);
     };
   
     return (
       <nav
         className={`fixed top-0  left-0 w-full bg-green-500 text-white flex justify-between items-center z-50 transition-all duration-300 ${
           isScrolled ? 'h-13 px-4' : 'h-20 px-6'
         }`}
       >
         {/* Left: Logo + Title */}
         <div className="flex items-center space-x-3">
           <img
             src={assets.logo}
             alt="Logo"
             className={`transition-all duration-300 rounded-full ${
               isScrolled ? 'h-10 w-10' : 'h-20 w-20'
             }`}
           />
           <h1 className={`transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-5xl'} font-normal`}>
             AnnSetu Foundation
           </h1>
         </div>
   
         {/* Right: Menu */}
         <ul className="flex space-x-6 text-xl">
           <NavLink to='/home'>
           <li className="cursor-pointer">Home</li>
           </NavLink>
   
           <NavLink to={'/Impact'}>
           <li className="cursor-pointer">Impact</li>
           </NavLink>
           {/* About Us Dropdown */}
           <li className="relative cursor-pointer">
             
             <button onClick={handleClick} className="focus:outline-none flex items-center">
               About Us <span className="text-sm ml-1">▾</span>
             </button>
           
             {open && (
               <ul className="absolute left-0 mt-3 w-52 rounded-xl bg-green-200 text-gray-700 shadow-2xl animate-fade-slide">
                 <NavLink to={'/about/faq'}>
                 <li className="px-5 py-3 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 rounded-t-xl">
                   FAQ's
                 </li>
                 </NavLink>
   
                 <NavLink to={'/about/hiw'}>
                 <li className="px-5 py-3 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200">
                   How it Works
                 </li>
                 </NavLink>
   
                 <NavLink to={'/about/contactus'}>
                 <li className="px-5 py-3 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 rounded-b-xl">
                   Contact Us
                 </li>
                </NavLink>
   
               </ul>
             )}
           </li>
            
           {/* <NavLink to={'/blog'}>
           <li className="cursor-pointer">Blogs</li>
           </NavLink> */}
   
           
  <li onClick={()=> navigate('/blog')} className="cursor-pointer">Blogs</li>
  <li onClick={()=> navigate('/allfoods')} className="cursor-pointer">AllFoods</li>
  
  

  {/* Hero Donate Now Button (donor only) */}
  {token && role === 'donor' && (
    <li
      onClick={() => navigate('/addDonation')}
      className="relative cursor-pointer px-8 py-3 rounded-full font-extrabold text-lg 
                 text-white  from-green-500 via-green-600 to-green-700
                 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300
                  hover:from-green-700 hover:via-green-800 hover:to-green-900
                 hover:text-yellow-100
                 overflow-hidden">
      Donate Now
    </li>
  )}
           
   
           <div  className='flex items-center gap-4'>
             {
             token && role === 'donor' ?
             <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
   
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
               <div className='min-w-48 bg-stone-100 rounded flex-col gap-4 p-4'>
                <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                {role === 'donor' && <p onClick={()=>navigate('/my-donations')} className='hover:text-black cursor-pointer'>My Donation</p>}
                {role === 'donor' && <p onClick={()=>navigate('/my-certifications')} className='hover:text-black cursor-pointer'>My Certifications</p>}
                 <p onClick={logOut} className='hover:text-black cursor-pointer '>Log Out</p>
               </div>
              </div>
             </div>:
   
             <li onClick={()=>navigate('/role')} className="cursor-pointer border-white">Join Now</li>
   
   
             }
           </div>
    
           
       
         </ul>
       </nav>
  )
}

export default DonorNavbar
