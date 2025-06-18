import React from 'react';
import { useTranslation } from '../utils/translations';

export default function AboutPage() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('aboutProject')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('missionDescription')}
        </p>
      </div>

      {/* Миссия */}
      <div className="card">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🎯</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('ourMission')}</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {t('missionDescription')} {' '}
          Используя проверенное правило <span className="font-semibold text-primary-600">50-25-15-10</span> от 
          знаменитого финансового консультанта Mark Tilbury, мы помогаем людям 
          создать стабильное финансовое будущее.
        </p>
      </div>

      {/* Особенности */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🤖</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('financialHelper')}</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {t('helperDescription')}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">📊</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('actualData')}</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {t('actualDataDescription')}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">📱</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('pwaApp')}</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {t('pwaDescription')}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🔒</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('security')}</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            {t('securityDescription')}
          </p>
        </div>
      </div>

      {/* Правило 50-30-15-5 */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-300 mb-2">
            📖 {t('budgetDistributionRule')} 50-25-15-10
          </h2>
          <p className="text-primary-700 dark:text-primary-400">
            Основа нашего приложения — проверенная система от Mark Tilbury
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">
              🏠
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">50%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('essentialExpenses')}</p>
          </div>

          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">
              🛡️
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">25%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('emergencyFund')}</p>
          </div>

          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">
              📈
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">15%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('investments')}</p>
          </div>

          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">
              🎉
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">10%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('entertainment')}</p>
          </div>
        </div>
      </div>

      {/* Технологии */}
      <div className="card">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">⚡</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('technologies')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">React.js</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('frontend')}</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">Node.js</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('backend')}</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">Chart.js</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('charts')}</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="font-semibold text-gray-900 dark:text-white">Tailwind CSS</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('styles')}</div>
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className="card bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📞 {t('contactUs')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {t('contactDescription')}
          </p>
          <div className="flex justify-center space-x-4">
            <a href="mailto:info@financeguide.ru" className="btn-primary">
              ✉️ {t('writeUs')}
            </a>
            <a href="https://github.com/yourusername/financeguide" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              🐙 GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 