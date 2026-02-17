import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export const AppContextNgo = createContext();

 const AppContextProviderNgo = ({ children }) => {
  const backendUrl = (
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.PROD
      ? "https://annsetu-foundation.onrender.com"
      : "http://localhost:4000")
  ).replace(/\/$/, "");
const navigate=useNavigate()
  // 🔹 Auth states
  const [ngo, setNgo] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
      const [role, setRole] = useState(localStorage.getItem("role") || "");

  // ✅ Save token and user to localStorage
const saveAuthData = (ngoData, tokenData) => {
  setNgo(ngoData);
  setToken(tokenData);
  localStorage.setItem("ngo", JSON.stringify(ngoData));
  localStorage.setItem("token", tokenData);

  if (ngoData?.role) {
    setRole(ngoData.role);
    localStorage.setItem("role", ngoData.role);
  }
};


  
useEffect(() => {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.role) {
        setRole(decoded.role);
        localStorage.setItem("role", decoded.role);
      } else {
        console.warn("No role found in token");
      }
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
}, [token]);


  // ✅ NGO Registration
  const registerNgo = async (registerData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl+'/api/ngo/register', registerData);

      if (data?.success) {
        toast.success("Thanks for your application. We will review and approve.");
        return true;
      } else {
        toast.error(data?.error || "Registration failed");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NGO Login
  const loginNgo = async (loginData) => {
    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl+'/api/ngo/login', loginData);

      if (data.success) {
        saveAuthData(data.ngo, data.token);
        toast.success("Login successful ✅");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout NGO
  const logoutNgo = () => {
    localStorage.removeItem("ngo");
    localStorage.removeItem("token");
     localStorage.removeItem("role");
    
    setNgo(null);
    setToken("");
   navigate("/role")
    toast.info("Logged out successfully");
  };
   useEffect(()=>{
      if(token){
        navigate('/home')
      }
    },[token])

  // ✅ Auto login if data exists
  useEffect(() => {
    const storedNgo = localStorage.getItem("ngo");
    const storedToken = localStorage.getItem("token");
    if (storedNgo && storedToken) {
      setNgo(JSON.parse(storedNgo));
      setToken(storedToken);
    }
  }, []);


  const value={
        backendUrl,
        ngo,
        token,
        loading,
        registerNgo,
        loginNgo,
        logoutNgo,
        role,setRole
      }

  return (
    <AppContextNgo.Provider value={value}>
      {children}
    </AppContextNgo.Provider>
  );
};

export default AppContextProviderNgo;
