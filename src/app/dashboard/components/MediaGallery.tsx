export default function MediaGallery() {
  // Placeholder for media gallery
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-center max-w-md mx-auto mt-8">
      <div className="text-lg font-bold text-blue-700 mb-2">Media Gallery</div>
      <div className="flex gap-2">
        <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center text-gray-400">+</div>
        <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center text-gray-400">+</div>
        <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center text-gray-400">+</div>
      </div>
      <div className="text-sm text-gray-500 mt-2">Add photos and videos to your profile</div>
    </section>
  );
}
