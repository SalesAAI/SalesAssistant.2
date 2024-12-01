import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  Dialog,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Upload as UploadFileIcon,
  Dashboard as DashboardIcon,
  Send as SendIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import Logo from './Logo';
import PDFUploader from './PDFUploader';
import VoicePracticeMode from './VoicePracticeMode';
import { practiceService } from '../services/practiceService';
import { PracticeModeProps, ScenarioType, DifficultyLevel, Message, CategorizedScenarios } from '../types/practice';

const PracticeMode: React.FC<PracticeModeProps> = ({ onExitPracticeMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [scenarios, setScenarios] = useState<CategorizedScenarios>({});
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useVoice, setUseVoice] = useState(false);
  const [showMetrics, setShowMetrics] = useState(!isMobile);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const scenariosData = await practiceService.getScenarios();
        setScenarios(scenariosData);
        if (Object.keys(scenariosData).length > 0) {
          setExpandedCategory(Object.keys(scenariosData)[0]);
        }
      } catch (error) {
        console.error('Error loading scenarios:', error);
      }
    };
    loadScenarios();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handlers
  const handleTrainAI = () => {
    setShowPDFUploader(true);
  };

  const handleDashboard = () => {
    setShowDashboard(true);
  };

  const handleCategoryChange = (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : false);
  };

  const handleScenarioSelect = (scenario: ScenarioType) => {
    setSelectedScenario(scenario);
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartPractice = async () => {
    if (!selectedScenario || !selectedDifficulty) return;
    
    setIsLoading(true);
    try {
      const session = await practiceService.startSession(selectedScenario.id, selectedDifficulty);
      setSessionId(session.id);
      setIsPracticing(true);
      setMessages([
        {
          role: 'assistant',
          content: `Welcome to the ${selectedScenario.title} practice session! I'll be playing the role of a prospect. Let's begin!`
        }
      ]);
    } catch (error) {
      console.error('Error starting practice session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExitPractice = () => {
    setIsPracticing(false);
    setSelectedScenario(null);
    setSelectedDifficulty(null);
    setMessages([]);
    setSessionId(null);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !sessionId) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await practiceService.sendMessage(sessionId, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your message.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSpeechDetected = (text: string) => {
    setTranscript(text);
    // Handle the speech input
  };

  // Render functions remain the same...
  
  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {!isPracticing ? renderScenarioSelection() : renderPracticeSession()}

      {/* PDF Uploader Dialog */}
      <Dialog 
        open={showPDFUploader} 
        onClose={() => setShowPDFUploader(false)}
        maxWidth="md"
        fullWidth
      >
        <PDFUploader onClose={() => setShowPDFUploader(false)} />
      </Dialog>

      {/* Dashboard Dialog */}
      <Dialog 
        open={showDashboard} 
        onClose={() => setShowDashboard(false)}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Practice Dashboard</Typography>
            <IconButton onClick={() => setShowDashboard(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {/* Dashboard content */}
          <Typography variant="body1" color="text.secondary">
            Dashboard features coming soon...
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PracticeMode;
