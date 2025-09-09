import React from "react";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-4xl mb-2">💬</span>
            <h3 className="font-semibold text-lg mb-2">Real-Time Chat</h3>
            <p className="text-gray-600 text-center">Connect instantly with matches using our fast, secure chat system.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🎯</span>
            <h3 className="font-semibold text-lg mb-2">Personalized Discovery</h3>
            <p className="text-gray-600 text-center">Swipe, browse, and filter to find people who truly match your vibe.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-4xl mb-2">🔒</span>
            <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
            <p className="text-gray-600 text-center">Your data and conversations are always protected and private.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
