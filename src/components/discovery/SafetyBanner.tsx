

import React, { useState, useEffect } from "react";

const SAFETY_TIPS = [
  "Never share your financial information with anyone you meet online.",
  "Meet in public places for your first few dates.",
  "Trust your instincts—if something feels off, block and report.",
  "Keep conversations on the platform until you feel comfortable.",
  "Let a friend know where you're going when meeting someone new."
];

export default function SafetyBanner() {
  const [visible, setVisible] = useState(true);
  const [tip, setTip] = useState(SAFETY_TIPS[0]);

  useEffect(() => {
    // Only randomize on the client
    setTip(SAFETY_TIPS[Math.floor(Math.random() * SAFETY_TIPS.length)]);
  }, []);

  if (!visible) return null;
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-4 rounded flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="font-bold">Safety Tip:</span>
        <span>{tip}</span>
        <a
          href="#report-block"
          className="ml-4 underline text-blue-700 text-sm hover:text-blue-900"
          title="Learn how to report or block users"
        >
          Report/Block Help
        </a>
      </div>
      <button
        className="ml-4 text-yellow-700 hover:text-yellow-900 text-lg font-bold px-2"
        onClick={() => setVisible(false)}
        aria-label="Dismiss safety banner"
      >
        ×
      </button>
    </div>
  );
}
