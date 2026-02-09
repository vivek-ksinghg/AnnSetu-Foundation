import React from "react";
import { motion as Motion } from "framer-motion";
import { Heart, Users, Building2, Shield } from "lucide-react";

const roles = [
  {
    name: "Donor",
    description: "Support the community by donating food or money.",
    icon: <Heart size={48} className="text-rose-500 drop-shadow-md" />,
    link: "/donor/register",
    color:
      "bg-gradient-to-br from-rose-400/20 to-pink-300/10 hover:from-rose-400/40 hover:to-pink-300/20",
  },
  {
    name: "Volunteer",
    description: "Help with delivery, events, and on-ground activities.",
    icon: <Users size={48} className="text-blue-500 drop-shadow-md" />,
    link: "/register/volunteer",
    color:
      "bg-gradient-to-br from-blue-400/20 to-cyan-300/10 hover:from-blue-400/40 hover:to-cyan-300/20",
  },
  {
    name: "NGO",
    description:
      "Register your NGO to manage donations, accept food, and share it with people in need.",
    icon: <Building2 size={48} className="text-green-500 drop-shadow-md" />,
    link: "/register/ngo",
    color:
      "bg-gradient-to-br from-green-400/20 to-emerald-300/10 hover:from-green-400/40 hover:to-emerald-300/20",
  },
  {
    name: "Admin",
    description: "Monitor, manage, and keep the platform running smoothly.",
    icon: <Shield size={48} className="text-purple-500 drop-shadow-md" />,
    link: "/admin/login",
    color:
      "bg-gradient-to-br from-purple-400/20 to-indigo-300/10 hover:from-purple-400/40 hover:to-indigo-300/20",
  },
];

const Role = () => {
  return (
    <div className=" mt-15 min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-green-50 flex flex-col items-center justify-between px-6 py-16">
      
      {/* Heading */}
      <div className="flex flex-col items-center">
        <Motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 text-center drop-shadow-md"
        >
          Select Your Role
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 text-center mb-12 max-w-2xl text-lg"
        >
          Join hands to create hope. Whether you donate, volunteer, manage, or lead,
          every role sparks change.
        </Motion.p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
          {roles.map((role, i) => (
            <Motion.a
              key={i}
              href={role.link}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8, rotate: 1 }}
              whileTap={{ scale: 0.96 }}
              className={`relative p-10 rounded-3xl shadow-xl backdrop-blur-md border border-white/20 transition-all duration-300 ${role.color}`}
            >
              <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-white/10 backdrop-blur-xl"></div>
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6">{role.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3 tracking-wide">
                  {role.name}
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {role.description}
                </p>
              </div>
            </Motion.a>
          ))}
        </div>
      </div>

      {/* 🌟 Slogan at Bottom */}
      <Motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-16 text-3xl md:text-5xl font-extrabold text-center 
                   bg-gradient-to-r from-emerald-600 via-green-500 to-lime-600 
                   bg-clip-text text-transparent drop-shadow-lg"
      >
        Give, Live, and Let Kindness Thrive!
      </Motion.h2>
    </div>
  );
};

export default Role;
