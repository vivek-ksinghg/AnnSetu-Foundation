import React, { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/Appcontext';

const HowToAdd = () => {
  const [isHovered, setIsHovered] = useState(false);
  const{token}=useContext(AppContext)

  const cards = [
    {
      title: 'Volunteer Time',
      description:
        'Give just 3 hours a week. Be the change you want to see — your time can save lives.',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      title: 'Contribute Food',
      description:
        'Have surplus food from your home or restaurant? Let’s feed someone instead of wasting it.',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V5a2 2 0 012-2h14a2 2 0 012 2v10.546z"
        />
      ),
    },
    {
      title: 'Teach',
      description:
        'Help educate underprivileged children and empower them to shape a better future.',
      icon: (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0v8"
          />
        </>
      ),
    },
  ];

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-b from-green-50 via-white to-green-100">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-green-900 mb-12">
          How You Can Help
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition duration-300 ease-in-out hover:shadow-2xl"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {card.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800">
                  {card.title}
                </h3>
              </div>
              <p className="text-gray-700 text-center">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-green-800 to-green-600 rounded-3xl py-12 px-6 text-white shadow-lg">
          <h3 className="text-3xl font-bold mb-6">Join our Annsetu Family</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Together, we can rescue food, feed people, and build a more compassionate community.
          </p>

          {/* Button with Hover Emoji */}
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            
            className="bg-white text-green-800 font-semibold py-3 px-8 rounded-full hover:bg-green-100 transition-all duration-300 text-lg flex items-center gap-2 justify-center mx-auto"
          >
            {
             token ? 'ok': <a href='/role'>Sign Up Now</a> 
            }
          
            <span className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
              🤝
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowToAdd;