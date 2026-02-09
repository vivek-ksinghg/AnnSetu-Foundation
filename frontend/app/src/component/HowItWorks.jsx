import React from "react";
import { assets } from "../assets/assets";
import {
  UserPlus,
  ShoppingCart,
  Box,
  Truck,
  BarChart2,
  Heart,
  Globe
} from "lucide-react";

const steps = [
  {
    title: "Volunteer Joins",
    subtitle: "Passionate people come together",
    description:
      "Anyone can join as a volunteer to contribute to our mission of feeding the hungry. Volunteers are the backbone of our organization.",
    icon: <UserPlus className="w-12 h-12 text-white p-2" />,
    bgGradient: "bg-gradient-to-r from-green-400 to-green-600",
    image: assets.voluntere
  },
  {
    title: "Collect Surplus Food",
    subtitle: "Rescuing food that would go to waste",
    description:
      "Volunteers collect extra food from restaurants, events, and local donors, ensuring that no meal goes to waste.",
    icon: <ShoppingCart className="w-12 h-12 text-white p-2" />,
    bgGradient: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    image: assets.collect
  },
  {
    title: "Sort & Prepare",
    subtitle: "Ensuring hygiene and safety",
    description:
      "The collected food is carefully sorted and prepared under hygienic conditions to make sure every meal served is safe and nutritious.",
    icon: <Box className="w-12 h-12 text-white p-2" />,
    bgGradient: "bg-gradient-to-r from-blue-400 to-blue-600",
    image: assets.sort
  },
  {
    title: "Distribute Meals",
    subtitle: "Delivering meals to those in need",
    description:
      "Our volunteers personally deliver food to the needy in local communities, homeless shelters, and underprivileged areas.",
    icon: <Truck className="w-12 h-12 text-white p-2" />,
    bgGradient: "bg-gradient-to-r from-pink-400 to-pink-600",
    image: assets.distribute
  },
  {
    title: "Track Impact",
    subtitle: "Measuring our difference",
    description:
      "We track the number of meals served, volunteers engaged, and lives touched, sharing inspiring stories to encourage more people to join.",
    icon: <BarChart2 className="w-12 h-12 text-white p-2" />,
    bgGradient: "bg-gradient-to-r from-red-400 to-red-600",
    image: assets.tracking
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen mt-15 bg-gray-50 ">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-500 to-blue-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">How Our Mission Works</h1>
          <p className="text-lg md:text-xl leading-relaxed">
            At <span className="font-semibold">Aansetu Army</span>, we
            believe no food should go to waste while people sleep hungry. Our
            process ensures that surplus food is rescued, repurposed, and served
            to those who need it most.
          </p>
        </div>
      </section>

      {/* Steps with Images */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-24">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center md:gap-10 gap-6 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-full md:w-1/2 h-96 rounded-2xl shadow-xl object-cover hover:scale-[1.02] transition"
            />
            <div className="md:w-1/2 text-center md:text-left">
              <div
                className={`rounded-full w-24 h-24 flex items-center justify-center mx-auto md:mx-0 mb-4 shadow-lg ${step.bgGradient}`}
              >
                {step.icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {step.title}
              </h2>
              <h3 className="text-xl font-semibold text-gray-500 mb-4">
                {step.subtitle}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HowItWorks;