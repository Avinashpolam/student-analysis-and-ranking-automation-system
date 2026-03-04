import { Users, BookOpen, Trophy, BarChart3, ClipboardList, History, GraduationCap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: BarChart3, label: "Dashboard", path: "/" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: BookOpen, label: "Subjects", path: "/subjects" },
  { icon: ClipboardList, label: "Scores", path: "/scores" },
  { icon: Trophy, label: "Rankings", path: "/rankings" },
  { icon: History, label: "Audit Log", path: "/audit" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-base font-bold text-sidebar-foreground">SARS</h1>
          <p className="text-[11px] text-sidebar-foreground/50">Student Analysis & Ranking</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-item w-full ${isActive ? "nav-item-active" : ""}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-lg bg-sidebar-accent">
        <p className="text-[11px] text-sidebar-foreground/50 font-medium">Academic Year</p>
        <p className="text-sm text-sidebar-foreground font-semibold">2025–2026</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
