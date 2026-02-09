// src/components/Culture.jsx
import React from 'react';

const Culture = () => {
  const values = [
    '1% Done',
    'Zero Funds',
    'Think Less, Do More',
    'Decentralize',
    'Ownership',
    '#Oneteam',
    'Apolitical',
    'All Religions',
    'Lead on the field',
    'Empathy',
  ];

  const gradients = [
    'bg-gradient-to-br from-green-800 to-green-600',
    'bg-gradient-to-br from-green-700 to-green-500',
    'bg-gradient-to-br from-green-300 to-green-500',
    'bg-gradient-to-br from-green-600 to-green-400',
    'bg-gradient-to-br from-green-900 to-green-700',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-green-800 to-green-500',
    'bg-gradient-to-br from-green-700 to-green-300',
    'bg-gradient-to-br from-green-600 to-green-800',
    'bg-gradient-to-br from-green-500 to-green-700',
  ];

  return (
    <section className="py-20 px-4 text-center bg-white">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Our Culture
      </h2>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-gray-600 mb-12">
        <span className="font-medium text-green-700">Citizens First</span> →{' '}
        <span className="font-medium text-green-700">Mission Next</span> →{' '}
        <span className="font-medium text-green-700">AnnSetu Last</span>
      </p>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {values.map((value, index) => (
          <div
            key={index}
            className={`text-white  font-semibold flex items-center justify-center text-center h-32 p-4 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out ${gradients[index % gradients.length]}`}
          >
            <span className="text-lg md:text-xl">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Culture;