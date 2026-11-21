import { Library, Plus, BarChart3 } from "lucide-react";

const TABS = [
  { id: "library", label: "مكتبتي", icon: Library },
  { id: "add", label: "إضافة", icon: Plus, main: true },
  { id: "stats", label: "إحصائيات", icon: BarChart3 },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-xl mx-auto flex items-center h-16">
        {TABS.map(({ id, label, icon: Icon, main }) => {
          const isActive = active === id;

          if (main) {
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-label={label}
                className="flex-1 flex justify-center"
              >
                <span
                  className={`-translate-y-4 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-slate-100 transition-colors ${
                    isActive ? "bg-indigo-700" : "bg-indigo-600"
                  }`}
                >
                  <Icon size={28} />
                </span>
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
                isActive ? "text-indigo-600 font-semibold" : "text-slate-400"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}