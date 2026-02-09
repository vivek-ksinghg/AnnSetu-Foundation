import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";

const AdminAllDonor = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all donors
  const fetchDonors = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${backendUrl}/api/admin/AllDonor`,
        {
          headers: {
            token,
          },
        }
      );

      if (res.data.success) {
        setDonors(res.data.data || []);
      } else {
        toast.error("Failed to fetch donors");
      }
    } catch (error) {
      
      toast.error(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete donor
  const deleteDonor = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this donor?"
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/donors/${id}`,
        {
          headers: {
            token,
          },
        }
      );

      if (res.data.success) {
        toast.success("Donor deleted");
        setDonors((prev) =>
          prev.filter((d) => d._id !== id)
        );
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
    
      toast.error(
        error.response?.data?.message || "Server error"
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchDonors();
    }
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          All Donors
        </h2>

        <button
          onClick={fetchDonors}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          ⏳ Loading donors...
        </div>
      ) : donors.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No donors found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {donors.map((d) => (
            <div
              key={d._id}
              className="relative rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-800">
                {d.name}
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                📧 {d.email}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                📞 {d.phone || "N/A"}
              </p>

              <p className="text-xs text-gray-400 mt-3">
                Joined on{" "}
                {new Date(d.createdAt).toLocaleDateString()}
              </p>

              {/* Actions */}
              <button
                onClick={() => deleteDonor(d._id)}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                <Trash2 size={16} />
                Delete Donor
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllDonor;
