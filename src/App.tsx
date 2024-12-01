import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PracticeMode from './components/PracticeMode';
import PDFUploader from './components/PDFUploader';
import VoicePracticeMode from './components/VoicePracticeMode';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sales Assistant AI</h1>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/practice" className="nav-link">Practice Mode</Link>
          <Link to="/upload" className="nav-link">Upload Script</Link>
          <Link to="/voice-practice" className="nav-link">Voice Practice</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={
            <div className="home-content">
              <h2>Welcome to Sales Assistant AI</h2>
              <p>Your AI-powered sales companion</p>
              <div className="feature-grid">
                <div className="feature-card">
                  <h3>Practice Mode</h3>
                  <p>Practice your sales pitch with AI feedback</p>
                  <Link to="/practice" className="feature-link">Start Practice</Link>
                </div>
                <div className="feature-card">
                  <h3>Script Upload</h3>
                  <p>Upload and manage your sales scripts</p>
                  <Link to="/upload" className="feature-link">Upload Script</Link>
                </div>
                <div className="feature-card">
                  <h3>Voice Practice</h3>
                  <p>Practice with voice recognition</p>
                  <Link to="/voice-practice" className="feature-link">Start Voice Practice</Link>
                </div>
              </div>
            </div>
          } />
          <Route path="/practice" element={<PracticeMode />} />
          <Route path="/upload" element={<PDFUploader onUploadComplete={() => {}} />} />
          <Route path="/voice-practice" element={
            <VoicePracticeMode
              isActive={true}
              selectedScenario={null}
              selectedDifficulty={null}
              onSpeechDetected={(text) => console.log('Speech detected:', text)}
              onBotResponse={(response) => console.log('Bot response:', response)}
            />
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
