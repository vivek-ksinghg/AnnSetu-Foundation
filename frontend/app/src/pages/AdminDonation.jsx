import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/Appcontext.jsx";

const AdminDonation = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ngos, setNgos] = useState([]);
  const [selectedNgoId, setSelectedNgoId] = useState("");

  const loadDonations = async () => {
    try {
      setLoading(true);
      if (!token) {
        toast.error("Admin not logged in");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/admin/donations`,
        { headers: { token } }
      );

      if (data?.success) {
        setDonations(data.data || []);
      } else {
        toast.error(data?.message || "Failed to load donations");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const loadNgos = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`${backendUrl}/api/admin/AllNgo`, {
        headers: { token },
      });
      if (res.data?.success) {
        setNgos(res.data.data || []);
      }
    } catch {
      // ignore errors for NGO list
    }
  };

  const deleteDonation = async (id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/donations/${id}`,
        { headers: { token } }
      );

      if (data?.success) {
        toast.success("Donation deleted");
        setDonations((prev) => prev.filter((d) => d._id !== id));
      } else {
        toast.error(data?.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const [nearby, setNearby] = useState({ list: [], loading: false, distanceKm: 10, location: null });
  const loadNearbyFoods = async () => {
    try {
      if (!selectedNgoId) {
        return toast.error("Select an NGO to see nearby foods");
      }
      setNearby((prev) => ({ ...prev, loading: true }));
      const res = await axios.get(
        `${backendUrl}/api/admin/ngo/nearby-food/${selectedNgoId}?distanceKm=${nearby.distanceKm}`,
        { headers: { token } }
      );
      if (res.data?.success) {
        setNearby({
          list: res.data.data || [],
          loading: false,
          distanceKm: nearby.distanceKm,
          location: res.data.ngoLocation || null,
        });
      } else {
        toast.error(res.data?.message || "Failed to load nearby foods");
        setNearby((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
      setNearby((prev) => ({ ...prev, loading: false }));
    }
  };

  const acceptForNgo = async (donationId) => {
    try {
      if (!selectedNgoId) {
        return toast.error("Select an NGO first");
      }
      const res = await axios.post(
        `${backendUrl}/api/admin/ngo/donations/${donationId}/accept`,
        { ngoId: selectedNgoId },
        { headers: { token } }
      );
      if (res.data?.success) {
        toast.success("Donation accepted for NGO");
        const updated = res.data.data;
        setDonations((prev) =>
          prev.map((d) => (d._id === donationId ? updated : d))
        );
      } else {
        toast.error(res.data?.message || "Accept failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  useEffect(() => {
    if (token) {
      loadDonations();
      loadNgos();
    }
  }, [token]);

  return (
     <div className="max-w-7xl mx-auto px-6 py-10">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-extrabold text-gray-800">
        Donation History
      </h2>

      <button
        onClick={loadDonations}
        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
      >
        🔄 Refresh
      </button>
    </div>
    {/* NGO Selector */}
    <div className="flex items-center gap-3 mb-6">
      <label className="text-sm text-gray-700">Act on behalf of NGO:</label>
      <select
        value={selectedNgoId}
        onChange={(e) => setSelectedNgoId(e.target.value)}
        className="px-3 py-2 border rounded-md"
      >
        <option value="">Select NGO</option>
        {ngos.map((n) => (
          <option key={n._id} value={n._id}>
            {n.organizationName}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={1}
        max={100}
        value={nearby.distanceKm}
        onChange={(e) => setNearby((prev) => ({ ...prev, distanceKm: Number(e.target.value) || 10 }))}
        className="ml-4 w-24 px-3 py-2 border rounded-md"
        placeholder="Km"
        aria-label="Distance in km"
      />
      <button
        onClick={loadNearbyFoods}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
      >
        Nearby Foods
      </button>
    </div>

    {/* Loading / Empty */}
    {loading ? (
      <div className="text-center py-20 text-gray-500">
        ⏳ Loading donations...
      </div>
    ) : donations.length === 0 ? (
      <div className="text-center py-20 text-gray-500">
        No donations found.
      </div>
    ) : (
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full border-collapse">
          {/* Table Head */}
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Details</th>
              <th className="px-6 py-4 text-left">Donor</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {donations.map((d, index) => (
              <tr
                key={d._id}
                className={`border-b hover:bg-indigo-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* Type */}
                <td className="px-6 py-4 font-medium text-gray-800">
                  {d.donationType}
                </td>

                {/* Details */}
                <td className="px-6 py-4 text-gray-600">
                  {d.donationType === "Food" ? (
                    <>
                      <div className="font-semibold">{d.foodName}</div>
                      <div className="text-sm text-gray-500">
                        {d.quantity} {d.unit}
                      </div>
                    </>
                  ) : (
                    <div className="font-semibold text-green-700">
                      ₹ {d.amount}
                    </div>
                  )}
                </td>

                {/* Donor */}
                <td className="px-6 py-4 text-gray-700">
                  {d?.donor?.name || "-"}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full
                      ${
                        d.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : d.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {d.status}
                  </span>
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(d.createdAt).toLocaleString()}
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => deleteDonation(d._id)}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
                  >
                    ❌ Delete
                  </button>
                  {d.donationType === "Food" && d.status === "Pending" && (
                    <button
                      onClick={() => acceptForNgo(d._id)}
                      className="ml-3 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition"
                    >
                      ✅ Accept for NGO
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Nearby Foods Section */}
    {selectedNgoId && (
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Nearby Foods</h3>
          {nearby.location && (
            <div className="text-sm text-gray-600">
              NGO Location: lat {nearby.location.lat.toFixed(4)}, lon {nearby.location.lon.toFixed(4)} | Radius {nearby.distanceKm} km
            </div>
          )}
        </div>
        {nearby.loading ? (
          <div className="text-gray-500">Loading nearby foods...</div>
        ) : nearby.list.length === 0 ? (
          <div className="text-gray-500">No nearby foods found.</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 text-left">Food</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                  <th className="px-6 py-4 text-left">Distance (km)</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Address</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {nearby.list.map((f) => (
                  <tr key={f._id} className="border-b">
                    <td className="px-6 py-3">{f.foodName}</td>
                    <td className="px-6 py-3">
                      {f.quantity} {f.unit}
                    </td>
                    <td className="px-6 py-3">{(f.distance ?? 0).toFixed(2)}</td>
                    <td className="px-6 py-3">{f.status}</td>
                    <td className="px-6 py-3">{f.address || "-"}</td>
                    <td className="px-6 py-3 text-center">
                      {f.status === "Pending" && (
                        <button
                          onClick={() => acceptForNgo(f._id)}
                          className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition"
                        >
                          ✅ Accept for NGO
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </div>
  );
};

export default AdminDonation;
