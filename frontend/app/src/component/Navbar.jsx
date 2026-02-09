import React from 'react';
import { NavLink } from 'react-router-dom';
import DonorNavbar from './DonorNavbar.jsx';
import VolunteerNavbar from './Volunteernavbar.jsx';
import NGONavbar from './NgoNavbar.jsx';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/Appcontext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { setToken, setRole } = useContext(AppContext);


  

  const role=localStorage.getItem('role');

  return (
    <>

      {role === 'donor' && <DonorNavbar />}
      {/* {role === 'volunteer' && <DonorNavbar/>} */}
      {role === 'volunteer' && <VolunteerNavbar/>}
  
      {role === 'ngo' && <NGONavbar />}
      {role === 'admin' && (
        <div className="w-full bg-white shadow">
          <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
            <div className="font-bold text-green-700">Admin Panel</div>
            <div className="flex gap-4">
              <Link to="/admin/dashboard" className="text-sm text-green-600">Dashboard</Link>
              <Link to="/admin/applications" className="text-sm text-green-600">Applications</Link>
              <Link to="/admin/donations" className="text-sm text-green-600">Donations</Link>
            
              
              <button
                className="text-sm text-red-600"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  localStorage.removeItem('admin');
                  setToken('');
                  setRole('');
                  navigate('/home');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {!role && <DonorNavbar />}
      
    </>

  );
};

export default Navbar;
