// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { assets } from '../assets/assets';

const  ImageSection= () => {
  const images = [assets.hero1, assets.hero2, assets.hero3];

  // Slogans for each image
  const slogans = [
    {
      title: '🌍 Share Food, Spread Hope',
      subtitle: 'Join hands with us to feed the hungry and fight food waste — one plate at a time.',
    },
    {
      title: '🍽 Don’t Waste, Donate!',
      subtitle: 'Turn your surplus into someone’s survival — let no meal go in vain.',
    },
    {
      title: '🤝 Connecting Hearts with Food',
      subtitle: 'We bridge the gap between abundance and need — compassionately and efficiently.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden ">
      {/* ===== HERO SLIDER ===== */}
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-700"
        />

        {/* Center Slogan */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {slogans[currentIndex].title}
            </h1>
            <p className="text-white text-lg md:text-2xl max-w-2xl mx-auto drop-shadow-md">
              {slogans[currentIndex].subtitle}
            </p>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={goPrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-green-700/70 hover:bg-green-700 text-white p-2 rounded-full z-10"
        >
          <ChevronLeft />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-green-700/70 hover:bg-green-700 text-white p-2 rounded-full z-10"
        >
          <ChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* ===== WELCOME SECTION ===== */}
      <section className="p-10 text-center bg-green-50">
        <h2 className="text-4xl font-bold text-green-800 mb-4">
          Welcome to AnnSetu Foundation
        </h2>
        <p className="text-green-700 text-lg max-w-3xl mx-auto">
          We believe no food should go to waste while people sleep hungry. Be part of a change that connects surplus with need — effectively and compassionately.
        </p>
      </section>
    </div>
  );
};

export default ImageSection;