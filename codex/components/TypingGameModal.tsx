import { X } from "lucide-react";
import { ThemeContextProps, TypingGameState } from "../types";
import { cn } from "../utils";

interface TypingGameModalProps extends ThemeContextProps {
  state: TypingGameState;
  onClose: () => void;
  onInputChange: (value: string) => void;
}

export function TypingGameModal({ state, onClose, onInputChange, theme }: TypingGameModalProps) {
  if (!state.isOpen) {
    return null;
  }

  const isComplete = state.input === state.snippet;
  const elapsedMinutes = state.startTime ? (Date.now() - state.startTime) / 60000 : 0;
  const wordsTyped = state.input.trim().length > 0 ? state.input.trim().split(/\s+/).length : 0;
  const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6 backdrop-blur">
      <div
        className={cn(
          "w-full max-w-3xl rounded-3xl border p-6 shadow-2xl",
          theme === "dark" ? "border-white/10 bg-black/90 text-white" : "border-brand-charcoal/10 bg-white text-brand-charcoal"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange">Speed Coder</p>
            <h3 className="mt-2 text-xl font-semibold">Type the snippet exactly</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-full border p-2",
              theme === "dark" ? "border-white/20 text-white" : "border-brand-charcoal/20 text-brand-charcoal"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className={cn(
            "mt-6 rounded-2xl border border-dashed border-brand-orange/40 p-5 font-mono text-sm",
            theme === "dark" ? "bg-black/40 text-white" : "bg-brand-light text-brand-charcoal"
          )}
        >
          {state.snippet.split("").map((char, index) => {
            const typedChar = state.input[index];
            const match = typedChar === char;
            const isTyped = typedChar !== undefined;
            return (
              <span
                key={`${char}-${index}`}
                className={cn(
                  isTyped && match && "text-emerald-300",
                  isTyped && !match && "text-red-400"
                )}
              >
                {char}
              </span>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <textarea
            className={cn(
              "min-h-[120px] w-full rounded-2xl border px-4 py-3 font-mono text-sm focus:outline-none",
              theme === "dark"
                ? "border-white/20 bg-black/70 text-white placeholder:text-white/40"
                : "border-brand-charcoal/20 bg-white text-brand-charcoal placeholder:text-brand-charcoal/40"
            )}
            placeholder="Start typing here..."
            value={state.input}
            onChange={(event) => onInputChange(event.target.value)}
          />
          <div
            className={cn(
              "rounded-2xl border p-4 text-center",
              theme === "dark" ? "border-white/10 bg-white/5" : "border-brand-charcoal/10 bg-brand-light"
            )}
          >
            <p className={cn("text-xs uppercase tracking-[0.3em]", theme === "dark" ? "text-white/60" : "text-brand-charcoal/50")}>WPM</p>
            <p className="mt-2 text-3xl font-semibold text-brand-orange">{wpm}</p>
            {isComplete && <p className="mt-2 text-xs text-emerald-300">Perfect run!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
