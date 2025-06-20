import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

export default function AssetsPage() {
  const { t } = useTranslation();
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    distribution: {}
  });
  const [analytics, setAnalytics] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({
    type: 'cash',
    name: '',
    amount: 0,
    currency: 'RUB',
    symbol: '',
    quantity: '',
    purchasePrice: '',
    description: '',
    category: '',
    isTracked: false
  });

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Загрузка активов пользователя
  const loadAssets = useCallback(async (sync = false) => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const endpoint = sync ? '/api/user/assets?sync=true' : '/api/user/assets';
      const url = `${apiUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
        setPortfolio(data.portfolio || {
          totalValue: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          distribution: {}
        });
              } else if (response.status === 401) {
          // Пользователь не авторизован
          console.error('Ошибка авторизации при загрузке активов');
        }
    } catch (error) {
      console.error('Ошибка загрузки активов:', error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [token, apiUrl]);

  // Загрузка аналитики
  const loadAnalytics = useCallback(async () => {
    try {
      if (!token) return;

      const response = await fetch(`${apiUrl}/api/user/portfolio/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    loadAssets();
    loadAnalytics();
  }, [loadAssets, loadAnalytics]);

  // Синхронизация цен
  const handleSync = async () => {
    setSyncing(true);
    await loadAssets(true);
    await loadAnalytics();
  };

  // Добавление актива
  const handleAddAsset = async () => {
    if (!newAsset.name || newAsset.amount <= 0) return;

    try {
      const response = await fetch(`${apiUrl}/api/user/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAsset)
      });

      if (response.ok) {
        setNewAsset({
          type: 'cash',
          name: '',
          amount: 0,
          currency: 'RUB',
          symbol: '',
          quantity: '',
          purchasePrice: '',
          description: '',
          category: '',
          isTracked: false
        });
        setShowAddAsset(false);
        await loadAssets();
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Ошибка добавления актива:', error);
    }
  };

  // Удаление актива
  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот актив?')) return;

    try {
      const response = await fetch(`${apiUrl}/api/user/assets/${assetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await loadAssets();
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Ошибка удаления актива:', error);
    }
  };

  // Редактирование актива
  const handleEditAsset = async (assetId, updateData) => {
    try {
      const response = await fetch(`${apiUrl}/api/user/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setEditingAsset(null);
        await loadAssets();
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Ошибка обновления актива:', error);
    }
  };

  const formatCurrency = (amount, currency = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getAssetIcon = (type) => {
    const icons = {
      cash: '💰',
      stocks: '📈',
      crypto: '₿',
      realestate: '🏠',
      business: '🏢',
      bonds: '📊',
      other: '💼'
    };
    return icons[type] || '💼';
  };

  const getAssetColor = (type) => {
    const colors = {
      cash: 'green',
      stocks: 'blue',
      crypto: 'orange',
      realestate: 'purple',
      business: 'indigo',
      bonds: 'teal',
      other: 'gray'
    };
    return colors[type] || 'gray';
  };



  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            💰 {t('assetsTitle') || 'Управление активами'}
          </h1>
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Загружаем ваш портфель...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            💰 {t('assetsTitle') || 'Управление активами'}
          </h1>
          <div className="card text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Требуется авторизация
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Войдите в аккаунт, чтобы управлять своими активами
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Войти в аккаунт
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          💰 {t('portfolioManagement') || 'Управление активами'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('fullPortfolioControl') || 'Полный контроль над вашим финансовым портфелем'}
        </p>
      </div>

      {/* Панель управления */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => setShowAddAsset(true)}
          className="btn-primary"
        >
          ➕ {t('addAsset') || 'Добавить актив'}
        </button>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-secondary"
        >
          {syncing ? `🔄 ${t('syncing') || 'Синхронизация...'}` : `🔄 ${t('syncPrices') || 'Синхронизировать цены'}`}
        </button>
        <button
          onClick={() => loadAssets()}
          className="btn-secondary"
        >
          🔃 {t('refreshData') || 'Обновить данные'}
        </button>
      </div>

      {/* Общая статистика портфеля */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
            💎 {t('totalValue') || 'Общая стоимость'}
          </h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(portfolio.totalValue)}
          </div>
          {portfolio.lastCalculated && (
            <p className="text-xs text-green-700 dark:text-green-500 mt-1">
              {t('updated') || 'Обновлено'}: {new Date(portfolio.lastCalculated).toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            📊 {t('numberOfAssets') || 'Количество активов'}
          </h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {assets.length}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t('assetsCount') || 'Различных активов'}
          </p>
        </div>

        <div className={`card text-center ${portfolio.totalGainLoss >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${portfolio.totalGainLoss >= 0 ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'}`}>
            📈 {t('profitability') || 'Доходность'}
          </h3>
          <div className={`text-3xl font-bold ${portfolio.totalGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {portfolio.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(portfolio.totalGainLoss)}
          </div>
          <p className={`text-sm font-medium ${portfolio.totalGainLoss >= 0 ? 'text-green-700 dark:text-green-500' : 'text-red-700 dark:text-red-500'}`}>
            {portfolio.totalGainLossPercent >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%
          </p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            🎯 {t('diversification') || 'Диверсификация'}
          </h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {analytics?.diversification?.score?.toFixed(0) || 0}%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {t('portfolioAssessment') || 'Оценка портфеля'}
          </p>
        </div>
      </div>

      {/* Распределение активов */}
      {portfolio.distribution && Object.keys(portfolio.distribution).some(key => portfolio.distribution[key] > 0) && (
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            🥧 {t('portfolioDistribution') || 'Распределение портфеля'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(portfolio.distribution).map(([type, amount]) => {
              if (amount <= 0) return null;
              const percentage = portfolio.totalValue > 0 ? (amount / portfolio.totalValue * 100) : 0;
              const color = getAssetColor(type);
              
              return (
                <div key={type} className="text-center">
                  <div className="text-3xl mb-2">{getAssetIcon(type)}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {t(type) || type}
                  </h4>
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(amount)}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Список активов */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            📝 {t('yourAssetsTitle') || 'Ваши активы'}
          </h2>
          {assets.filter(a => a.isTracked).length > 0 && (
            <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              📡 {assets.filter(a => a.isTracked).length} {t('assetsTracked') || 'активов отслеживается'}
            </span>
          )}
        </div>
        
        {assets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('portfolioEmpty') || 'Портфель пуст'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('addFirstAsset') || 'Добавьте свой первый актив, чтобы начать отслеживание портфеля'}
            </p>
            <button
              onClick={() => setShowAddAsset(true)}
              className="btn-primary"
            >
              ➕ {t('addFirstAssetButton') || 'Добавить первый актив'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map(asset => {
              const percentage = portfolio.totalValue > 0 ? (asset.amount / portfolio.totalValue * 100) : 0;
              const gainLoss = asset.quantity && asset.purchasePrice && asset.currentPrice 
                ? (asset.currentPrice - asset.purchasePrice) * asset.quantity
                : 0;
              const gainLossPercent = asset.purchasePrice && asset.currentPrice
                ? ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100
                : 0;
              
              return (
                <div key={asset._id} className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{getAssetIcon(asset.type)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {asset.name}
                        </h3>
                        {asset.symbol && (
                          <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            {asset.symbol}
                          </span>
                        )}
                        {asset.isTracked && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                            📡 {t('tracked') || 'Отслеживается'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {percentage.toFixed(1)}% {t('fromPortfolio') || 'от портфеля'}
                        {asset.quantity && <span> • {asset.quantity} {t('pieces') || 'шт.'}</span>}
                        {asset.category && <span> • {asset.category}</span>}
                      </p>
                      {asset.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {asset.description}
                        </p>
                      )}
                      {asset.lastUpdated && asset.isTracked && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {t('updated') || 'Обновлено'}: {new Date(asset.lastUpdated).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    {/* Финансовые показатели */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(asset.amount, asset.currency)}
                      </div>
                      {asset.currentPrice && asset.quantity && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(asset.currentPrice)} {t('perPiece') || 'за шт.'}
                        </div>
                      )}
                      {gainLoss !== 0 && (
                        <div className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)} ({gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                        </div>
                      )}
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className={`bg-${getAssetColor(asset.type)}-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Кнопки управления */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingAsset(asset)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                        title={t('edit') || 'Редактировать'}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                        title={t('delete') || 'Удалить'}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Аналитика и рекомендации */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Топ активы */}
          {analytics.topAssets?.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                🥇 {t('topAssets') || 'Топ активы'}
              </h3>
              <div className="space-y-3">
                {analytics.topAssets.map((asset, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getAssetIcon(asset.type)}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{asset.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{asset.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {formatCurrency(asset.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Рекомендации */}
          <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">
              💡 {t('recommendations') || 'Рекомендации'}
            </h3>
            
            {analytics.diversification?.recommendations?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">{t('diversificationRecommendations') || 'По диверсификации'}:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {analytics.diversification.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analytics.suggestions?.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">{t('generalTips') || 'Общие советы'}:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {analytics.suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {(!analytics.diversification?.recommendations?.length && !analytics.suggestions?.length) && (
              <p className="text-blue-700 dark:text-blue-300">
                {t('portfolioExcellent') || '🎉 Отличная работа! Ваш портфель сбалансирован.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно добавления актива */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              ➕ Добавить новый актив
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Тип актива *</label>
                <select
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                  className="input-field"
                >
                  <option value="cash">💰 Наличные/Депозиты</option>
                  <option value="stocks">📈 Акции</option>
                  <option value="crypto">₿ Криптовалюта</option>
                  <option value="realestate">🏠 Недвижимость</option>
                  <option value="business">🏢 Бизнес</option>
                  <option value="bonds">📊 Облигации</option>
                  <option value="other">💼 Другое</option>
                </select>
              </div>
              
              <div>
                <label className="label">Название актива *</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="input-field"
                  placeholder="Например: Сбербанк депозит"
                />
              </div>
              
              <div>
                <label className="label">Общая стоимость *</label>
                <input
                  type="number"
                  value={newAsset.amount || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewAsset({...newAsset, amount: value === '' ? '' : parseFloat(value) || 0});
                  }}
                  onFocus={(e) => e.target.select()}
                  className="input-field"
                  placeholder="Введите стоимость актива"
                />
              </div>
              
              <div>
                <label className="label">Валюта</label>
                <select
                  value={newAsset.currency}
                  onChange={(e) => setNewAsset({...newAsset, currency: e.target.value})}
                  className="input-field"
                >
                  <option value="RUB">₽ Рубли</option>
                  <option value="USD">$ Доллары</option>
                  <option value="EUR">€ Евро</option>
                </select>
              </div>

              {(newAsset.type === 'stocks' || newAsset.type === 'crypto') && (
                <>
                  <div>
                    <label className="label">Символ (для отслеживания цены)</label>
                    <input
                      type="text"
                      value={newAsset.symbol}
                      onChange={(e) => setNewAsset({...newAsset, symbol: e.target.value})}
                      className="input-field"
                      placeholder={newAsset.type === 'stocks' ? 'AAPL, GOOGL' : 'BTC, ETH'}
                    />
                  </div>
                  
                  <div>
                    <label className="label">Количество</label>
                    <input
                      type="number"
                      step="0.00001"
                      value={newAsset.quantity}
                      onChange={(e) => setNewAsset({...newAsset, quantity: e.target.value})}
                      className="input-field"
                      placeholder="1.5"
                    />
                  </div>
                  
                  <div>
                    <label className="label">Цена покупки</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAsset.purchasePrice}
                      onChange={(e) => setNewAsset({...newAsset, purchasePrice: e.target.value})}
                      className="input-field"
                      placeholder="100.50"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newAsset.isTracked}
                        onChange={(e) => setNewAsset({...newAsset, isTracked: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        📡 Отслеживать цену автоматически
                      </span>
                    </label>
                  </div>
                </>
              )}
              
              <div className="md:col-span-2">
                <label className="label">Описание</label>
                <textarea
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                  className="input-field"
                  rows="2"
                  placeholder="Дополнительная информация об активе"
                />
              </div>
              
              <div>
                <label className="label">Категория</label>
                <input
                  type="text"
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({...newAsset, category: e.target.value})}
                  className="input-field"
                  placeholder="Технологии, Недвижимость..."
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddAsset}
                className="btn-primary flex-1"
                disabled={!newAsset.name || newAsset.amount <= 0}
              >
                ➕ Добавить актив
              </button>
              <button
                onClick={() => setShowAddAsset(false)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования актива */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ✏️ Редактировать: {editingAsset.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">Название</label>
                <input
                  type="text"
                  defaultValue={editingAsset.name}
                  onChange={(e) => setEditingAsset({...editingAsset, name: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="label">Стоимость</label>
                <input
                  type="number"
                  defaultValue={editingAsset.amount}
                  onChange={(e) => setEditingAsset({...editingAsset, amount: parseFloat(e.target.value) || 0})}
                  className="input-field"
                />
              </div>
              
              {editingAsset.symbol && (
                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingAsset.isTracked}
                      onChange={(e) => setEditingAsset({...editingAsset, isTracked: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      📡 Отслеживать цену автоматически
                    </span>
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => handleEditAsset(editingAsset._id, editingAsset)}
                className="btn-primary flex-1"
              >
                💾 Сохранить
              </button>
              <button
                onClick={() => setEditingAsset(null)}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 