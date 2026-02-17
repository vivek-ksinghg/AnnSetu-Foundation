import React, { useContext, useEffect, useState } from "react";
import { AppContextNgo } from "../context/AppcontextNgo";
import axios from "axios";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const NgoProfile = () => {
  const { ngo, backendUrl, token } = useContext(AppContextNgo);
  const [monthly, setMonthly] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await axios.get(`${backendUrl}/api/ngo/stats/accepted-monthly`, {
          headers: { token }
        });
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        const formatted = data.map((d) => {
          const [year, month] = d.month.split("-");
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          const label = date.toLocaleString("en-US", { month: "short", year: "numeric" });
          return { label, count: d.count };
        });
        setMonthly(formatted);
      } catch {
        setMonthly([]);
      } finally {
        setLoadingStats(false);
      }
    };
    if (token) fetchStats();
  }, [backendUrl, token]);

 return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-white px-6 py-12 mt-20">
    {!ngo ? (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">
          Loading NGO profile…
        </div>
      </div>
    ) : (
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-green-700 tracking-tight">
                {ngo.organizationName || "NGO"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Registration No: {ngo.registrationNumber || "—"}
              </p>
            </div>

            <div className="flex gap-3">
              <span className="px-4 py-1.5 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                Verified NGO
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{ngo.email || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-gray-800 font-medium">{ngo.number || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Website</p>
                <p className="text-gray-800 font-medium">{ngo.website || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500">Contact Person</p>
                <p className="text-gray-800 font-medium">{ngo.contactPerson || "—"}</p>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Location Details
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Address</p>
                <p className="text-gray-800 font-medium">
                  {ngo.address || "—"}
                </p>
              </div>
          
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Mission & Vision
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {ngo.mission || "—"}
          </p>
        </div>

        {/* Stats Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-green-700 mb-6">
            Accepted Donations (Monthly)
          </h2>

          {loadingStats ? (
            <div className="text-gray-500">Loading statistics…</div>
          ) : monthly.length === 0 ? (
            <div className="text-gray-500">No donation data available</div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Accepted Donations"
                    fill="#16a34a"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    )}
  </div>
);

};

export default NgoProfile;
