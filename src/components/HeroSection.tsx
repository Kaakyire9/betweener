import React from "react";

export default function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-20 bg-gradient-to-br from-blue-50 to-blue-100 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow">Find Your Match, Your Way</h1>
      <p className="text-lg md:text-2xl text-blue-600 mb-8 max-w-2xl mx-auto">Betweener is the modern dating platform for real connections. Discover, chat, and meet people who share your interests and values.</p>
      <a href="#features" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition">Get Started</a>
    </section>
  );
}
