import { ArrowRight } from "lucide-react";
import { ModuleData, ThemeContextProps } from "../types";
import { cn } from "../utils";

interface ModuleCardProps extends ThemeContextProps {
  module: ModuleData;
  nextModule: ModuleData;
  onStartQuiz: () => void;
  onNextModule: () => void;
}

export function ModuleCard({ theme, module, nextModule, onStartQuiz, onNextModule }: ModuleCardProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div
        className={cn(
          "relative overflow-hidden rounded-[28px] border border-white/10",
          theme === "dark" ? "bg-black/80 shadow-[0_30px_60px_rgba(0,0,0,0.6)]" : "bg-white shadow-[0_30px_60px_rgba(15,23,42,0.12)]"
        )}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="bg-brand-dark p-6 text-white md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange">{module.problemLabel}</p>
            <h2 className="mt-3 text-2xl font-semibold">{module.title}</h2>
            <p className="mt-4 text-sm text-white/70">{module.problem}</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <ArrowRight className="h-6 w-6 rotate-90 text-brand-orange transition-transform md:rotate-0" />
            </div>
          </div>

          <div className="bg-brand-light p-6 text-brand-charcoal md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-charcoal">The Benefit</p>
            <p className="mt-4 text-sm text-brand-charcoal/70">{module.benefit}</p>
            <p className="mt-4 text-sm text-brand-charcoal/60">{module.action}</p>
            <button
              type="button"
              onClick={onStartQuiz}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-[0_12px_30px_rgba(255,87,34,0.4)] transition hover:-translate-y-0.5"
            >
              Start Mission
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4 rounded-[22px] border border-dashed border-white/20 p-5 md:grid-cols-[1fr_auto]",
          theme === "dark" ? "bg-white/5 text-white" : "bg-white text-brand-charcoal"
        )}
      >
        <div>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.3em]", theme === "dark" ? "text-white/60" : "text-brand-charcoal/50")}
          >
            Next Module Peek
          </p>
          <h3 className="mt-2 text-lg font-semibold">{nextModule.title}</h3>
          <p className={cn("mt-2 text-sm", theme === "dark" ? "text-white/70" : "text-brand-charcoal/70")}
          >
            {nextModule.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onNextModule}
          className={cn(
            "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition",
            theme === "dark"
              ? "border-white/40 text-white/80 hover:border-white"
              : "border-brand-charcoal/20 text-brand-charcoal hover:border-brand-charcoal"
          )}
        >
          View Next
        </button>
      </div>
    </section>
  );
}
