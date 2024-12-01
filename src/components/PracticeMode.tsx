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
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Mic as MicIcon
} from '@mui/icons-material';
import PDFUploader from './PDFUploader';
import VoicePracticeMode from './VoicePracticeMode';
import { practiceService } from '../services/practiceService';
import { PracticeModeProps, ScenarioType, DifficultyLevel, Message, CategorizedScenarios } from '../types/practice';

const PracticeMode: React.FC<PracticeModeProps> = ({ onExitPracticeMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [scenarios, setScenarios] = useState<CategorizedScenarios>({});
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [showPDFUploader, setShowPDFUploader] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useVoice, setUseVoice] = useState(false);
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

  const handleCategoryChange = (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : false);
  };

  const handleScenarioSelect = (scenario: ScenarioType) => {
    setSelectedScenario(scenario);
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
    if (onExitPracticeMode) {
      onExitPracticeMode();
    }
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
    setCurrentMessage(text);
  };

  // Render functions
  const renderScenarioSelection = () => (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Select a Practice Scenario
      </Typography>

      {Object.entries(scenarios).map(([category, categoryScenarios]) => (
        <Accordion
          key={category}
          expanded={expandedCategory === category}
          onChange={handleCategoryChange(category)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
              {categoryScenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedScenario?.id === scenario.id ? 2 : 1,
                    borderColor: selectedScenario?.id === scenario.id ? 'primary.main' : 'divider'
                  }}
                  onClick={() => handleScenarioSelect(scenario)}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>{scenario.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {scenario.description}
                  </Typography>
                </Card>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          disabled={!selectedScenario || isLoading}
          onClick={handleStartPractice}
          sx={{ minWidth: 200 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Start Practice'}
        </Button>
      </Box>
    </Box>
  );

  const renderPracticeSession = () => (
    <Box sx={{ 
      height: '100vh',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          {selectedScenario?.title}
        </Typography>
        <Button onClick={handleExitPractice} startIcon={<CloseIcon />}>
          Exit
        </Button>
      </Box>

      {/* Messages */}
      <Box sx={{ 
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              backgroundColor: message.role === 'user' ? 'primary.main' : 'background.paper',
              color: message.role === 'user' ? 'white' : 'text.primary',
              p: 2,
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Typography>{message.content}</Typography>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ 
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            variant="outlined"
            size="small"
          />
          <IconButton
            color={useVoice ? 'primary' : 'default'}
            onClick={() => setUseVoice(!useVoice)}
          >
            <MicIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>

      {useVoice && (
        <VoicePracticeMode
          isActive={useVoice}
          selectedScenario={selectedScenario}
          selectedDifficulty={selectedDifficulty}
          onSpeechDetected={handleSpeechDetected}
          onBotResponse={(response) => {
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
          }}
        />
      )}
    </Box>
  );
  
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
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setShowPDFUploader(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <PDFUploader onUploadComplete={() => setShowPDFUploader(false)} />
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
          <Typography variant="body1" color="text.secondary">
            Dashboard features coming soon...
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PracticeMode;
