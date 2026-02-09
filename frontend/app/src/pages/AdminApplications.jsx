import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/Appcontext.jsx";

const AdminApplications = () => {
  const { backendUrl } = useContext(AppContext);
  const token = localStorage.getItem("token") || "";
  const [ngos, setNgos] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPending = async () => {
    try {
      setLoading(true);
      const [ngoRes, volRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/pending/ngos`, { headers: { token } }),
        axios.get(`${backendUrl}/api/admin/pending/volunteers`, { headers: { token } }),
      ]);
      if (ngoRes.data?.success) setNgos(ngoRes.data.data || []);
      if (volRes.data?.success) setVolunteers(volRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approveNgo = async (id) => {
    try {
      const { data } = await axios.patch(`${backendUrl}/api/admin/ngos/${id}/approve`, {}, { headers: { token } });
      if (data?.success) {
        toast.success("NGO approved");
        setNgos((prev) => prev.filter((n) => n._id !== id));
      } else toast.error(data?.message || "Approval failed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const approveVolunteer = async (id) => {
    try {
      const { data } = await axios.patch(`${backendUrl}/api/admin/volunteers/${id}/approve`, {}, { headers: { token } });
      if (data?.success) {
        toast.success("Volunteer approved");
        setVolunteers((prev) => prev.filter((v) => v._id !== id));
      } else toast.error(data?.message || "Approval failed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
   <div className="mt-12 px-6 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

    {/* Pending NGOs */}
    <div className="relative rounded-3xl p-px bg-linear-to-br from-blue-400 to-indigo-500 shadow-xl">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-indigo-700">
            🏢 Pending NGOs
          </h3>
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            {ngos.length} requests
          </span>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            ⏳ Loading...
          </p>
        ) : ngos.length === 0 ? (
          <p className="text-center py-10 text-gray-400">
            No pending NGOs
          </p>
        ) : (
          <ul className="space-y-4">
            {ngos.map((n) => (
              <li
                key={n._id}
                className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    {n.organizationName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {n.email}
                  </div>
                </div>

                <button
                  onClick={() => approveNgo(n._id)}
                  className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold
                             bg-gradient-to-r from-green-400 to-emerald-500
                             hover:from-green-500 hover:to-emerald-600
                             shadow-md transition"
                >
                  ✔ Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* Pending Volunteers */}
    <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-purple-400 to-pink-500 shadow-xl">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-purple-700">
            🙋 Pending Volunteers
          </h3>
          <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-semibold">
            {volunteers.length} requests
          </span>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-500">
            ⏳ Loading...
          </p>
        ) : volunteers.length === 0 ? (
          <p className="text-center py-10 text-gray-400">
            No pending volunteers
          </p>
        ) : (
          <ul className="space-y-4">
            {volunteers.map((v) => (
              <li
                key={v._id}
                className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    {v.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {v.email}
                  </div>
                </div>

                <button
                  onClick={() => approveVolunteer(v._id)}
                  className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold
                             bg-gradient-to-r from-green-400 to-emerald-500
                             hover:from-green-500 hover:to-emerald-600
                             shadow-md transition"
                >
                  ✔ Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

  </div>
</div>

  );
};

export default AdminApplications;

