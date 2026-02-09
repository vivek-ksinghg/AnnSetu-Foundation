import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/Appcontext";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaRupeeSign, FaUtensils, FaUsers } from "react-icons/fa";
 

const COLORS = [
  "#22c55e", // green
"#8b5cf6", // purple
  "#facc15", // yellow
  "#f97316", // orange
  "#e11d48", // red
  "#3b82f6", // blue
  "#10b981", // emerald
  "#6366f1", // indigo
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f43f5e", // rose
  "#fbbf24", // amber
  
];

const MyDonations = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/donor/my-donations", {
          headers: { token },
        });

        if (response.data.success) {
          setDonations(response.data.donations);
        } else {
          setError("Failed to fetch your donations");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [backendUrl, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (donations.length === 0) return <p>No donations found</p>;

  // 🔹 Totals
  const totalMoney = donations
    .filter((d) => d.donationType === "Money")
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  const totalFood = donations
    .filter((d) => d.donationType === "Food")
    .reduce((sum, d) => sum + (d.quantity || 0), 0);

  // 🔹 Total People Helped Calculation
  const totalPeople = donations.reduce((sum, d) => {
    if (d.donationType === "Money") return sum + Math.floor(d.amount / 50);
    else if (d.donationType === "Food") {
      if (d.unit?.toLowerCase() === "plate") return sum + d.quantity;
      else if (d.unit?.toLowerCase() === "kg") return sum + d.quantity * 2;
      else return sum + d.quantity;
    }
    else return sum;
  }, 0);

  // Graph Data
  const moneyData = donations
    .filter((d) => d.donationType === "Money")
    .map((d) => ({ name: new Date(d.createdAt).toLocaleDateString(), value: d.amount }));

  const foodData = donations
    .filter((d) => d.donationType === "Food")
    .map((d) => ({ name: d.foodName, value: d.quantity }));

     // ====== Environmental Impact Calculation ======
  const CO2_PER_KG_FOOD = 1.3; // kg CO2 per kg food
  const CH4_PER_KG_FOOD = 0.05; // kg CH4 per kg food
  const N2O_PER_KG_FOOD = 0.01; // kg N2O per kg food

  const totalFoodKg = donations.reduce((sum, d) => {
    if (d.donationType === "Food") return sum + (d.quantity || 0);
    if (d.donationType === "Money") return sum + ((d.amount || 0) / 50) * 0.25; // 0.25kg per plate
    return sum;
  }, 0);

  const totalCO2Saved = (totalFoodKg * CO2_PER_KG_FOOD).toFixed(2);
  const totalCH4Saved = (totalFoodKg * CH4_PER_KG_FOOD).toFixed(2);
  const totalN2OSaved = (totalFoodKg * N2O_PER_KG_FOOD).toFixed(2);

    const envImpactData = [
    { name: "CO2", value: parseFloat(totalCO2Saved) },
    { name: "CH4", value: parseFloat(totalCH4Saved) },
    { name: "N2O", value: parseFloat(totalN2OSaved) },
  ];
  return (
    <div className="mt-22 px-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">My Donations</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Amount / Quantity</th>
              <th className="py-3 px-4 text-left">Food Name</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Accepted By NGO</th>
              <th className="py-3 px-4 text-left">Date</th>
              {/* 🔹 Added People Helped Column */}
              <th className="py-3 px-4 text-left">People Helped</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => {
              // 🔹 Calculate people helped per donation
              let people = 0;
              if (donation.donationType === "Money") {
                people = Math.floor(donation.amount / 50);
              } else if (donation.donationType === "Food") {
                if (donation.unit?.toLowerCase() === "plate") people = donation.quantity;
                else if (donation.unit?.toLowerCase() === "kg") people = donation.quantity * 2;
                else people = donation.quantity;
              }

              return (
                <tr
                  key={donation._id}
                  className={`border-b border-gray-200 ${
                    donation.donationType === "Food" ? "bg-green-50" : "bg-yellow-50"
                  }`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold">{donation.donationType}</td>
                  <td className="py-3 px-4">
                    {donation.donationType === "Money" ? (
                      <span className="text-green-700 font-bold">{donation.amount} ₹</span>
                    ) : (
                      <span className="text-blue-700 font-bold">{donation.quantity} {donation.unit}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{donation.foodName || "-"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        donation.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : donation.status === "Accepted" || donation.status === "PickedUp"
                          ? "bg-green-200 text-green-800"
                          : donation.status === "Rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{donation.address}</td>
                  <td className="py-3 px-4">
                    {donation.acceptedByNgo?.organizationName || "-"}
                  </td>
                  <td className="py-3 px-4">{new Date(donation.createdAt).toLocaleString()}</td>
                  {/* 🔹 People Helped Column */}
                  <td className="py-3 px-4">{people}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
 <h1 className="text-5xl font-extrabold text-center text-green-700 mb-12 mt-15">
          🌟 Your Contribution Impact
        </h1>
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-8">
        <div className="bg-green-400 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <FaRupeeSign size={40} className="mb-2" />
          <p className="text-3xl font-bold">₹{totalMoney}</p>
          <p>Money Donated</p>
        </div>
        <div className="bg-yellow-400 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center h-75">
          <FaUtensils size={40} className="mb-2" />
          <p className="text-3xl font-bold">{totalFood}</p>
          <p>Food Donated (Kg/Packets)</p>
        </div>
        <div className="bg-purple-400 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
          <FaUsers size={40} className="mb-2" />
          <p className="text-3xl font-bold">{totalPeople}</p>
          <p>People Helped</p>
        </div>
      </div>
        
      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-green-700 text-center">💵 Money Contributions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moneyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {moneyData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-orange-600 text-center">🍲 Food Contributions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={foodData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {foodData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

         {/* ====== Environmental Impact Chart ====== */}
<div className="bg-gradient-to-br from-green-100 via-green-200 to-green-100 p-6 rounded-3xl shadow-2xl mb-12 hover:scale-105 transition-transform duration-300">
  <h3 className="text-2xl font-extrabold mb-4 text-center text-green-800">
    🌍 Environmental Impact
  </h3>
  <p className="text-center mb-6 text-green-700 font-medium">
    By donating surplus food, you helped reduce greenhouse gas emissions:
  </p>
  <ul className="flex justify-around mb-6 text-green-900 font-semibold">
    <li className="bg-green-200 px-4 py-2 rounded-lg shadow-md hover:bg-green-300 transition">
      CO₂: {totalCO2Saved} kg
    </li>
    <li className="bg-green-200 px-4 py-2 rounded-lg shadow-md hover:bg-green-300 transition">
      CH₄: {totalCH4Saved} kg
    </li>
    <li className="bg-green-200 px-4 py-2 rounded-lg shadow-md hover:bg-green-300 transition">
      N₂O: {totalN2OSaved} kg
    </li>
  </ul>
  <div className="w-full h-80 p-4 bg-white rounded-2xl shadow-xl">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={envImpactData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {envImpactData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#f0fff4",
            borderRadius: "8px",
            border: "1px solid #d1fae5",
            color: "#065f46",
          }}
        />
        <Legend
          wrapperStyle={{
            fontWeight: "bold",
            color: "#065f46",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
};

export default MyDonations;
