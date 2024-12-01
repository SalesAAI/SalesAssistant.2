import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { ScenarioType, DifficultyLevel } from '../types/practice';

interface VoicePracticeModeProps {
  isActive: boolean;
  selectedScenario: ScenarioType | null;
  selectedDifficulty: DifficultyLevel | null;
  onSpeechDetected: (text: string) => void;
  onBotResponse: (response: string) => void;
}

const VoicePracticeMode: React.FC<VoicePracticeModeProps> = ({
  isActive,
  selectedScenario,
  selectedDifficulty,
  onSpeechDetected,
  onBotResponse
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        onSpeechDetected(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onSpeechDetected]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!isActive || !('webkitSpeechRecognition' in window)) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '8px 16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}
    >
      <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
        {isListening ? 'Listening...' : 'Click to speak'}
      </Typography>
      <IconButton
        onClick={toggleListening}
        color={isListening ? 'primary' : 'default'}
        sx={{
          backgroundColor: isListening ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
          '&:hover': {
            backgroundColor: isListening ? 'rgba(52, 152, 219, 0.2)' : 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        {isListening ? <MicIcon /> : <MicOffIcon />}
      </IconButton>
    </Box>
  );
};

export default VoicePracticeMode;
