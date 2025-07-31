import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PetProvider } from './context/PetContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LostPets from './pages/LostPets';
import FoundPets from './pages/FoundPets';
import ReportPet from './pages/ReportPet';
import PetDetails from './pages/PetDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import EmailVerification from './pages/EmailVerification';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <PetProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pb-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lost-pets" element={<LostPets />} />
                <Route path="/found-pets" element={<FoundPets />} />
                <Route path="/report" element={<ReportPet />} />
                <Route path="/pet/:id" element={<PetDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PetProvider>
    </AuthProvider>
  );
}

export default App;