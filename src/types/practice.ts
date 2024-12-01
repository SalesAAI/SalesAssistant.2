export interface ScenarioType {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
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
  id: string;
  scenarioId: string;
  difficultyId: string;
  status: 'active' | 'completed';
}

export interface MessageResponse {
  message: string;
  feedback?: string;
  metrics?: {
    confidence: number;
    effectiveness: number;
    [key: string]: number;
  };
}
