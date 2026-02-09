

import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/Appcontext";

const AvailableFoods = () => {
  const { foods, loadAllFoods } = useContext(AppContext);

  // 🔹 Format UTC → IST
  const formatUploadTime = (utcTime) => {
    return new Date(utcTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 🔹 Instagram-like time ago
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

  // 🔹 Expiry logic (ONLY for Pending food)
  const isExpired = (createdAt, foodType) => {
    const now = new Date();
    const uploadTime = new Date(createdAt);
    const diffInHours = (now - uploadTime) / (1000 * 60 * 60);

    let expiryHours = 24;
    if (foodType === "cooked") expiryHours = 12;
    if (foodType === "raw") expiryHours = 30;

    return diffInHours >= expiryHours;
  };

  useEffect(() => {
    loadAllFoods();
  }, []);

  if (!foods || foods.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <p className="text-3xl font-extrabold text-green-700 animate-pulse">
          No foods available 😢
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-10 mt-20">
      <h1 className="text-4xl font-extrabold text-center text-green-800 mb-4">
        Available Foods
      </h1>
      <h2 className="text-2xl font-bold text-center text-purple-800 mb-10">
        Transparency that Builds Trust
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {foods.map((food) => {
          const status = food.status; // Pending, Accepted, PickedUp, Delivered
          const expired =
            status === "Pending" &&
            isExpired(food.createdAt, food.foodType);

          return (
            <div
              key={food._id}
              className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition duration-500 relative"
            >
              {/* Food Type Ribbon */}
              <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                {food.foodType}
              </div>

              {/* Food Name */}
              <h2 className="text-2xl font-extrabold text-green-800 mb-2">
                {food.foodName}
              </h2>

              {/* Donor */}
              <p className="text-gray-700 mb-1">
                Donor:{" "}
                <span className="font-semibold">
                  {food?.donor?.name || "Anonymous"}
                </span>
              </p>

              {/* Quantity */}
              <p className="text-gray-800 font-semibold mb-2">
                Quantity: {food.quantity} {food.unit}
              </p>

              {/* NGO */}
              {food?.acceptedByNgo?.organizationName && (
                <p className="text-blue-700 mb-1">
                  Accepted by:{" "}
                  <span className="font-medium">
                    {food.acceptedByNgo.organizationName}
                  </span>
                </p>
              )}

              {/* Location */}
              <p className="text-gray-700 mb-1">
                State: <span className="font-medium">{food.state}</span>
              </p>
              <p className="text-gray-700">
                Address:{" "}
                <span className="font-medium">{food.address || "—"}</span>
              </p>

              {/* Time Info */}
              <div className="mt-3 text-gray-700">
                <p>
                  Uploaded on:{" "}
                  <span className="font-medium">
                    {formatUploadTime(food.createdAt)}
                  </span>
                </p>
                <span className="inline-block mt-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {timeAgo(food.createdAt)}
                </span>
              </div>

              {/* 🔥 STATUS BADGE */}
              <div
                className={`w-full mt-6 p-2 rounded-full text-white text-center font-semibold
                ${
                  status === "Pending"
                    ? expired
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-green-400 to-green-600"
                    : status === "Accepted"
                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                    : status === "PickedUp"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    :"bg-gradient-to-r from-green-400 to-green-600"
                }`}
              >
                {status === "Pending" &&
                  (expired ? "❌ Expired" : "✅ Fresh")}
                {status === "Accepted" && "🟦 Accepted by NGO"}
                {status === "PickedUp" && "🟨 Picked by Volunteer"}
                {status === "Delivered" && "🟩 Completely Distributed"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableFoods;

