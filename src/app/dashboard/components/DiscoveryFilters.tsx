export default function DiscoveryFilters() {
  // Placeholder for advanced discovery filters
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="text-lg font-bold text-blue-700 mb-2">Discovery Filters</div>
      <div className="flex gap-2 mb-2">
        <input type="range" min="18" max="99" className="w-32" />
        <span className="text-gray-500">Age</span>
      </div>
      <div className="flex gap-2 mb-2">
        <select className="border rounded px-2 py-1">
          <option>All Regions</option>
          <option>Greater Accra</option>
          <option>Ashanti</option>
        </select>
        <span className="text-gray-500">Region</span>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition">Apply Filters</button>
    </section>
  );
}
