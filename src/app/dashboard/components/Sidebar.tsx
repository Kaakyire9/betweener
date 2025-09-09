import UserAvatar from './UserAvatar';

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 p-4 bg-white border-r">
      <div className="flex flex-col items-center mb-6">
        <UserAvatar size={64} />
      </div>
      {/* Filters, Premium, Settings (to be implemented) */}
      <div className="font-semibold text-lg mb-4">Menu</div>
      <ul className="space-y-2">
        <li><a href="/dashboard/discovery" className="text-blue-500">Discovery</a></li>
        <li><a href="/dashboard/messages" className="text-blue-500">Messages</a></li>
        <li><a href="/dashboard/profile" className="text-blue-500">Profile</a></li>
        <li><a href="/dashboard/premium" className="text-pink-500">Go Premium</a></li>
      </ul>
    </aside>
  );
}
