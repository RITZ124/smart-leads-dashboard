import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => (
  <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <Sidebar />
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <Outlet />
      </div>
    </main>
  </div>
);

export default AppLayout;
