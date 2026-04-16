import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, BarChart3, Target, Trophy } from "lucide-react";
import { motion } from "motion/react";

const tabs = [
  { path: "/app", icon: Home, label: "홈" },
  { path: "/app/analysis", icon: BarChart3, label: "분석" },
  { path: "/app/tier", icon: Trophy, label: "티어" },
  { path: "/app/missions", icon: Target, label: "미션" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full max-w-[480px] mx-auto bg-white">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex justify-around items-center py-2">
          {tabs.map((tab) => {
            const isActive =
              tab.path === "/app"
                ? location.pathname === "/app"
                : location.pathname.startsWith(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 rounded-2xl bg-[#EDFAF4]"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <tab.icon
                  size={22}
                  className="relative z-10 transition-all"
                  color={isActive ? "#00D26A" : "#C0C0C0"}
                  strokeWidth={isActive ? 2.4 : 1.7}
                />
                <span
                  className={`text-[10px] relative z-10 transition-all ${
                    isActive ? "text-[#00D26A] font-semibold" : "text-[#C0C0C0] font-medium"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
