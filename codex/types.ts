export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface ModuleData {
  id: number;
  title: string;
  subtitle: string;
  problemLabel: string;
  problem: string;
  benefit: string;
  action: string;
  progress: number;
  locked: boolean;
  questions: Question[];
}

export interface QuizState {
  isOpen: boolean;
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number>;
  completed: boolean;
}

export interface TypingGameState {
  isOpen: boolean;
  snippet: string;
  input: string;
  startTime: number | null;
}

export type ViewMode = "split" | "dark" | "light";

export interface ThemeContextProps {
  theme: "dark" | "light";
  viewMode: ViewMode;
}
