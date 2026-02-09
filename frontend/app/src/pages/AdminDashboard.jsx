import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { AppContext } from "../context/Appcontext.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { backendUrl, token } = useContext(AppContext);
  const [stats, setStats] = useState({
    ngos: 0,
    volunteers: 0,
    donors: 0,
    donations: 0,
    pendingNgos: 0,
    pendingVolunteers: 0,
  });

  const loadStats = async () => {
    try {
      if (!token) {
        toast.error("Admin not logged in");
        return;
      }
      const { data } = await axios.get(`${backendUrl}/api/admin/stats`, {
        headers: { token },
      });
      if (data?.success) {
        setStats(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load stats");
    }
  };

  

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token]);

  return (
 <div className="mt-12 px-6 max-w-7xl mx-auto">
  {/* Header */}
  <h2 className="text-4xl font-extrabold text-center mb-12">
    Admin Dashboard

 
  </h2>



  {/* 3D Cards Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    {[
      { title: "Total NGOs", value: stats.ngos, gradient: "from-blue-500 to-blue-700",path:"/admin/AllNgo" },
      { title: "Volunteers", value: stats.volunteers, gradient: "from-purple-500 to-purple-700", path:"/admin/AllVolunteer" },
      { title: "Donors", value: stats.donors, gradient: "from-green-500 to-green-700" ,path:"/admin/AllDonor"},
      { title: "Donations", value: stats.donations, gradient: "from-yellow-500 to-orange-600" ,path:"/admin/donations"},
      { title: "Pending NGOs", value: stats.pendingNgos, gradient: "from-red-500 to-red-700", path:"/admin/applications" },
      { title: "Pending Volunteers", value: stats.pendingVolunteers, gradient: "from-pink-500 to-rose-600" ,path:"/admin/applications" },
    ].map((card, index) => (
      <div
        key={index}
         onClick={() => navigate(card.path)}
        className="relative group"
      >
        {/* Shadow base (3D effect) */}
        <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl translate-y-6 group-hover:translate-y-8  transition-all"></div>

        {/* Main Card */}
        <div
          className={`
            relative h-48 rounded-2xl p-6
            bg-gradient-to-br ${card.gradient}
            text-white
            transform transition-all duration-300
            group-hover:-translate-y-3 group-hover:scale-[1.03]
            shadow-[0_20px_40px_rgba(0,0,0,0.4)]
          `}
        >
          <div className="text-sm uppercase tracking-widest opacity-80">
            {card.title}
          </div>

          <div className="mt-6 text-5xl font-extrabold">
            {card.value}
          </div>

          {/* Decorative 3D shine */}
          <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition"></div>
        </div>
      </div>
    ))}
  </div>




</div>

  );
};

export default AdminDashboard;
