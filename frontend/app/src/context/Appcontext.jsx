import { useEffect } from "react";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";



export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    if (token &&  !role) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      localStorage.setItem("role", decoded.role);
    }
  }, [token, role]);

  const [donor, setDonor] = useState(
    JSON.parse(localStorage.getItem("donor")) || null
  );

  const [userData, setUserData] = useState(false);
  // Foods
  const [foods, setFoods] = useState([]);

  const loadUserProfileData = async () => {
    try {
      let url = "";
      if (role === "donor") {
        url = backendUrl + "/api/donor/my-profile";
      } else if (role === "volunteer") {
        url = backendUrl + "/api/volunteer/my-profile";
      } else {
        url = backendUrl + "/api/donor/my-profile";
      }
      const { data } = await axios.get(url, {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.data || data.user || null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // donate food
  const addDonation = async (donationData) => {
    try {
      if (!token) {
        toast.error("Please login first to donate!");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/donor/addDonation`,
        donationData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success("🎉 Donation successful!");
        return data.donation;
      } else {
        toast.error(data.message || "Failed to donate");
      }
    } catch (err) {
      console.error("Add donation error:", err);
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const loadAllFoods = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/ngo/all-foods`);
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data?.foods) ? data.foods : [];
      const foodItems = items.filter((item) => item.donationType === "Food");
      setFoods(foodItems);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load foods");
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     loadUserProfileData();
  //   } else {
  //     setUserData(false);
  //   }
  // }, [token]);

useEffect(() => {
  if (!token) {
    setUserData(false);
    return;
  }
  if (role === "donor" || role === "volunteer") {
    loadUserProfileData();
  }
}, [token, role]);

  const value = {
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    addDonation,
    foods,
    loadAllFoods,
    donor,
    setDonor,
    role,setRole
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
