import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import TracingPage from './TracingPage.jsx'; // ✅ Use this one!
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/trace/:kanji" element={<TracingPage />} /> {/* ✅ FIXED */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
