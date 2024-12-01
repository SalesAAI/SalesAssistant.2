import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <Box
        sx={{
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          borderRadius: '8px',
          background: 'linear-gradient(45deg, #3498db, #2980b9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: { xs: '1rem', sm: '1.2rem' }
        }}
      >
        SA
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1rem', sm: '1.25rem' },
          display: { xs: 'none', sm: 'block' },
          background: 'linear-gradient(45deg, #3498db, #2980b9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Sales Assistant
      </Typography>
    </Box>
  );
};

export default Logo;
