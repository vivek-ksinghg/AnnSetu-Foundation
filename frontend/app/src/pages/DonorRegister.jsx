import React, { useContext, useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from "../context/Appcontext";
import axios from 'axios'
import {toast} from "react-toastify"

const DonorRegister = () => {

  const {token , setToken , backendUrl, setDonor} = useContext(AppContext)
  const [state, setState] = useState("Register"); // "Register" or "Login"
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthday: "",
    password: "",
    bio: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  try{
    if(state === "Register"){

      const{data} =await axios.post(backendUrl + '/api/donor/register' , registerData)
     if (data.success) {
        localStorage.setItem("token", data.token);  // Save token
        
        setToken(data.token);                       // Update context

            // 🔴 yeh line add karo (donor info save karne ke liye)
        localStorage.setItem("donor", JSON.stringify(data.user)); 
        setDonor(data.user);
        toast.success("Registered successfully! Logging you in...");
        navigate("/"); 
     }else{
      toast.error(data.message)
    }
  }
    else{

      const{data} =await axios.post(backendUrl + '/api/donor/login' , loginData)
    
    if(data.success){
      localStorage.setItem("token" ,data.token);
      setToken(data.token)

        localStorage.setItem("donor", JSON.stringify(data.user)); 
      setDonor(data.user);
    }
    else{
      toast.error(data.message)
    }
       
    }

  } catch(error){
    console.log(error);
    toast.error(error.message);
  }
  };

  useEffect(()=>{
    if(token){
      navigate('/home')
    }
  },[token])

  return (
    <div className=" mt-20 min-h-screen flex justify-center items-start bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-6 py-12">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-10 border border-green-200 hover:shadow-3xl transition-shadow duration-500"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-2">
            {state === "Register" ? "Donor Registration" : "Login"}
          </h1>
          <p className="text-green-600 text-lg">
            {state === "Register"
              ? "Join our mission to save food and help those in need."
              : "Login to your account to continue."}
          </p>
          <div className="h-1 w-32 bg-green-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Form */}
        <Motion.form
          onSubmit={handleSubmit}
          key={state} // smooth switch animation
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start"
        >
          {state === "Register" ? (
            <>
              <InputField
                label="Full Name"
                name="name"
                value={registerData.name}
                placeholder="Enter full name"
                onChange={handleRegisterChange}
              />
              <InputField
                label="Email"
                name="email"
                value={registerData.email}
                type="email"
                placeholder="you@example.com"
                onChange={handleRegisterChange}
              />
              <InputField
                label="Phone"
                name="phone"
                value={registerData.phone}
                placeholder="Enter phone number"
                onChange={handleRegisterChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={registerData.gender}
                onChange={handleRegisterChange}
                options={[
                  { value: "", label: "Select" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
              <TextAreaField
                label="Address"
                name="address"
                value={registerData.address}
                placeholder="Enter your full address"
                className="col-span-2 md:col-span-2"
                onChange={handleRegisterChange}
              />
              <InputField
                label="Birthday"
                name="birthday"
                value={registerData.birthday}
                type="date"
                onChange={handleRegisterChange}
              />
              <InputField
                label="Password"
                name="password"
                value={registerData.password}
                type="password"
                placeholder="••••••••"
                onChange={handleRegisterChange}
              />
              <TextAreaField
                label="Bio"
                name="bio"
                value={registerData.bio}
                placeholder="Tell us something about yourself"
                className="col-span-2"
                onChange={handleRegisterChange}
              />
            </>
          ) : (
            <>
              <InputField
                label="Email"
                name="email"
                value={loginData.email}
                type="email"
                placeholder="you@example.com"
                onChange={handleLoginChange}
                className="col-span-4"
              />
              <InputField
                label="Password"
                name="password"
                value={loginData.password}
                type="password"
                placeholder="••••••••"
                onChange={handleLoginChange}
                className="col-span-4"
              />
              <SelectField
                label="Role"
                name="role"
                value={loginData.role}
                onChange={handleLoginChange}
                options={[
                  { value: "", label: "Select role" },
                  { value: "donor", label: "Donor" },
                  { value: "ngo", label: "NGO" },
                  { value: "volunteer", label: "Volunteer" },
                ]}
                className="col-span-4"
              />
            </>
          )}

          <div className="col-span-4 flex justify-center mt-6">
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold rounded-3xl shadow-lg transition-all transform hover:scale-105"
            >
              {state === "Register" ? "Register" : "Login"}
            </button>
          </div>
        </Motion.form>

        {/* Toggle */}
        <p className="mt-6 text-center text-green-700 font-semibold">
          {state === "Register" ? (
            <>
              Already have an account?{" "}
              <span
                className="underline cursor-pointer hover:text-green-900"
                onClick={() => setState("Login")}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="underline cursor-pointer hover:text-green-900"
                onClick={() => setState("Register")}
              >
                Register here
              </span>
            </>
          )}
        </p>
      </Motion.div>
    </div>
  );
};

// Reusable components
const InputField = ({ label, name, value, onChange, placeholder, type = "text", className }) => (
  <div className={className}>
    <label className="block text-green-700 font-semibold mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 w-full p-3 border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300 transition-all"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, className }) => (
  <div className={className}>
    <label className="block text-green-700 font-semibold mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={2}
      className="mt-1 w-full p-3 border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300 transition-all"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, className }) => (
  <div className={className}>
    <label className="block text-green-700 font-semibold mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full p-3 border-2 border-green-200 rounded-xl shadow-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300 transition-all"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default DonorRegister;
