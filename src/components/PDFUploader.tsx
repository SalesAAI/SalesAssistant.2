import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

interface PDFUploaderProps {
  onUploadComplete: () => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // In a real application, you would upload the file to your server here
      // const formData = new FormData();
      // formData.append('file', file);
      // await axios.post('/api/upload', formData);

      onUploadComplete();
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onUploadComplete]);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="pdf-upload"
        disabled={uploading}
      />
      <label htmlFor="pdf-upload">
        <Button
          variant="outlined"
          component="span"
          disabled={uploading}
          startIcon={<UploadIcon />}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            height: '120px',
            border: '2px dashed',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mb: 2
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Upload PDF
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click or drag and drop your script
          </Typography>
        </Button>
      </label>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Uploading... {progress}%
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Supported format: PDF
      </Typography>
    </Box>
  );
};

export default PDFUploader;
