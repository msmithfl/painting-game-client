import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import MainRoom from './MainRoom';
import GameRoom from './GameRoom';
import './index.css';

const rootElement = document.getElementById('root');

const root = ReactDOM.createRoot(rootElement);

root.render(
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gameroom/:roomName" element={<MainRoom />} />
        <Route path="/test-gameroom" element={<GameRoom />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route */}
      </Routes>
    </Router>
);
