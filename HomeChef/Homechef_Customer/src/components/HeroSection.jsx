import React from "react";

const HeroSection = ({ title, imageUrl, buttonText }) => {
  return (
    <div
      className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
        <button className="px-6 py-2 border border-white rounded-full font-semibold hover:bg-white hover:text-black transition">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default HeroSection;