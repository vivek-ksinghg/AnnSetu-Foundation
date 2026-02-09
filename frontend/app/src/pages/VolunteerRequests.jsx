import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext.jsx";
import { MapPin } from "lucide-react";

const VolunteerRequests = () => {
  const { backendUrl, token, role } = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const distanceKm = 20;

  const loadRequests = async () => {
    try {
      setLoading(true);
      const url = nearbyOnly
        ? `${backendUrl}/api/volunteer/requests/nearby?distanceKm=${distanceKm}`
        : `${backendUrl}/api/volunteer/requests/all`;
      const res = await axios.get(url, { headers: { token } });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setRequests(list);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (donationId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/volunteer/requests/${donationId}/accept`,
        {},
        { headers: { token } }
      );
      if (res.data?.success) {
        setRequests((prev) => prev.filter((r) => r._id !== donationId));
      }
    } catch {
      // silent fail UI
    }
  };

  useEffect(() => {
    if (token && role === "volunteer") {
      loadRequests();
    }
  }, [token, role, nearbyOnly]);

  if (role !== "volunteer") {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="text-gray-600">Only volunteers can view delivery requests.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Volunteer Requests</h1>
              <p className="text-sm text-gray-500 mt-1">
                {nearbyOnly
                  ? `Showing requests within ${distanceKm} km. Accept is enabled.`
                  : "Showing all NGO-accepted requests. Apply Nearby to enable Accept."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={nearbyOnly}
                  onChange={(e) => setNearbyOnly(e.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />
                <span className="text-sm font-medium text-gray-800">Nearby (20 km)</span>
              </label>

              <button
                onClick={loadRequests}
                className="px-4 py-2 rounded-xl bg-green-600 text-white shadow-sm hover:bg-green-700 transition"
              >
                Refresh
              </button>
            </div>
          </div>

          {!nearbyOnly && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              To accept a request, first enable <span className="font-semibold">Nearby (20 km)</span>.
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="h-5 w-2/3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-100 rounded mt-4 animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded mt-3 animate-pulse" />
                    <div className="h-10 w-full bg-gray-100 rounded-xl mt-5 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-14">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <MapPin size={20} className="text-gray-500" />
                </div>
                <div className="mt-4 text-gray-900 font-semibold">No requests found</div>
                <div className="mt-1 text-sm text-gray-500">
                  {nearbyOnly ? `Try switching off Nearby or refreshing.` : "Try refreshing to load requests."}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {requests.map((r) => {
                  const address =
                    typeof r.address === "string" ? r.address : r.address?.line1 || r.address?.line2 || "";
                  const qtyLine = `${r.quantity ?? "-"} ${r.unit || ""}`.trim();
                  const status = String(r.status || "Accepted");
                  const statusBadge =
                    status.toLowerCase() === "accepted"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-50 text-gray-700 border-gray-200";

                  return (
                    <div
                      key={r._id}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-lg font-semibold text-gray-900 truncate">{r.foodName || "Food"}</div>
                            <div className="mt-1 text-sm text-gray-600">Quantity: {qtyLine || "-"}</div>
                          </div>
                          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusBadge}`}>
                            {status}
                          </span>
                        </div>

                        <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                          <MapPin size={16} className="mt-0.5 text-gray-500" />
                          <div className="min-w-0">
                            <div className="font-medium text-gray-700">Pickup Location</div>
                            <div className="text-gray-600 truncate">{address || "-"}</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          {nearbyOnly && typeof r.distance === "number" ? (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {r.distance.toFixed(1)} km
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400"> </span>
                          )}

                          <button
                            onClick={() => acceptRequest(r._id)}
                            disabled={!nearbyOnly}
                            className="px-4 py-2 rounded-xl bg-green-600 text-white shadow-sm hover:bg-green-700 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
                          >
                            Accept
                          </button>
                        </div>
                      </div>

                      <div className="px-5 pb-5">
                        {!nearbyOnly && (
                          <div className="text-xs text-gray-500">
                            Enable <span className="font-semibold">Nearby (20 km)</span> to accept this request.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRequests;
