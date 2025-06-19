import React from 'react';
import { useTranslation } from '../utils/translations';

export default function AboutPage() {
  const { t } = useTranslation();

  const coreFeatures = [
    {
      icon: '💰',
      title: t('budgetPlanningTitle'),
      description: t('budgetPlanningDesc'),
      tech: 'Mark Tilbury 50-25-15-10'
    },
    {
      icon: '📊',
      title: t('assetManagementTitle'), 
      description: t('assetManagementDesc'),
      tech: 'EODHD + CoinGecko APIs'
    },
    {
      icon: '📈',
      title: t('realTimeDataTitle'),
      description: t('realTimeDataDesc'),
      tech: 'Central Bank API'
    },
    {
      icon: '🧠',
      title: t('financialTestTitle'),
      description: t('financialTestDesc'),
      tech: 'Algorithm-based'
    },
    {
      icon: '👑',
      title: t('adminPanelTitle'),
      description: t('adminPanelDesc'),
      tech: 'Full CRUD System'
    },
    {
      icon: '👤',
      title: t('userSystemTitle'),
      description: t('userSystemDesc'),
      tech: 'JWT + bcrypt'
    }
  ];

  const technicalFeatures = [
    {
      icon: '⚛️',
      title: t('reactStackTitle'),
      description: t('reactStackDesc'),
      badge: 'React 18'
    },
    {
      icon: '🔗',
      title: t('apiIntegrationsTitle'),
      description: t('apiIntegrationsDesc'),
      badge: 'Live Data'
    },
    {
      icon: '🗄️',
      title: t('databaseSchemaTitle'),
      description: t('databaseSchemaDesc'),
      badge: 'MongoDB'
    },
    {
      icon: '🔐',
      title: t('securityTitle'),
      description: t('securityDesc'),
      badge: 'Enterprise Grade'
    }
  ];

  const methodologyFeatures = [
    {
      icon: '📚',
      title: t('markTilburyMethodTitle'),
      description: t('markTilburyMethodDesc'),
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: '🧮',
      title: t('algorithmicCalculationsTitle'),
      description: t('algorithmicCalculationsDesc'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: '💡',
      title: t('recommendationSystemTitle'),
      description: t('recommendationSystemDesc'),
      color: 'from-purple-500 to-violet-600'
    }
  ];

  const practicalFeatures = [
    {
      icon: '🎯',
      title: t('budgetAutomationTitle'),
      description: t('budgetAutomationDesc'),
      metric: 'Zero errors'
    },
    {
      icon: '📊',
      title: t('investmentTrackingTitle'),
      description: t('investmentTrackingDesc'),
      metric: 'Real-time'
    },
    {
      icon: '🏆',
      title: t('goalPlanningTitle'),
      description: t('goalPlanningDesc'),
      metric: 'Calculated'
    }
  ];

  const architectureFeatures = [
    {
      icon: '☁️',
      title: t('cloudHostingTitle'),
      description: t('cloudHostingDesc'),
      platforms: ['Vercel', 'Railway', 'MongoDB Atlas']
    },
    {
      icon: '📱',
      title: t('pwaRealTitle'),
      description: t('pwaRealDesc'),
      platforms: ['iOS', 'Android', 'Desktop']
    },
    {
      icon: '🌐',
      title: t('multiLanguageTitle'),
      description: t('multiLanguageDesc'),
      platforms: ['Русский', 'English']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center">
            <div className="text-6xl mb-6">🧭</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('aboutProject')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              {t('projectSlogan')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-white/20 px-3 py-2 rounded-full">React.js</span>
              <span className="bg-white/20 px-3 py-2 rounded-full">Node.js + Express</span>
              <span className="bg-white/20 px-3 py-2 rounded-full">MongoDB</span>
              <span className="bg-white/20 px-3 py-2 rounded-full">Chart.js</span>
              <span className="bg-white/20 px-3 py-2 rounded-full">JWT Auth</span>
              <span className="bg-white/20 px-3 py-2 rounded-full">API Integrations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* Core Features */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            💼 {t('realFeatures')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full inline-block">
                  {feature.tech}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Solutions */}
        <section className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ⚙️ {t('technicalFeatures')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Proven Methodology */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            📊 {t('methodology')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodologyFeatures.map((feature, index) => (
              <div key={index} className={`group bg-gradient-to-r ${feature.color} rounded-2xl p-8 text-white hover:scale-105 transition-transform duration-300`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/90 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practical Value */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            💎 {t('practicalValue')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practicalFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold px-3 py-1 rounded-full">
                  {feature.metric}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Modern Architecture */}
        <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            🏗️ {t('modernArchitecture')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {architectureFeatures.map((feature, index) => (
              <div key={index} className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-100 mb-4 leading-relaxed">{feature.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {feature.platforms.map((platform, i) => (
                    <span key={i} className="bg-white/20 text-white text-xs px-2 py-1 rounded">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mark Tilbury Rule Explanation */}
        <section className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="text-5xl mb-6">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Правило 50-25-15-10 от Mark Tilbury
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">50%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">🏠 Потребности</div>
                <div className="text-xs text-gray-500">Еда, жилье, транспорт</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">🛡️ Накопления</div>
                <div className="text-xs text-gray-500">Подушка безопасности</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">15%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">📈 Инвестиции</div>
                <div className="text-xs text-gray-500">Рост капитала</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">🎉 Развлечения</div>
                <div className="text-xs text-gray-500">Качество жизни</div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Наше приложение автоматически рассчитывает распределение по этой проверенной методике,
              исключая ошибки и помогая следовать финансовому плану.
            </p>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            🛠️ {t('technologies')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React.js', icon: '⚛️', category: 'Frontend', color: 'bg-blue-500' },
              { name: 'Node.js', icon: '🟢', category: 'Backend', color: 'bg-green-500' },
              { name: 'MongoDB', icon: '🍃', category: 'Database', color: 'bg-green-600' },
              { name: 'Chart.js', icon: '📊', category: 'Charts', color: 'bg-orange-500' },
              { name: 'JWT', icon: '🔐', category: 'Auth', color: 'bg-purple-500' },
              { name: 'Tailwind', icon: '🎨', category: 'Styles', color: 'bg-cyan-500' },
              { name: 'Vercel', icon: '▲', category: 'Hosting', color: 'bg-black' },
              { name: 'Railway', icon: '🚄', category: 'Deploy', color: 'bg-violet-500' }
            ].map((tech, index) => (
              <div key={index} className={`text-center ${tech.color} rounded-lg p-4 hover:scale-105 transition-transform duration-300`}>
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-bold text-sm">{tech.name}</div>
                <div className="text-xs opacity-80">{tech.category}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <div className="text-5xl mb-6">📧</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('contactUsNew')}
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            {t('contactDescNew')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <a 
              href="mailto:g53705046@gmail.com"
              className="group bg-white/20 hover:bg-white/30 rounded-2xl p-6 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
            >
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="text-xl font-bold mb-2">{t('emailUs')}</h3>
              <p className="text-blue-100 mb-3">g53705046@gmail.com</p>
              <p className="text-sm text-blue-200">{t('responseTime')}</p>
            </a>
            
            <a 
              href="https://www.donationalerts.com/r/xxarnixx"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/20 hover:bg-white/30 rounded-2xl p-6 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
            >
              <div className="text-3xl mb-3">💝</div>
              <h3 className="text-xl font-bold mb-2">{t('supportProject')}</h3>
              <p className="text-blue-100 mb-3">DonationAlerts</p>
              <p className="text-sm text-blue-200">{t('globalCoverage')}</p>
            </a>
          </div>
          
          <div className="mt-8 text-sm text-blue-200">
            <p className="mb-2">🌐 {t('globalCoverage')}</p>
            <p>⚡ Built with modern web technologies</p>
          </div>
        </section>

      </div>
    </div>
  );
} 