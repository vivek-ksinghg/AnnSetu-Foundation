import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AppContextNgo } from "../context/AppcontextNgo";
import { toast } from "react-toastify";
import { MapPin, Filter } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const RequestPage = () => {
  const { backendUrl, ngo, token } = useContext(AppContextNgo);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [distanceKm, setDistanceKm] = useState(10);
  const [address, setAddress] = useState("");
  const [searching, setSearching] = useState(false);
  const [center, setCenter] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        if (tab === "all") {
          const res = await axios.get(`${backendUrl}/api/ngo/all-foods`);
          setDonations(res.data.data || res.data.foods || []);
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
        toast.error("Failed to load donations");
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [tab, backendUrl]);

  const searchNearby = async (source) => {
    try {
      if (!ngo?._id) return;
      setTab("nearby");
      setDistanceKm(10);
      setSearching(true);
      const useAddress = source === "ngo" ? ngo?.address || "" : address;
      const addrParam = useAddress
        ? `&address=${encodeURIComponent(useAddress)}`
        : "";
      const res = await axios.get(
        `${backendUrl}/api/ngo/nearby-food/${ngo._id}?distanceKm=10${addrParam}`
      );
      setDonations(res.data.data || []);
      if (res.data?.ngoLocation?.lat && res.data?.ngoLocation?.lon) {
        setCenter({
          lat: res.data.ngoLocation.lat,
          lon: res.data.ngoLocation.lon,
        });
      }
    } catch (err) {
      console.error("Error searching nearby:", err);
      toast.error("Failed to search nearby donations");
    } finally {
      setSearching(false);
    }
  };

  const updateLocalDonation = (updated) => {
    setDonations((prev) =>
      prev.map((d) => (d._id === updated._id ? { ...d, ...updated } : d))
    );
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const units = [
      { label: "year", value: 31536000 },
      { label: "month", value: 2592000 },
      { label: "day", value: 86400 },
      { label: "hour", value: 3600 },
      { label: "minute", value: 60 },
    ];

    for (let unit of units) {
      const count = Math.floor(seconds / unit.value);
      if (count >= 1)
        return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  };

  const isExpired = (createdAt, foodType) => {
    const currentTime = new Date();
    const uploadTime = new Date(createdAt);

    const diffInMs = currentTime - uploadTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    let expiryHours;

    if (foodType === "cooked") {
      expiryHours = 12;
    } else if (foodType === "raw") {
      expiryHours = 30;
    } else {
      // fallback (safety)
      expiryHours = 24;
    }

    return diffInHours >= expiryHours;
  };

  const accept = async (donationId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/ngo/donations/${donationId}/accept`,
        {},
        { headers: { token } }
      );
      if (res.data?.success) {
        updateLocalDonation(res.data.data);
        toast.success("Donation accepted");
      } else {
        toast.error(res.data?.message || "Failed to accept");
      }
    } catch (err) {
      console.error("Accept error:", err);
      toast.error(err.response?.data?.message || "Failed to accept");
    }
  };

  const reject = async (donationId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/ngo/donations/${donationId}/reject`,
        {},
        { headers: { token } }
      );
      if (res.data?.success) {
        setDonations((prev) => prev.filter((d) => d._id !== donationId));
        toast.info("Donation rejected and deleted");
      } else {
        toast.error(res.data?.message || "Failed to reject");
      }
    } catch (err) {
      console.error("Reject error:", err);
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  useEffect(() => {
    if (tab !== "nearby" || !center) return;
    if (!mapInstanceRef.current && mapContainerRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [center.lat, center.lon],
        12
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(map);
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });
      mapInstanceRef.current = map;
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lon], 12);
    }
    if (circleRef.current) circleRef.current.remove();
    circleRef.current = L.circle([center.lat, center.lon], {
      radius: distanceKm * 1000,
      color: "#16a34a",
    }).addTo(mapInstanceRef.current);
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    donations.forEach((d) => {
      const coords = d?.location?.coordinates;
      if (Array.isArray(coords) && coords.length === 2) {
        const m = L.marker([coords[1], coords[0]]).addTo(
          mapInstanceRef.current
        );
        markersRef.current.push(m);
      }
    });
  }, [tab, center, distanceKm, donations]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => setTab("all")}
              className={`px-4 py-2 rounded-xl border ${
                tab === "all" ? "bg-green-600 text-white" : "bg-white"
              }`}
            >
              All donations
            </button>
            <button
              onClick={() => setTab("nearby")}
              className={`px-4 py-2 rounded-xl border ${
                tab === "nearby" ? "bg-green-600 text-white" : "bg-white"
              }`}
            >
              Nearby donations
            </button>
            <button
              onClick={() => searchNearby("ngo")}
              disabled={searching}
              className={`px-4 py-2 rounded-xl border ${
                searching ? "bg-gray-400 text-white" : "bg-green-700 text-white"
              }`}
            >
              Nearby (10km) using NGO address
            </button>
          </div>

          {tab === "nearby" && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <label className="text-sm">Radius (km)</label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={distanceKm}
                  onChange={(e) =>
                    setDistanceKm(parseFloat(e.target.value) || 10)
                  }
                  className="w-24 border rounded-md px-2 py-1"
                />
              </div>
              <input
                type="text"
                placeholder="Enter address to analyze"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded-md px-3 py-1 w-64"
              />
              <button
                onClick={() => searchNearby("manual")}
                disabled={searching || !address}
                className={`px-3 py-1 rounded-md ${
                  searching || !address
                    ? "bg-gray-300"
                    : "bg-green-600 text-white"
                }`}
              >
                {searching ? "Analyzing…" : "Search Nearby"}
              </button>
            </div>
          )}
        </div>

        {tab === "nearby" && (
          <div
            ref={mapContainerRef}
            className="w-full h-72 rounded-xl border mb-6"
          ></div>
        )}
        {loading || searching ? (
          <div className="p-10 text-center">Loading…</div>
        ) : donations.length === 0 ? (
          <div className="p-10 text-center text-gray-600">
            No donations found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((d) => (
              <div key={d._id} className="bg-white p-5 rounded-xl shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded">
                    {d.foodType}
                  </span>
                  <span className="text-xs text-gray-500">{d.status}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{d.foodName}</h3>
                <p className="text-sm text-gray-700 mb-2">State: {d.state}</p>
                <p className="text-sm text-gray-700 mb-2">
                  Qty: {d.quantity} {d.unit}
                </p>
                {d.acceptedByNgo?.organizationName && (
                  <p className="text-sm text-blue-700 mb-2">
                    Accepted by: {d.acceptedByNgo.organizationName}
                  </p>
                )}
                {d.address && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {d.address}
                  </p>
                )}
                {
                  <span className="inline-block mt-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold tracking-wide">
                    upload on:{" "}
                    <span className="font-medium">{timeAgo(d.createdAt)}</span>
                  </span>
                }
                {typeof d.distance === "number" && (
                  <p className="text-sm text-purple-700 mt-2">
                    {d.distance.toFixed(2)} km away
                  </p>
                )}
                {d.status === "Pending" &&
                  (isExpired(d.createdAt, d.state) ? (
                    <div className="mt-4 w-full">
                      <div className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-md rounded-full transform hover:scale-105 text-center h-9 ">
                        ❌ Expired
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-2 w-full">
                      <button
                        onClick={() => accept(d._id)}
                        className="flex-1 px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 shadow-md"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => reject(d._id)}
                        className="flex-1 px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 shadow-md"
                      >
                        Reject
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
