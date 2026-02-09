import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext.jsx";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { backendUrl, setToken, setRole } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // admin@gmail.com , qwert1234
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });
      if (data?.success && data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "admin");
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setToken(data.token);
        setRole("admin");
        toast.success("Admin login successful");
        navigate("/home");
      } else {
        toast.error(data?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-20 min-h-[70vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">Admin Login</p>
        <p>Use your admin credentials to continue</p>
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          disabled={loading}
          className="bg-green-500 disabled:opacity-60 text-white w-full py-2 rounded-md text-base"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AdminLogin;

