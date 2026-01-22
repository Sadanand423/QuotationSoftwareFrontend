import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import HomePage from './pages/Homepage/herosec.jsx'
import About from './pages/About/About.jsx'
import Features from './pages/Features/Features.jsx'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Fotter.jsx'
import ContactUs from './components/Homepage/ContactUs'
import LoginModal from './components/login/LoginSelection'

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

function LoginPage() {
  const navigate = useNavigate();
  return <LoginModal isOpen={true} onClose={() => navigate('/')} />;
}

export default App;