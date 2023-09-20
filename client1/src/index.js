import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from './views/home';
import Chatui from './components/Csidebar';
import ChatInterface from './components/ChatInterface';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <BrowserRouter>
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="*" element={<Navigate to="/home" replace />} />
      <Route path="/chat" element={<Chatui/>} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);
