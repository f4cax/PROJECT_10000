import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Проверка авторизации при загрузке
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Авторизация пользователя
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('authToken', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Выход пользователя
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Сохранение финансовых данных
  const saveFinancialData = async (data) => {
    if (!token) return false;

    try {
      const response = await fetch(`${apiUrl}/api/user/financial-data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save financial data');
      }

      const result = await response.json();
      
      // Обновляем пользователя с новыми данными
      const updatedUser = { ...user, financialData: result.financialData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Error saving financial data:', error);
      return false;
    }
  };

  // Сохранение месячного дохода
  const saveMonthlyIncome = async (monthlyIncome, budgetDistribution) => {
    return await saveFinancialData({
      monthlyIncome,
      budgetDistribution
    });
  };

  // Сохранение выбранной стратегии
  const saveStrategy = async (selectedStrategy) => {
    return await saveFinancialData({
      selectedStrategy: selectedStrategy.id
    });
  };

  // Сохранение целей накопления
  const saveSavingsGoals = async (savingsGoals) => {
    console.log('AuthContext: Сохраняем цели в БД:', savingsGoals);
    const result = await saveFinancialData({
      savingsGoals
    });
    console.log('AuthContext: Результат сохранения:', result);
    return result;
  };

  // Сохранение результатов теста
  const saveTestResults = async (testResults) => {
    return await saveFinancialData({
      testResults
    });
  };

  // Получение профиля пользователя
  const fetchUserProfile = async () => {
    if (!token) return null;

    try {
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Обновление данных пользователя в контексте
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    saveFinancialData,
    saveMonthlyIncome,
    saveStrategy,
    saveSavingsGoals,
    saveTestResults,
    fetchUserProfile,
    updateUser,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 