export type DifficultyLevel = 'beginner' | 'advanced';

export interface ScenarioType {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface CategorizedScenarios {
  [category: string]: ScenarioType[];
}

export interface PracticeModeProps {
  onExitPracticeMode?: () => void;
}

export interface PracticeSessionResponse {
  sessionId: string;
  initialResponse: string;
}

export interface MessageResponse {
  response: string;
}
