import { ScenarioType, DifficultyLevel, PracticeSessionResponse, MessageResponse, CategorizedScenarios } from '../types/practice';

// Mock data for development
const mockScenarios: CategorizedScenarios = {
  'Cold Calling': [
    {
      id: '1',
      title: 'First Contact',
      description: 'Practice initiating contact with a potential client',
      category: 'Cold Calling'
    },
    {
      id: '2',
      title: 'Follow Up',
      description: 'Practice following up with a lead',
      category: 'Cold Calling'
    }
  ],
  'Property Showing': [
    {
      id: '3',
      title: 'Home Tour',
      description: 'Practice conducting a property viewing',
      category: 'Property Showing'
    },
    {
      id: '4',
      title: 'Feature Highlight',
      description: 'Practice highlighting property features',
      category: 'Property Showing'
    }
  ]
};

const mockDifficulties: DifficultyLevel[] = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Basic scenarios with cooperative prospects'
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'More challenging scenarios with some objections'
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Complex scenarios with multiple objections'
  }
];

class PracticeService {
  async getScenarios(): Promise<CategorizedScenarios> {
    // In a real app, this would fetch from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockScenarios);
      }, 500);
    });
  }

  async getDifficulties(): Promise<DifficultyLevel[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDifficulties);
      }, 500);
    });
  }

  async startSession(scenarioId: string, difficulty: DifficultyLevel): Promise<PracticeSessionResponse> {
    // In a real app, this would create a session on the backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `session-${Date.now()}`,
          scenarioId,
          difficultyId: difficulty.id,
          status: 'active'
        });
      }, 500);
    });
  }

  async sendMessage(sessionId: string, message: string): Promise<MessageResponse> {
    // In a real app, this would send the message to an AI model
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "I understand your interest. Could you tell me more about what you're looking for in a property?",
          feedback: "Good opening, try to ask more specific questions",
          metrics: {
            confidence: 0.8,
            effectiveness: 0.7
          }
        });
      }, 1000);
    });
  }

  async endSession(sessionId: string): Promise<void> {
    // In a real app, this would end the session on the backend
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
}

export const practiceService = new PracticeService();
