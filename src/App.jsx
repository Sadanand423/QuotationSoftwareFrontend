import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import HomePage from './pages/Homepage/herosec.jsx'
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