export default function ProfileAnalytics() {
  // Placeholder for profile insights and analytics
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="text-lg font-bold text-blue-700 mb-2">Profile Analytics</div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between w-full">
          <span>Views</span>
          <span className="font-bold text-blue-600">123</span>
        </div>
        <div className="flex justify-between w-full">
          <span>Likes</span>
          <span className="font-bold text-pink-600">45</span>
        </div>
        <div className="flex justify-between w-full">
          <span>Matches</span>
          <span className="font-bold text-green-600">12</span>
        </div>
      </div>
    </section>
  );
}
