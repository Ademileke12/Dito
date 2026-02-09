import { Moon, Sun, Zap } from "lucide-react";
import { ViewMode } from "../types";
import { cn } from "../utils";

interface NavbarProps {
  viewMode: ViewMode;
  onToggleView: () => void;
  onOpenGame: () => void;
  isMobile: boolean;
}

export function Navbar({ viewMode, onToggleView, onOpenGame, isMobile }: NavbarProps) {
  const label = viewMode === "split" ? "Split" : viewMode === "dark" ? "Dark" : "Light";

  return (
    <header className="sticky top-4 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-white/10 px-6 py-3 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-3 text-white">
          <span className="h-2 w-2 rounded-full bg-brand-orange shadow-[0_0_12px_rgba(255,87,34,0.8)]" />
          <span className="text-lg font-semibold tracking-wide">CodeXero</span>
        </div>
        <div className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
          <a className="transition hover:text-white" href="#path">Path</a>
          <a className="transition hover:text-white" href="#modules">Modules</a>
          <a className="transition hover:text-white" href="#community">Community</a>
        </div>
        <div className="flex items-center gap-3">
          {!isMobile && (
            <button
              type="button"
              onClick={onOpenGame}
              className="hidden items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/60 hover:text-white md:flex"
            >
              <Zap className="h-4 w-4" />
              Speed Test
            </button>
          )}
          <button
            type="button"
            onClick={onToggleView}
            className={cn(
              "flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/60 hover:text-white",
              viewMode === "light" && "bg-white/70 text-brand-charcoal"
            )}
          >
            <Moon className="h-4 w-4" />
            {label}
            <Sun className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-charcoal transition hover:-translate-y-0.5"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}
