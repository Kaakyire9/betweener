
import React from "react";

type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type MatchNotificationProps = {
  open: boolean;
  onClose: () => void;
  currentUser: User;
  matchedUser: User;
  onStartChat: () => void;
};

export default function MatchNotification({ open, onClose, currentUser, matchedUser, onStartChat }: MatchNotificationProps) {
  if (!open) return null;
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-100 border-l-4 border-green-400 text-green-900 px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center animate-pop-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-full bg-white border-2 border-green-300 overflow-hidden flex items-center justify-center">
          {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <span className="text-3xl font-bold text-green-600">♥</span>
        <div className="w-16 h-16 rounded-full bg-white border-2 border-green-300 overflow-hidden flex items-center justify-center">
          {matchedUser.avatarUrl ? (
            <img src={matchedUser.avatarUrl} alt={matchedUser.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
      </div>
  <div className="font-bold text-lg mb-2">{`You've liked ${matchedUser.name}`}</div>
      <div className="mb-4 text-sm">You and <span className="font-semibold">{matchedUser.name}</span> like each other.</div>
      <div className="flex gap-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow"
          onClick={onStartChat}
        >
          Start Chat
        </button>
        <button
          className="bg-white border border-green-400 text-green-700 px-4 py-2 rounded-full font-semibold hover:bg-green-50"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
