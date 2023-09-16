import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './views/home';

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <BrowserRouter>
    <Routes>
      <Route path="/home" element={<Home />} />


      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);
