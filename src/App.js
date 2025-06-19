import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './utils/translations';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import StocksPage from './pages/StocksPage';
import CBRPage from './pages/CBRPage';
import AssetsPage from './pages/AssetsPage';
import TipsPage from './pages/TipsPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import FinancialTestPage from './pages/FinancialTestPage';
// import { trackPageView } from './utils/analytics';
import './styles/App.css';

function App() {
  // Принудительная инициализация светлой темы
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <TranslationProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stocks" element={<StocksPage />} />
                <Route path="/cbr" element={<CBRPage />} />
                <Route path="/assets" element={<AssetsPage />} />
                <Route path="/tips" element={<TipsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/test" element={<FinancialTestPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TranslationProvider>
    </AuthProvider>
  );
}

export default App; 