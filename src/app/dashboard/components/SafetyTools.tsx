export default function SafetyTools() {
  // Placeholder for safety and privacy controls
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="text-lg font-bold text-red-600 mb-2">Safety & Privacy</div>
      <ul className="list-disc pl-6 text-gray-700 mb-2">
        <li>Account verification</li>
        <li>Incognito mode</li>
        <li>Block & Report</li>
        <li>Privacy settings</li>
      </ul>
      <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition">Manage Safety</button>
    </section>
  );
}
