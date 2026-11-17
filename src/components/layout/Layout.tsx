import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Bookmark,
  BookOpen,
  Bug,
  GraduationCap,
  LayoutDashboard,
  Mic,
  ListChecks,
  Settings as SettingsIcon,
  Shapes,
  Timer,
  Zap,
} from "lucide-react";
const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/problems", label: "All Problems", icon: ListChecks, end: false },
  { to: "/concepts", label: "Concepts", icon: BookOpen, end: true },
  { to: "/concepts/practice", label: "Voice Practice", icon: Mic, end: false },
  { to: "/topics", label: "Topics", icon: Shapes, end: false },
  { to: "/practice", label: "Practice", icon: Zap, end: false },
  { to: "/timed", label: "Timed Challenge", icon: Timer, end: false },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark, end: false },
  { to: "/analytics", label: "Analytics", icon: BarChart3, end: false },
  { to: "/visualizer-guide", label: "Visualizer Guide", icon: GraduationCap, end: false },
  { to: "/settings", label: "Settings", icon: SettingsIcon, end: false },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
    isActive
      ? "bg-surface-2 text-fg"
      : "text-muted hover:bg-surface-2 hover:text-fg"
  }`;

export function Layout() {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="flex items-center gap-2 px-4 py-4 text-base font-semibold">
          <Bug size={20} className="text-accent" />
          DSA Debugging Lab
        </div>
        <nav className="flex flex-col gap-1 px-2" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3 md:hidden">
        <Bug size={18} className="text-accent" />
        <span className="font-semibold">DSA Debugging Lab</span>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-10 flex overflow-x-auto border-t border-line bg-surface md:hidden"
        aria-label="Main mobile"
      >
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-w-[76px] flex-1 flex-col items-center gap-1 px-2 py-2 text-[11px] ${
                isActive ? "text-accent" : "text-muted"
              }`
            }
          >
            <Icon size={18} />
            <span className="whitespace-nowrap">
              {label.replace(" Challenge", "").replace("All ", "").replace(" Practice", "")}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
