import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/Appcontext.jsx";

const AdminAllNgo = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all NGOs
  const loadNgos = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/AllNgo`, {
        headers: { token },
      });

      if (data?.success) {
        setNgos(data.data || []);
      } else {
        toast.error(data.message || "Failed to load NGOs");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Delete NGO
  const deleteNgo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this NGO?")) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/ngos/${id}`,
        { headers: { token } }
      );

      if (data?.success) {
        toast.success("NGO deleted successfully");
        setNgos((prev) => prev.filter((ngo) => ngo._id !== id));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  useEffect(() => {
    if (token) loadNgos();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          All Registered NGOs
        </h2>
        <button
          onClick={loadNgos}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          ⏳ Loading NGOs...
        </div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No NGOs found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 text-left">NGO Name</th>
                <th className="p-4 text-left">Address</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {ngos.map((ngo) => (
                <tr
                  key={ngo._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {ngo.organizationName}
                  </td>

                  <td className="p-4 text-gray-600">
                    {ngo.address || "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {ngo.email}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteNgo(ngo._id)}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllNgo;
