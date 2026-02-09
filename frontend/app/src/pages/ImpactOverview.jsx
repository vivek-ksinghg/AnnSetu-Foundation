import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { assets } from '../assets/assets';
import { Leaf, Heart, Users, Droplet, BookOpen, Star, Sparkles, Handshake } from "lucide-react";
import { AppContext } from "../context/Appcontext";

// This is a placeholder for the user's assets.
// In a real application, these would be proper image imports.
// const assets = {
//   story1: "https://images.unsplash.com/photo-1606813909324-913d3bc0f982?auto=format&fit=crop&w=600&q=80", // story 1
//   story2: "https://images.unsplash.com/photo-1551804052-3c6fa79a3b02?auto=format&fit=crop&w=600&q=80", // story 2
//   event1: "https://images.unsplash.com/photo-1585560696050-2c10f96d1eeb?auto=format&fit=crop&w=600&q=80", // tree plantation
//   event2: "https://images.unsplash.com/photo-1581091215368-1d99c4f940e0?auto=format&fit=crop&w=600&q=80" // clean water
// };

const ImpactOverview = () => {
  const { backendUrl } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalFoodKg: 0,
    foodWastePreventedKg: 0,
    co2ReducedKg: 0,
    treesEquivalent: 0,
    peopleFedEstimate: 0,
  });

  const numberFormatter = useMemo(() => new Intl.NumberFormat("en-IN"), []);

  const formatKg = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0";
    const rounded = Math.round(n * 100) / 100;
    return numberFormatter.format(rounded);
  };

  const formatWhole = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0";
    return numberFormatter.format(Math.round(n));
  };

  useEffect(() => {
    if (!backendUrl) return;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/public/impact-overview`);
        if (!cancelled && res.data?.success) {
          const d = res.data?.data || {};
          setStats({
            totalFoodKg: d.totalFoodKg ?? 0,
            foodWastePreventedKg: d.foodWastePreventedKg ?? 0,
            co2ReducedKg: d.co2ReducedKg ?? 0,
            treesEquivalent: d.treesEquivalent ?? 0,
            peopleFedEstimate: d.peopleFedEstimate ?? 0,
          });
        }
      } catch {
        if (!cancelled) {
          setStats({
            totalFoodKg: 0,
            foodWastePreventedKg: 0,
            co2ReducedKg: 0,
            treesEquivalent: 0,
            peopleFedEstimate: 0,
          });
        }
      }
    };

    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [backendUrl]);

  return (
    <div className='mt-15'>
      {/* Tailwind CSS Script for single file execution */}
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="bg-gradient-to-b from-green-100 via-green-50 to-green-200 min-h-screen p-10 space-y-32 font-sans">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-green-900 mb-6 drop-shadow-xl animate-fade-in">
            Our Impact So Far 🌍✨
          </h1>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            At AnnSetu Foundation, we believe in making a difference. Here's a look at what we've achieved together and how we've contributed to a greener, healthier environment. 💚
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          {/* Recycling */}
          <div className="bg-white shadow-2xl rounded-3xl p-10 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-green-400/40">
            <Sparkles className="w-24 h-24 mx-auto mb-4 text-green-500"/>
            <h2 className="text-4xl font-bold text-green-800">{formatKg(stats.foodWastePreventedKg)} kg</h2>
            <p className="text-green-700 mt-2 flex justify-center items-center gap-2 font-medium">
              <span role="img" aria-label="recycle">♻</span> Food Waste Prevented • CO₂ Reduced {formatKg(stats.co2ReducedKg)} kg (est.)
            </p>
          </div>

          {/* Food Donation */}
          <div className="bg-white shadow-2xl rounded-3xl p-10 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-red-300/50">
            <Heart className="w-24 h-24 mx-auto mb-4 text-red-500"/>
            <h2 className="text-4xl font-bold text-green-800">{formatKg(stats.totalFoodKg)}+</h2>
            <p className="text-green-700 mt-2 flex justify-center items-center gap-2 font-medium">
              <span role="img" aria-label="heart">❤</span> Kg of Food Donated
            </p>
          </div>

          {/* Trees Planted */}
          <div className="bg-white shadow-2xl rounded-3xl p-10 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-green-500/50">
            <Leaf className="w-24 h-24 mx-auto mb-4 text-green-600"/>
            <h2 className="text-4xl font-bold text-green-800">{formatWhole(stats.treesEquivalent)}+</h2>
            <p className="text-green-700 mt-2 flex justify-center items-center gap-2 font-medium">
              <span role="img" aria-label="leaf">🌿</span> Trees Equivalent (est.)
            </p>
          </div>

          {/* People Helped */}
          <div className="bg-white shadow-2xl rounded-3xl p-10 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-300/50">
            <Users className="w-24 h-24 mx-auto mb-4 text-blue-500"/>
            <h2 className="text-4xl font-bold text-green-800">{formatWhole(stats.peopleFedEstimate)}+</h2>
            <p className="text-green-700 mt-2 flex justify-center items-center gap-2 font-medium">
              <span role="img" aria-label="people">🧑‍🤝‍🧑</span> People Helped (est.)
            </p>
          </div>
        </div>

        {/* Environmental Achievements */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-12 drop-shadow-md">
            Environmental Achievements 🌱💧
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white shadow-2xl rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-green-400/50">
              <img src={assets.plantation} alt="Tree Plantation" className="w-full h-64 object-cover rounded-2xl mb-4"/>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Community Tree Plantation 🌳</h3>
              <p className="text-green-700">
                Planted hundreds of trees in urban and rural areas, creating green spaces for a healthier environment.
              </p>
            </div>
            <div className="bg-white shadow-2xl rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-400/50">
              <img src={assets.water} alt="Clean Water" className="w-full h-64 object-cover rounded-2xl mb-4"/>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Clean Water Campaigns 💧</h3>
              <p className="text-green-700">
                Installed clean water facilities in remote villages, improving sanitation and health for hundreds of families.
              </p>
            </div>
          </div>
        </div>

        {/* Volunteer Testimonials */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-12 drop-shadow-md">
            Volunteer Testimonials 🙌
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white shadow-2xl rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <p className="text-green-700 italic">
                "Volunteering with AnnSetu Foundation has been life-changing. I’ve learned so much about sustainability and making a real impact in my community."
              </p>
              <h4 className="mt-4 font-bold text-green-800">— Vivek Kumar</h4>
            </div>
            <div className="bg-white shadow-2xl rounded-3xl p-8 transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <p className="text-green-700 italic">
                "Participating in tree plantation drives gave me a sense of pride and responsibility towards our planet. Every small action counts!"
              </p>
              <h4 className="mt-4 font-bold text-green-800">— Yashasvi Tiwari</h4>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-32 mb-16">
          <h2 className="text-4xl font-bold text-green-900 mb-4 drop-shadow-md">
            Join Us to Make a Difference 🌿💚
          </h2>
          <p className="text-green-700 mb-8 max-w-3xl mx-auto">
            Your support helps us expand our impact and bring hope to more communities. Together, we can make the world a better place.
          </p>
          <button className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white py-4 px-12 rounded-full text-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105">
            <Handshake className="inline-block mr-2 w-6 h-6"/> Donate / Volunteer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImpactOverview;
