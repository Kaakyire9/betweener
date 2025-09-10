import React from "react";

interface LikePassToastProps {
  open: boolean;
  type: "like" | "pass";
  onClose: () => void;
}

const icons = {
  like: (
    <span className="text-pink-500 text-3xl animate-bounce">❤️</span>
  ),
  pass: (
    <span className="text-gray-500 text-3xl animate-shake">👎</span>
  ),
};

const messages = {
  like: "Liked",
  pass: "Passed",
};

export default function LikePassToast({ open, type, onClose }: LikePassToastProps) {
  if (!open) return null;
  return (
    <div
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-500
        ${type === "like" ? "bg-pink-100 border-pink-300" : "bg-gray-100 border-gray-300"}
        border-2 animate-fade-in-out`}
      onClick={onClose}
    >
      {icons[type]}
      <span className={`font-bold text-lg ${type === "like" ? "text-pink-600" : "text-gray-700"}`}>{messages[type]}</span>
    </div>
  );
}

// Animations (add to your global CSS or Tailwind config):
// .animate-fade-in-out { animation: fadeInOut 1.2s both; }
// @keyframes fadeInOut { 0% { opacity: 0; transform: translateY(-20px);} 10% { opacity: 1; transform: translateY(0);} 90% { opacity: 1; } 100% { opacity: 0; transform: translateY(-20px);} }
// .animate-shake { animation: shake 0.5s; }
// @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
