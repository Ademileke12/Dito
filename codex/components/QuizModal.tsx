import { CheckCircle2, X } from "lucide-react";
import { ModuleData, QuizState, ThemeContextProps } from "../types";
import { cn } from "../utils";

interface QuizModalProps extends ThemeContextProps {
  isOpen: boolean;
  module: ModuleData;
  state: QuizState;
  onClose: () => void;
  onSelectAnswer: (answerIndex: number) => void;
  onNextQuestion: () => void;
  onFinish: () => void;
  onAdvanceModule: () => void;
}

export function QuizModal({
  isOpen,
  module,
  state,
  theme,
  onClose,
  onSelectAnswer,
  onNextQuestion,
  onFinish,
  onAdvanceModule
}: QuizModalProps) {
  if (!isOpen) {
    return null;
  }

  const question = module.questions[state.currentQuestionIndex];
  const selected = state.selectedAnswers[question.id];
  const isLast = state.currentQuestionIndex === module.questions.length - 1;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6 backdrop-blur">
      <div
        className={cn(
          "w-full max-w-2xl rounded-3xl border p-6 shadow-2xl",
          theme === "dark" ? "border-white/10 bg-black/90 text-white" : "border-brand-charcoal/10 bg-white text-brand-charcoal"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange">Mission Quiz</p>
            <h3 className="mt-2 text-xl font-semibold">{module.title}</h3>
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

        {state.completed ? (
          <div className="mt-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-brand-orange" />
            <h4 className="mt-4 text-2xl font-semibold">Mission Accomplished</h4>
            <p className={cn("mt-2 text-sm", theme === "dark" ? "text-white/70" : "text-brand-charcoal/70")}
            >
              You cleared the knowledge check. Ready to advance?
            </p>
            <button
              type="button"
              onClick={onAdvanceModule}
              className="mt-6 rounded-full bg-brand-orange px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white"
            >
              Next Module
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div className={cn("mb-4 text-sm", theme === "dark" ? "text-white/70" : "text-brand-charcoal/70")}
            >
              Question {state.currentQuestionIndex + 1} of {module.questions.length}
            </div>
            <h4 className="text-lg font-semibold">{question.text}</h4>
            <div className="mt-6 grid gap-3">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectAnswer(index)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition",
                    selected === index
                      ? "border-brand-orange bg-brand-orange/15 text-brand-orange"
                      : theme === "dark"
                      ? "border-white/10 text-white/80 hover:border-white/40"
                      : "border-brand-charcoal/10 text-brand-charcoal/80 hover:border-brand-charcoal/40"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              {isLast ? (
                <button
                  type="button"
                  onClick={onFinish}
                  className="rounded-full bg-brand-orange px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white"
                >
                  Complete Mission
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNextQuestion}
                  className={cn(
                    "rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] transition",
                    theme === "dark"
                      ? "border-white/20 text-white hover:border-white/60"
                      : "border-brand-charcoal/20 text-brand-charcoal hover:border-brand-charcoal/60"
                  )}
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
