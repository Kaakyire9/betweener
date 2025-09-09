export default function Gamification() {
  // Placeholder for gamification and achievements
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="text-lg font-bold text-green-600 mb-2">Achievements</div>
      <div className="flex gap-4 mb-2">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">🔥 Streak</span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">🏆 Top Matcher</span>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition">View All Badges</button>
    </section>
  );
}
