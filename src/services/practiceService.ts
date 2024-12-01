import axios from 'axios';
import { ScenarioType, DifficultyLevel, PracticeSessionResponse, MessageResponse, CategorizedScenarios } from '../types/practice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

// Mock data for development
const mockScenarios: CategorizedScenarios = {
  'Cold Calling': [
    {
      id: 'cold-1',
      title: 'First Time Contact',
      description: 'Practice initial contact with potential sellers who have never been contacted before.',
      category: 'Cold Calling'
    },
    {
      id: 'cold-2',
      title: 'Follow-up Call',
      description: 'Practice following up with leads who showed initial interest.',
      category: 'Cold Calling'
    }
  ],
  'Objection Handling': [
    {
      id: 'obj-1',
      title: 'Price Objections',
      description: 'Handle common price-related objections from potential sellers.',
      category: 'Objection Handling'
    },
    {
      id: 'obj-2',
      title: 'Market Concerns',
      description: 'Address concerns about current market conditions.',
      category: 'Objection Handling'
    }
  ],
  'Closing Techniques': [
    {
      id: 'close-1',
      title: 'Listing Agreement',
      description: 'Practice closing techniques for securing listing agreements.',
      category: 'Closing Techniques'
    },
    {
      id: 'close-2',
      title: 'Price Negotiation',
      description: 'Handle final price negotiations with sellers.',
      category: 'Closing Techniques'
    }
  ]
};

class PracticeService {
  async getScenarios(): Promise<CategorizedScenarios> {
    try {
      // For development, return mock data
      // In production, uncomment the API call
      // const response = await axios.get(`${API_URL}/api/scenarios`);
      // return response.data;
      return mockScenarios;
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      throw error;
    }
  }

  async startSession(scenarioId: string, difficulty: DifficultyLevel): Promise<PracticeSessionResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/start-roleplay`, {
        scenarioId,
        difficulty
      });
      return response.data;
    } catch (error) {
      console.error('Error starting session:', error);
      // For development, return mock response
      return {
        sessionId: 'mock-session-1',
        initialResponse: "Hello! I'm your AI practice partner. How can I help you today?"
      };
    }
  }

  async sendMessage(sessionId: string, message: string): Promise<MessageResponse> {
    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        sessionId,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      // For development, return mock response
      return {
        response: "I understand your point. Let's discuss this further. What specific concerns do you have?"
      };
    }
  }
}

export const practiceService = new PracticeService();
