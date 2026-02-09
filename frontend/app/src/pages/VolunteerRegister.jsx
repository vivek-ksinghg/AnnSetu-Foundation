import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../context/Appcontext.jsx";
import { useNavigate } from "react-router-dom";

const VolunteerRegister = () => {
  const { backendUrl, setToken, setRole, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Register"); // "Register" or "Login"
  const [submitted, setSubmitted] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    number: "",
    aadhaar: "",
    pan: "",
    address: "",
    password: "",
    skills: "",
    availability: "",
    assignedAreas: "",
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
    try {
      if (state === "Register") {
        const { data } = await axios.post(`${backendUrl}/api/volunteer/register`, registerData);
        if (data?.success) {
          toast.success("Thanks for your application. We will review and approve.");
          setSubmitted(true);
        } else {
          toast.error(data?.error || "Registration failed");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/volunteer/login`, loginData);
        if (data?.success) {
          toast.success("Login successful");
          if (data.token) {
            setToken(data.token);
            setRole(data.role || "volunteer");
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role || "volunteer");
            if (data.user) {
              setUserData(data.user);
            } else {
              try {
                const prof = await axios.get(`${backendUrl}/api/volunteer/my-profile`, { headers: { token: data.token } });
                if (prof.data?.success) {
                  setUserData(prof.data.data || prof.data.user || null);
                }
              } catch (e) {
                console.error(e);
              }
            }
            navigate("/volunteer/dashboard");
          }
        } else {
          toast.error(data?.message || "Login failed");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="mt-20 min-h-screen flex justify-center items-start bg-gradient-to-br from-green-50 via-green-100 to-green-200 px-6 py-12">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-10 border border-green-200 hover:shadow-3xl transition-shadow duration-500"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-2">
            {state === "Register" ? "Volunteer Registration" : "Login"}
          </h1>
          <p className="text-green-600 text-lg">
            {state === "Register"
              ? "Join as a volunteer to help NGOs and make a difference."
              : "Login to your volunteer account to continue."}
          </p>
          <div className="h-1 w-32 bg-green-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Form */}
        <Motion.form
          onSubmit={handleSubmit}
          key={state}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
        >
          {state === "Register" && (
            submitted ? (
              <div className="col-span-2 p-6 border rounded bg-green-50 text-green-700">
                Thank you for your application. We will review and approve your volunteer account shortly.
              </div>
            ) : (
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
                  label="Phone Number"
                  name="number"
                  value={registerData.number}
                  placeholder="Enter phone number"
                  onChange={handleRegisterChange}
                />
                <TextAreaField
                  label="Address"
                  name="address"
                  value={registerData.address}
                  placeholder="Enter your full address"
                  onChange={handleRegisterChange}
                />
                <InputField
                  label="Aadhaar Number"
                  name="aadhaar"
                  value={registerData.aadhaar}
                  placeholder="12-digit Aadhaar number"
                  onChange={handleRegisterChange}
                />
                <InputField
                  label="PAN Number"
                  name="pan"
                  value={registerData.pan}
                  placeholder="PAN format: ABCDE1234F"
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
                <InputField
                  label="Skills (comma separated)"
                  name="skills"
                  value={registerData.skills}
                  placeholder="e.g. delivery, cooking"
                  onChange={handleRegisterChange}
                />
                <SelectField
                  label="Availability"
                  name="availability"
                  value={registerData.availability}
                  options={[
                    { value: "", label: "Select" },
                    { value: "weekdays", label: "Weekdays" },
                    { value: "weekends", label: "Weekends" },
                    { value: "both", label: "Both" },
                  ]}
                  onChange={handleRegisterChange}
                />
                <InputField
                  label="Assigned Areas (comma separated)"
                  name="assignedAreas"
                  value={registerData.assignedAreas}
                  placeholder="e.g. Indore, Bhopal"
                  className="col-span-2"
                  onChange={handleRegisterChange}
                />
              </>
            )
          )}
          {state !== "Register" && (
            <>
              <InputField
                label="Email"
                name="email"
                value={loginData.email}
                type="email"
                placeholder="you@example.com"
                onChange={handleLoginChange}
                className="col-span-2"
              />
              <InputField
                label="Password"
                name="password"
                value={loginData.password}
                type="password"
                placeholder="••••••••"
                onChange={handleLoginChange}
                className="col-span-2"
              />
              <SelectField
                label="Role"
                name="role"
                value={loginData.role}
                onChange={handleLoginChange}
                options={[
                  { value: "", label: "Select role" },
                  { value: "volunteer", label: "Volunteer" },
                  { value: "admin", label: "Admin" },
                ]}
                className="col-span-2"
              />
            </>
          )}

          <div className="col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold rounded-3xl shadow-lg transition-all transform hover:scale-105"
            >
              {state === "Register" ? "Register as Volunteer" : "Login"}
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

// Reusable Input Component
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

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 2 }) => (
  <div>
    <label className="block text-green-700 font-semibold mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
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

export default VolunteerRegister;
