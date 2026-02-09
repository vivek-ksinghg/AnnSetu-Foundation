import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { AppContext } from "../context/Appcontext";
import { toast } from "react-toastify";

const AdminAllVolunteer = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all volunteers
  const fetchVolunteers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${backendUrl}/api/admin/AllVolunteer`,
        {
          headers: {
            token, // ✅ REQUIRED (authAdmin middleware)
          },
        }
      );

      if (res.data.success) {
        setVolunteers(res.data.data || []);
      } else {
        toast.error("Failed to fetch volunteers");
      }
    } catch (error) {
      
      toast.error(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete volunteer
  const deleteVolunteer = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this volunteer?"
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/volunteers/${id}`,
        {
          headers: {
            token,
          },
        }
      );

      if (res.data.success) {
        toast.success("Volunteer deleted");
        setVolunteers((prev) =>
          prev.filter((v) => v._id !== id)
        );
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Server error"
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchVolunteers();
    }
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          All Volunteers
        </h2>

        <button
          onClick={fetchVolunteers}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">
          ⏳ Loading volunteers...
        </div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No volunteers found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {volunteers.map((v) => (
            <div
              key={v._id}
              className="relative rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              {/* Status Badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 text-xs rounded-full font-semibold
                  ${
                    v.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                `}
              >
                {v.approved ? "Approved" : "Pending"}
              </span>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-800">
                {v.name}
              </h3>

              <p className="text-sm text-gray-600 mt-2">
                📧 {v.email}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                📍 {v.address || "N/A"}
              </p>

              <p className="text-xs text-gray-400 mt-3">
                Joined on{" "}
                {new Date(v.createdAt).toLocaleDateString()}
              </p>

              {/* Actions */}
              <button
                onClick={() => deleteVolunteer(v._id)}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                <Trash2 size={16} />
                Delete Volunteer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllVolunteer;
