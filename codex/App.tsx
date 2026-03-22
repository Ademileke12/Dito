import { useEffect, useState } from "react";
import { Content } from "./components/Content";
import { MODULES } from "./constants";
import { QuizState, TypingGameState, ViewMode } from "./types";

const initialQuizState: QuizState = {
  isOpen: false,
  currentQuestionIndex: 0,
  selectedAnswers: {},
  completed: false
};

const SNIPPETS = [
  "const contract = await codexero.deploy({ template: 'mint', supply: 1000 });",
  "function connectWallet(){ return provider.request({ method: 'eth_requestAccounts' }); }",
  "const node = flow.addBlock('trigger').connect('mint').connect('airdrop');",
  "export const useChain = () => ({ network: 'solana', status: 'ready' });"
];

const initialTypingState: TypingGameState = {
  isOpen: false,
  snippet: SNIPPETS[0],
  input: "",
  startTime: null
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [activeIndex, setActiveIndex] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [typingGameState, setTypingGameState] = useState<TypingGameState>(initialTypingState);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode((prev) => (prev === "split" ? "dark" : prev));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeModule = MODULES[activeIndex];

  const toggleView = () => {
    if (isMobile) {
      setViewMode((prev) => (prev === "dark" ? "light" : "dark"));
      return;
    }
    setViewMode((prev) => (prev === "split" ? "dark" : prev === "dark" ? "light" : "split"));
  };

  const startQuiz = () => {
    setQuizState({ ...initialQuizState, isOpen: true });
  };

  const selectAnswer = (answerIndex: number) => {
    const question = activeModule.questions[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      selectedAnswers: { ...prev.selectedAnswers, [question.id]: answerIndex }
    }));
  };

  const nextQuestion = () => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, activeModule.questions.length - 1)
    }));
  };

  const finishQuiz = () => {
    setQuizState((prev) => ({ ...prev, completed: true }));
  };

  const closeQuiz = () => {
    setQuizState(initialQuizState);
  };

  const advanceModule = () => {
    setActiveIndex((prev) => (prev + 1) % MODULES.length);
    setQuizState(initialQuizState);
  };

  const openGame = () => {
    const snippet = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
    setTypingGameState({ isOpen: true, snippet, input: "", startTime: null });
  };

  const closeGame = () => {
    setTypingGameState((prev) => ({ ...prev, isOpen: false, input: "", startTime: null }));
  };

  const handleTypingInput = (value: string) => {
    setTypingGameState((prev) => ({
      ...prev,
      input: value,
      startTime: prev.startTime ?? (value.length > 0 ? Date.now() : null)
    }));
  };

  const contentProps = {
    modules: MODULES,
    activeIndex,
    quizState,
    typingGameState,
    isMobile,
    onToggleView: toggleView,
    onOpenGame: openGame,
    onCloseGame: closeGame,
    onTypingInputChange: handleTypingInput,
    onSelectModule: setActiveIndex,
    onStartQuiz: startQuiz,
    onAnswerQuiz: selectAnswer,
    onNextQuestion: nextQuestion,
    onFinishQuiz: finishQuiz,
    onCloseQuiz: closeQuiz,
    onAdvanceModule: advanceModule
  };

  if (viewMode !== "split") {
    return (
      <Content
        theme={viewMode === "dark" ? "dark" : "light"}
        viewMode={viewMode}
        {...contentProps}
      />
    );
  }

  return (
    <div className="relative">
      <div
        className="relative w-1/2 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
          WebkitClipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
        }}
      >
        <div className="w-[200%]">
          <Content theme="dark" viewMode={viewMode} {...contentProps} />
        </div>
      </div>
      <div
        className="absolute inset-y-0 left-1/2 w-1/2 overflow-hidden"
        style={{
          clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
          WebkitClipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)"
        }}
      >
        <div className="w-[200%] -translate-x-1/2">
          <Content theme="light" viewMode={viewMode} {...contentProps} />
        </div>
      </div>
    </div>
  );
}
