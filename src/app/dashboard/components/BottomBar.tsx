export default function BottomBar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow md:hidden flex justify-around py-2">
      <a href="/dashboard" className="text-blue-500">Home</a>
      <a href="/dashboard/discovery" className="text-blue-500">Discover</a>
      <a href="/dashboard/messages" className="text-blue-500">Chat</a>
      <a href="/dashboard/profile" className="text-blue-500">Profile</a>
    </footer>
  );
}
