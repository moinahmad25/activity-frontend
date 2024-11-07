import Dashboard from "./Components/Dashboard";
import Sidebar from "./Components/Sidebar";


export default function Home() {
  return (
    <main className="flex">
    <Sidebar />
      <Dashboard />
    </main>
  );
}
