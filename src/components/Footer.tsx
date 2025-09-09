import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-700 text-white py-6 mt-16">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-bold text-lg">Betweener</div>
        <div className="text-sm">&copy; {new Date().getFullYear()} Betweener. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </div>
    </footer>
  );
}
