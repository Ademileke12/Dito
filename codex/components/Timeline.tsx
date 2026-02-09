import { ModuleData, ThemeContextProps } from "../types";
import { cn } from "../utils";

interface TimelineProps extends ThemeContextProps {
  modules: ModuleData[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function Timeline({ theme, modules, activeIndex, onSelect }: TimelineProps) {
  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="flex items-center gap-3">
        <div className={cn("h-[2px] flex-1", theme === "dark" ? "bg-white/20" : "bg-brand-charcoal/20")}>
          <div className="h-full w-[10%] bg-brand-orange shadow-[0_0_12px_rgba(255,87,34,0.6)]" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-5 gap-4 text-xs font-medium md:grid-cols-10">
        {modules.map((module, index) => (
          <button
            key={module.id}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl px-2 py-2 text-center transition",
              index === activeIndex
                ? theme === "dark"
                  ? "text-white"
                  : "text-brand-charcoal"
                : theme === "dark"
                ? "text-white/60"
                : "text-brand-charcoal/60"
            )}
          >
            <span
              className={cn(
                "h-3 w-3 rounded-full border",
                index === activeIndex
                  ? "border-brand-orange bg-brand-orange shadow-[0_0_12px_rgba(255,87,34,0.7)]"
                  : theme === "dark"
                  ? "border-white/40 bg-white/10"
                  : "border-brand-charcoal/30 bg-brand-charcoal/10"
              )}
            />
            <span>{module.title.split(":")[0]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
