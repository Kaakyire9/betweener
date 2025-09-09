// Removed dashboard-specific Navbar; global Navbar will be used
import Sidebar from './components/Sidebar';
import BottomBar from './components/BottomBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Navbar will be rendered by the root layout */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <BottomBar />
    </div>
  );
}
