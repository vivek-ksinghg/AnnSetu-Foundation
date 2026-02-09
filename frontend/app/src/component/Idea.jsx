import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";

const Idea = () => {

  const { backendUrl } = useContext(AppContext);
  const [foodDonations, setFoodDonations] = useState(null);
  const [robinsEnlisted, setRobinsEnlisted] = useState(null);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-IN"), []);

  useEffect(() => {
    if (!backendUrl) return;
    let cancelled = false;

    const loadStats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/public/impact-stats`);
        if (!cancelled && res.data?.success) {
          setFoodDonations(res.data?.data?.foodDonations ?? 0);
          setRobinsEnlisted(res.data?.data?.robinsEnlisted ?? 0);
        }
      } catch {
        if (!cancelled) {
          setFoodDonations(0);
          setRobinsEnlisted(0);
        }
      }
    };

    loadStats();
    const id = setInterval(loadStats, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [backendUrl]);

  const dataStats = useMemo(
    () => [
      {
        icon: "👥",
        value: numberFormatter.format(foodDonations ?? 0),
        label: "Meals Served",
      },
      { icon: "📍", value: "406", label: "Cities" },
      {
        icon: "🏹",
        value: numberFormatter.format(robinsEnlisted ?? 0),
        label: "AnnSetu Enlisted",
      },
      { icon: "🎯", value: "1%", label: "Impact Increase" },
    ],
    [foodDonations, robinsEnlisted, numberFormatter],
  );


  return (
   <div
      className="w-full min-h-screen bg-cover  bg-center bg-fixed relative text-white"
      style={{ backgroundImage: `url(${assets.idea})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-green-900/60"></div>

      {/* content */}
      <div className="relative z-10 max-w-6xl mx-auto py-32 px-6 md:px-12">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-center">
          The Idea
        </h1>
        <p className="text-center text-lg md:text-xl mb-12 text-gray-200">
          Transforming surplus food into hope and smiles. Every meal we serve
          touches lives and spreads kindness across communities.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Text */}
          <div>
            <h2 className="text-xl text-orange-400 mb-4">Who we are?</h2>
            <p className="mb-4">
          Our platform is a community-driven initiative that connects food donors with verified NGOs to 
          reduce food waste and fight hunger. We enable the safe redistribution of surplus food from individuals, 
          restaurants, and events to people in need—powered by volunteers and driven by social responsibility.
            </p>
            <p className="mb-4">
           Our local operations are managed by dedicated community members who work together to create impact
            in their own areas. For example, restaurants in a neighborhood 
           can donate surplus food, which is then collected and distributed by nearby NGOs and volunteers.
            </p>
            <p className="text-gray-200">
              We believe that no one should sleep hungry. By connecting donors
              and volunteers, we create a network that spreads love and
              compassion with every meal.
            </p>
          </div>

          {/* Right: Data Stats */}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {dataStats.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-white/10 p-6 rounded-lg text-center hover:bg-white/20 transition"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Motivational Text */}
        <p className="text-center mt-12 text-lg md:text-xl text-gray-200">
          Join us today and be part of a movement that turns compassion into
          action.
        </p>
      </div>
    </div>
  )
}

export default Idea
