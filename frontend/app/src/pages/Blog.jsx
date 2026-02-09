import React from "react";
import { assets } from "../assets/assets";
const BlogPage = () => {
  return (
    <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center px-6">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl p-10">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-green-700 mb-8">
          🌍 World Hunger and the Need for Food Redistribution
        </h1>
        <img
          src={assets.worldhunger}
          alt="World Hunger"
          className="w-full h-full object-cover rounded-xl mb-12"
        />

        {/* Global Hunger */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Global Hunger Crisis
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every day, <span className="font-semibold">733 million people worldwide</span> struggle with hunger —
            that’s <span className="font-semibold">1 in every 11 people</span> on Earth. According to the World Health
            Organization (WHO), the issue is not simply a lack of food production, but deeper problems linked to
            <span className="italic"> conflict, economic inequality, and climate change</span>.
          </p>
          <img
            src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac"
            alt="Food Crisis"
            className="w-full h-72 object-cover rounded-xl my-6"
          />
          <p className="text-gray-700 leading-relaxed">
            At the same time, the United Nations Environment Programme (UNEP) reports that nearly{" "}
            <span className="font-semibold">931 million tonnes of food</span> are wasted each year. This imbalance
            highlights the stark reality: while millions go to bed hungry, tons of edible food are thrown away.
          </p>
        </section>

        {/* Hunger in India */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-orange-600 mb-4">Hunger in India 🇮🇳</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            India, despite being one of the largest food producers in the world, is home to an alarming{" "}
            <span className="font-semibold">190–194 million hungry people</span> every single day.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>
              <span className="font-semibold">Children suffer the most:</span> Malnutrition contributes significantly to
              child mortality.
            </li>
            <li>
              <span className="font-semibold">Paradox of plenty:</span> India grows enough food, yet millions cannot
              access it due to inequality, poverty, and lack of distribution.
            </li>
            <li>
              <span className="font-semibold">Global Hunger Index:</span> India’s ranking falls in the{" "}
              <span className="italic">“serious” category</span>.
            </li>
          </ul>
          <img
            src={assets.indiahunger}
            alt="Hunger in India"
            className="w-full h-255 object-cover rounded-xl my-6"
          />
        </section>

        {/* Food Waste vs Starvation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-red-600 mb-4">The Contrast: Food Waste vs Starvation</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            India wastes ~<span className="font-semibold">68 million tonnes of food annually</span>, almost equal to the
            entire food consumption of the UK. Farmers, retailers, and households often throw away food due to poor
            planning, lack of storage, or unsold surpluses.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This means while one part of the population struggles with <span className="font-semibold">excess</span> and{" "}
            <span className="font-semibold">waste</span>, another struggles with{" "}
            <span className="font-semibold">hunger</span> and <span className="font-semibold">scarcity</span>.
          </p>
          <img
            src={assets.foodwaste}
            alt="Food Waste"
            className="w-full h-100 object-cover rounded-xl my-6"
          />
        </section>

        {/* Solution */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            Bridging the Gap: Food Waste Management & Redistribution
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To solve this paradox, initiatives like <span className="font-semibold">Food Redistribution Platforms</span>{" "}
            are crucial.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>
              <span className="font-semibold">Donors:</span> Farmers, retailers, and restaurants post details of surplus
              food.
            </li>
            <li>
              <span className="font-semibold">NGOs:</span> Community groups find and request nearby donations.
            </li>
            <li>
              <span className="font-semibold">Smart logistics:</span> Real-time tracking ensures food reaches people
              before it spoils.
            </li>
          </ul>
          <img
            src={assets.wastemanagement}
            alt="Food Distribution"
            className="w-full h-140 object-cover rounded-xl my-6"
          />
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">🌱 Call to Action</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            World hunger is not just a problem of <span className="font-semibold">food shortage</span> — it’s a problem
            of <span className="font-semibold">food distribution</span>. By creating bridges between surplus and need, we
            can move closer to a future where{" "}
            <span className="italic">“One Platform. Zero Waste. Countless Smiles.”</span>
          </p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition">
            Join the Movement 🌍
          </button>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
