import { ThemeContextProps } from "../types";
import { cn } from "../utils";

interface HeroProps extends ThemeContextProps {
  progress: number;
}

export function Hero({ theme, progress }: HeroProps) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center">
      <div className="space-y-3">
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.5em]",
            theme === "dark" ? "text-white/60" : "text-brand-charcoal/50"
          )}
        >
          CodeXero Academy
        </p>
        <h1
          className={cn(
            "text-3xl font-semibold tracking-tight md:text-5xl",
            theme === "dark" ? "text-white" : "text-brand-charcoal"
          )}
        >
          CodeXero Learning Path
        </h1>
        <p
          className={cn(
            "mx-auto max-w-2xl text-sm md:text-base",
            theme === "dark" ? "text-white/70" : "text-brand-charcoal/70"
          )}
        >
          From Web3 Enthusiast to Confident dApp Architect using the No-Code Ecosystem.
        </p>
      </div>
      <div className="w-full max-w-xl">
        <div
          className={cn(
            "mb-2 text-xs font-semibold uppercase tracking-[0.4em]",
            theme === "dark" ? "text-white/60" : "text-brand-charcoal/50"
          )}
        >
          {progress}% Complete — 10 Modules defined
        </div>
        <div
          className={cn(
            "h-2 w-full overflow-hidden rounded-full",
            theme === "dark" ? "bg-white/10" : "bg-brand-charcoal/10"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full bg-brand-orange shadow-[0_0_16px_rgba(255,87,34,0.6)]",
              theme === "light" && "shadow-none"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
