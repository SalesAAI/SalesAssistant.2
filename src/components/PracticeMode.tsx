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

  // Handlers remain the same as before...

  const renderScenarioSelection = () => (
    <Box sx={{ 
      p: isMobile ? 2 : 3,
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        pb: 2,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Logo onClick={onExitPracticeMode} />
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          width: isMobile ? '100%' : 'auto',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<UploadFileIcon />}
            onClick={handleTrainAI}
            fullWidth={isMobile}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Train AI with PDF
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<DashboardIcon />}
            onClick={handleDashboard}
            fullWidth={isMobile}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #3498db, #2980b9)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2980b9, #2c3e50)'
              }
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"}
          sx={{ 
            mb: 3,
            fontWeight: 700,
            color: '#2c3e50'
          }}
        >
          Select Practice Scenario
        </Typography>

        <Box sx={{ mb: 4 }}>
          {Object.entries(scenarios).map(([category, categoryScenarios]) => (
            <Accordion 
              key={category}
              expanded={expandedCategory === category}
              onChange={handleCategoryChange(category)}
              sx={{
                mb: 2,
                borderRadius: '12px',
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'rgba(52, 152, 219, 0.05)',
                  borderRadius: '12px',
                  '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                  {category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                  },
                  gap: 3 
                }}>
                  {categoryScenarios.map((scenario: ScenarioType) => (
                    <Card 
                      key={scenario.id}
                      sx={{ 
                        p: 3,
                        cursor: 'pointer',
                        border: selectedScenario?.id === scenario.id ? '2px solid #3498db' : '1px solid #eee',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                      onClick={() => handleScenarioSelect(scenario)}
                    >
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          color: '#2c3e50'
                        }}
                      >
                        {scenario.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 3, minHeight: '48px' }}
                      >
                        {scenario.description}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1,
                        flexDirection: isMobile ? 'column' : 'row'
                      }}>
                        <Button
                          variant={selectedDifficulty === 'beginner' && selectedScenario?.id === scenario.id ? 'contained' : 'outlined'}
                          size="small"
                          fullWidth={isMobile}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScenarioSelect(scenario);
                            handleDifficultySelect('beginner');
                          }}
                          sx={{
                            flex: 1,
                            textTransform: 'none',
                            backgroundColor: selectedDifficulty === 'beginner' && selectedScenario?.id === scenario.id ? '#27ae60' : 'transparent',
                            borderColor: '#27ae60',
                            color: selectedDifficulty === 'beginner' && selectedScenario?.id === scenario.id ? 'white' : '#27ae60',
                            '&:hover': {
                              backgroundColor: '#27ae60',
                              color: 'white'
                            }
                          }}
                        >
                          Beginner
                        </Button>
                        <Button
                          variant={selectedDifficulty === 'advanced' && selectedScenario?.id === scenario.id ? 'contained' : 'outlined'}
                          size="small"
                          fullWidth={isMobile}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScenarioSelect(scenario);
                            handleDifficultySelect('advanced');
                          }}
                          sx={{
                            flex: 1,
                            textTransform: 'none',
                            backgroundColor: selectedDifficulty === 'advanced' && selectedScenario?.id === scenario.id ? '#e74c3c' : 'transparent',
                            borderColor: '#e74c3c',
                            color: selectedDifficulty === 'advanced' && selectedScenario?.id === scenario.id ? 'white' : '#e74c3c',
                            '&:hover': {
                              backgroundColor: '#e74c3c',
                              color: 'white'
                            }
                          }}
                        >
                          Advanced
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!selectedScenario || !selectedDifficulty || isLoading}
            onClick={handleStartPractice}
            fullWidth={isMobile}
            sx={{ 
              minWidth: isMobile ? '100%' : 240,
              height: 48,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '24px',
              textTransform: 'none',
              background: selectedScenario && selectedDifficulty
                ? 'linear-gradient(45deg, #3498db, #2980b9)'
                : 'rgba(0,0,0,0.12)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2980b9, #2c3e50)'
              }
            }}
          >
            {isLoading ? 'Starting Session...' : 'Start Practice Session'}
          </Button>
        </Box>
      </Box>

      {/* Dialogs remain the same */}
    </Box>
  );

  const renderPracticeSession = () => (
    <Box sx={{ 
      p: isMobile ? 2 : 3,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        pb: 2,
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Logo onClick={handleExitPractice} />
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          color: '#2c3e50',
          display: { xs: 'none', sm: 'block' }
        }}>
          {selectedScenario?.title} - {selectedDifficulty === 'beginner' ? 'Beginner' : 'Advanced'} Mode
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setShowMetrics(!showMetrics)}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: showMetrics ? '1fr 1fr' : '1fr'
        },
        gap: 3,
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Chat Interface */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  backgroundColor: message.role === 'user' ? '#3498db' : '#f8f9fa',
                  color: message.role === 'user' ? '#fff' : '#2c3e50',
                  p: 2,
                  borderRadius: '12px',
                  borderTopRightRadius: message.role === 'user' ? 0 : '12px',
                  borderTopLeftRadius: message.role === 'assistant' ? 0 : '12px',
                }}
              >
                <Typography variant="body1">
                  {message.content}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                sx={{
                  minWidth: '50px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #3498db, #2980b9)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2980b9, #2c3e50)'
                  }
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Metrics Panel - Only show on larger screens or when toggled on mobile */}
        {(!isMobile || showMetrics) && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? 0 : 'auto',
            right: isMobile ? 0 : 'auto',
            bottom: isMobile ? 0 : 'auto',
            left: isMobile ? 0 : 'auto',
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? '100%' : 'auto',
            backgroundColor: '#fff',
            zIndex: isMobile ? 1000 : 1,
            p: isMobile ? 2 : 0,
            overflowY: 'auto'
          }}>
            {isMobile && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Metrics & Tools
                </Typography>
                <IconButton onClick={() => setShowMetrics(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            
            {/* Conversation Pillars */}
            <Card sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Conversation Pillars
              </Typography>
              <Box className="pillars">
                {/* Pillar components remain the same */}
              </Box>
            </Card>

            {/* Quick Notes */}
            <Card sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Notes
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a quick note..."
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No notes yet
              </Typography>
            </Card>

            {/* Action Items */}
            <Card sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Action Items
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add an action item..."
                size="small"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No action items yet
              </Typography>
            </Card>
          </Box>
        )}
      </Box>

      {useVoice && (
        <VoicePracticeMode
          isActive={isPracticing}
          selectedScenario={selectedScenario}
          selectedDifficulty={selectedDifficulty}
          onSpeechDetected={handleSpeechDetected}
          onBotResponse={(response) => console.log('Bot response:', response)}
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
    </Box>
  );
};

export default PracticeMode;
