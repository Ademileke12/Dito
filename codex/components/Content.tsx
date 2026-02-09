import { ModuleData, QuizState, ThemeContextProps, TypingGameState } from "../types";
import { Hero } from "./Hero";
import { ModuleCard } from "./ModuleCard";
import { Navbar } from "./Navbar";
import { QuizModal } from "./QuizModal";
import { Timeline } from "./Timeline";
import { TypingGameModal } from "./TypingGameModal";
import { cn } from "../utils";

interface ContentProps extends ThemeContextProps {
  modules: ModuleData[];
  activeIndex: number;
  quizState: QuizState;
  typingGameState: TypingGameState;
  isMobile: boolean;
  onToggleView: () => void;
  onOpenGame: () => void;
  onCloseGame: () => void;
  onTypingInputChange: (value: string) => void;
  onSelectModule: (index: number) => void;
  onStartQuiz: () => void;
  onAnswerQuiz: (answerIndex: number) => void;
  onNextQuestion: () => void;
  onFinishQuiz: () => void;
  onCloseQuiz: () => void;
  onAdvanceModule: () => void;
}

export function Content({
  theme,
  viewMode,
  modules,
  activeIndex,
  quizState,
  typingGameState,
  isMobile,
  onToggleView,
  onOpenGame,
  onCloseGame,
  onTypingInputChange,
  onSelectModule,
  onStartQuiz,
  onAnswerQuiz,
  onNextQuestion,
  onFinishQuiz,
  onCloseQuiz,
  onAdvanceModule
}: ContentProps) {
  const active = modules[activeIndex];
  const next = modules[(activeIndex + 1) % modules.length];

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden",
        theme === "dark"
          ? "bg-brand-dark text-white"
          : "bg-brand-light text-brand-charcoal"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_20%_20%,rgba(255,87,34,0.3),transparent_50%),radial-gradient(circle_at_20%_70%,rgba(255,87,34,0.15),transparent_50%)]"
            : "bg-[radial-gradient(circle_at_80%_20%,rgba(31,41,55,0.08),transparent_55%)]"
        )}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-5 pb-24 pt-8 md:px-8">
        <Navbar viewMode={viewMode} onToggleView={onToggleView} onOpenGame={onOpenGame} isMobile={isMobile} />
        <section id="path">
          <Hero theme={theme} viewMode={viewMode} progress={active.progress} />
        </section>
        <section id="modules">
          <ModuleCard
            theme={theme}
            viewMode={viewMode}
            module={active}
            nextModule={next}
            onStartQuiz={onStartQuiz}
            onNextModule={() => onSelectModule((activeIndex + 1) % modules.length)}
          />
        </section>
        <Timeline
          theme={theme}
          viewMode={viewMode}
          modules={modules}
          activeIndex={activeIndex}
          onSelect={onSelectModule}
        />
        <footer
          id="community"
          className={cn(
            "mt-10 grid gap-6 rounded-[28px] border border-white/10 p-6 md:grid-cols-3",
            theme === "dark" ? "bg-white/5" : "bg-white"
          )}
        >
          <div>
            <h4 className="text-lg font-semibold">CodeXero Academy</h4>
            <p className={cn("mt-2 text-sm", theme === "dark" ? "text-white/70" : "text-brand-charcoal/70")}
            >
              Advanced no-code Web3 education for senior builders and visionary founders.
            </p>
          </div>
          <div className="text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-orange">Explore</p>
            <div className="mt-2 space-y-2">
              <a className="block" href="#path">Learning Path</a>
              <a className="block" href="#modules">Modules</a>
              <a className="block" href="#community">Community</a>
            </div>
          </div>
          <div className="text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-orange">Stay Connected</p>
            <div className="mt-2 space-y-2">
              <button className="block">Join Newsletter</button>
              <button className="block">Open Discord</button>
            </div>
          </div>
        </footer>
      </div>

      <QuizModal
        theme={theme}
        viewMode={viewMode}
        isOpen={quizState.isOpen}
        module={active}
        state={quizState}
        onClose={onCloseQuiz}
        onSelectAnswer={onAnswerQuiz}
        onNextQuestion={onNextQuestion}
        onFinish={onFinishQuiz}
        onAdvanceModule={onAdvanceModule}
      />
      <TypingGameModal
        theme={theme}
        viewMode={viewMode}
        state={typingGameState}
        onClose={onCloseGame}
        onInputChange={onTypingInputChange}
      />
    </div>
  );
}
