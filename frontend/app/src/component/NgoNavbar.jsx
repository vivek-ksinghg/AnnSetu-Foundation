import React, { useContext, useState ,useEffect} from "react";
import { motion as Motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AppContextNgo } from "../context/AppcontextNgo";
import { assets } from "../assets/assets";

const NGONavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
    const [isScrolled, setIsScrolled] = useState(false);
  const {logoutNgo}=useContext(AppContextNgo)

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
      
  return (
    <nav className="fixed top-0 left-0 w-full z-50  bg-green-500 backdrop-blur-md shadow-md text-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
          <div className="flex items-center space-x-3">
                   <img
                     src={assets.logo}
                     alt="Logo"
                     className={`transition-all duration-300 rounded-full ${
                       isScrolled ? 'h-10 w-10' : 'h-20 w-20'
                     }`}
                   />
                   </div>
        
           <h1 className={`transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-5xl'} font-normal`}>
             AnnSetu Foundation
           </h1>
     

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-white font-medium">
          {["Home", "Requests", "Donations", "Volunteers"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative transition duration-200 ${
                    isActive ? "text-purple-700" : "hover:text-purple-600"
                  }`
                }
              >
                {item}
                <Motion.span
                  className="absolute left-0 bottom-[-4px] h-[2px] bg-purple-600"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Profile Section */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/ngo/profile" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
            <User size={18} />
            Profile 
          </NavLink>

             
               <button onClick={logoutNgo} className="mt-2 px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
               logout
              </button>
             
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/90 backdrop-blur-md shadow-md"
        >
          <ul className="flex flex-col items-center gap-4 py-4 text-gray-700 font-medium">
            {["Home", "Requests", "Donations", "Volunteers", "Contact"].map((item) => (
              <li key={item}>
                <NavLink
                  to={`/${item.toLowerCase()}`}
                  className="hover:text-purple-700 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  logoutNgo();
                  setMenuOpen(false);
                }}
                className="mt-2 px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
              >
                Logout
              </button>
            </li>

        
          </ul>
        </Motion.div>
      )}
    </nav>
  );
};

export default NGONavbar;
