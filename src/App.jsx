import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage/herosec.jsx'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Fotter.jsx'
import ContactUs from './components/Homepage/ContactUs'

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;