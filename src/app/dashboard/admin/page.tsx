"use client";
import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold mb-2">User Stats</h2>
            <ul className="text-gray-700 list-disc ml-6">
              <li>Total users: 1,234</li>
              <li>Active users: 567</li>
              <li>Premium users: 89</li>
              <li>New signups (week): 45</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold mb-2">Recent Reports</h2>
            <ul className="text-gray-700 list-disc ml-6">
              <li>Jane Doe reported John Smith (inappropriate photo)</li>
              <li>Mary flagged Mike (spam)</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold mb-2">Quick Actions</h2>
            <button className="bg-red-600 text-white px-4 py-2 rounded mr-2">Ban User</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Verify User</button>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold mb-2">System Health</h2>
            <ul className="text-gray-700 list-disc ml-6">
              <li>Database: Online</li>
              <li>API: Healthy</li>
              <li>Storage: OK</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
