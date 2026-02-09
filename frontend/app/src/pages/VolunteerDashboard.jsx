import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VolunteerDashboard = () => {
  const { userData, token, backendUrl, role, loadUserProfileData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    completed: 0,
  });

  useEffect(() => {
    if (!userData && token && role === "volunteer") {
      loadUserProfileData();
    }
  }, [userData, token, role]);

  useEffect(() => {
    if (token && role === "volunteer") {
      loadStats();
    }
  }, [token, role]);

  const loadStats = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/volunteer/dashboard-stats`,
        { headers: { token } }
      );

      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch {
      console.error("Failed to load stats");
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 mt-20">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome, {userData.name} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Thank you for helping distribute food to those in need.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                userData.approved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {userData.approved ? "Approved Volunteer" : "Approval Pending"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Pending Requests</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {stats.pending}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Active Tasks</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {stats.active}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Completed Deliveries</p>
            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {stats.completed}
            </h2>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Actions
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => navigate("/volunteer/requests")}
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              View Requests
            </button>

            <button
              onClick={() => navigate("/volunteer/active-tasks")}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Active Tasks
            </button>

            <button
              onClick={() => navigate("/volunteer/history")}
              className="px-5 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800"
            >
              Delivery History
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VolunteerDashboard;
