import { useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";

const VolunteerNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/home");
  };

  const linkClass = ({ isActive }) =>
    `cursor-pointer px-2 py-1 rounded transition ${
      isActive ? "text-yellow-300" : "hover:text-gray-200"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-green-500 text-white z-50 transition-all duration-300 ${
        isScrolled ? "h-14" : "h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div
          onClick={() => navigate("/volunteer/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={assets.logo}
            alt="Logo"
            className={`rounded-full transition-all duration-300 ${
              isScrolled ? "h-10 w-10" : "h-16 w-16"
            }`}
          />
          <h1 className={`transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-5xl'} font-normal`}>
             AnnSetu Foundation
           </h1>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-6 font-medium">
          <NavLink to="/volunteer/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/volunteer/requests" className={linkClass}>
            Requests
          </NavLink>

          <NavLink to="/volunteer/active-tasks" className={linkClass}>
            Active Tasks
          </NavLink>

          <NavLink to="/volunteer/history" className={linkClass}>
            History
          </NavLink>

          <NavLink to="/volunteer/profile" className={linkClass}>
            Profile
          </NavLink>

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </ul>
      </div>
    </nav>
  );
};

export default VolunteerNavbar;
