import React from 'react';
import { assets } from '../assets/assets';

const ProblemStatement = () => {
  const facts = [
    {
      img: assets.g1,
      text: 'Hunger kills more people each year than AIDS, malaria and terrorism combined',
    },
    {
      img: assets.g2,
      text: 'Every 10 seconds, a child dies from hunger',
    },
    {
      img: assets.g3,
      text: '82% of hungry people live in countries with food surpluses, not food shortages',
    },
    {
      img: assets.g4,
      text: 'One in every eight people sleeps hungry each night',
    },
    {
      img: assets.g5,
      text: 'One-third of the food produced around the world is never consumed',
    },
    {
      img: assets.g6,
      text: '850 million hungry people in the world',
    },
  ];

  return (
    <section className="py-20 bg-white text-center px-4">
      {/* Heading with gradient */}
      <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-700 via-green-500 to-green-700 text-transparent bg-clip-text">
        The Problem
      </h2>

      {/* Subtext */}
      <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-12">
        The challenge is not a lack of food — it is making food consistently available to everyone who needs it.
      </p>

      {/* Grid of facts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {facts.map((fact, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-4 transition duration-300 hover:scale-105"
          >
            {/* Gradient Circle Background */}
            <div className="rounded-full p-1 bg-gradient-to-tr from-green-500 to-green-700 shadow-lg">
              <img
                src={fact.img}
                alt={`Fact ${index + 1}`}
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>

            <p className="text-gray-800 text-base mt-4">{fact.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemStatement;