import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AppContextNgo } from "../context/AppcontextNgo";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const NgoDonations = () => {
  const { backendUrl, token } = useContext(AppContextNgo);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/ngo/stats/accepted-by-ngo-monthly`, {
          headers: { token }
        });
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setRows(data);
        const months = [...new Set(data.map(d => d.month))];
        if (months.length > 0) setSelectedMonth(months[months.length - 1]);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [backendUrl, token]);

  const monthLabel = (ym) => {
    const [y, m] = ym.split("-");
    const d = new Date(parseInt(y), parseInt(m) - 1, 1);
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const months = useMemo(() => [...new Set(rows.map(r => r.month))], [rows]);
  const ngoNames = useMemo(() => [...new Set(rows.map(r => r.ngoName))], [rows]);

  const chartData = useMemo(() => {
    const byMonth = {};
    months.forEach(m => {
      byMonth[m] = { label: monthLabel(m) };
      ngoNames.forEach(name => { byMonth[m][name] = 0; });
    });
    rows.forEach(r => {
      if (!byMonth[r.month]) byMonth[r.month] = { label: monthLabel(r.month) };
      byMonth[r.month][r.ngoName] = (byMonth[r.month][r.ngoName] || 0) + r.count;
    });
    return months.map(m => byMonth[m]);
  }, [rows, months, ngoNames]);

  const leaderboard = useMemo(() => {
    const map = new Map();
    rows.filter(r => r.month === selectedMonth).forEach(r => {
      map.set(r.ngoName, (map.get(r.ngoName) || 0) + r.count);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [rows, selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-700">Accepted Donations per Month</h1>
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {months.map((m) => (
                <option key={m} value={m}>{monthLabel(m)}</option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-gray-500">No data</div>
        ) : (
          <>
            <div className="w-full h-96 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  {ngoNames.map((name, idx) => (
                    <Bar key={name} dataKey={name} stackId="a" fill={["#16a34a","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#10b981"][idx % 6]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <h2 className="text-xl font-semibold mb-2">Leaderboard — {monthLabel(selectedMonth)}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded border">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="py-2 px-3 text-left">Rank</th>
                    <th className="py-2 px-3 text-left">NGO</th>
                    <th className="py-2 px-3 text-left">Accepted Count</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row, i) => (
                    <tr key={row.name} className="border-b">
                      <td className="py-2 px-3">{i + 1}</td>
                      <td className="py-2 px-3">{row.name}</td>
                      <td className="py-2 px-3">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NgoDonations;
