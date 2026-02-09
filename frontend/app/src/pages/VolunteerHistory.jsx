import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext.jsx";

const VolunteerHistory = () => {
  const { backendUrl, token, role } = useContext(AppContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/volunteer/requests/history`, { headers: { token } });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setRows(list);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === "volunteer") load();
  }, [token, role]);

  if (role !== "volunteer") {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="text-gray-600">Only volunteers can view delivery history.</div>
      </div>
    );
  }

  const totalDeliveries = rows.length;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-700">Delivery History</h1>
          <button onClick={load} className="px-3 py-2 rounded bg-green-600 text-white">
            Refresh
          </button>
        </div>
        <div className="mb-4 text-gray-800">
          Total Deliveries: <span className="font-semibold">{totalDeliveries}</span>
        </div>
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-gray-500">No deliveries</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded border">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">Food</th>
                  <th className="py-2 px-3 text-left">Quantity</th>
                  <th className="py-2 px-3 text-left">Address</th>
                  <th className="py-2 px-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-b">
                    <td className="py-2 px-3">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-3">{r.foodName || "-"}</td>
                    <td className="py-2 px-3">
                      {typeof r.quantity === "number" ? r.quantity : "-"} {r.unit || ""}
                    </td>
                    <td className="py-2 px-3">
                      {typeof r.address === "string" ? r.address : "-"}
                    </td>
                    <td className="py-2 px-3">{r.status || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerHistory;

