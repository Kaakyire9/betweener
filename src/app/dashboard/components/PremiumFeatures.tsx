export default function PremiumFeatures() {
  // Placeholder for premium subscription management
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="text-lg font-bold text-yellow-600 mb-2">Premium Features</div>
      <ul className="list-disc pl-6 text-gray-700 mb-2">
        <li>See who liked you</li>
        <li>Unlimited swipes</li>
        <li>Incognito mode</li>
      </ul>
      <button className="bg-yellow-400 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-yellow-500 transition">Upgrade to Premium</button>
    </section>
  );
}
