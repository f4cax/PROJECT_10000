import React from 'react';
import { useTranslation } from '../utils/translations';

export default function AboutPage() {
  const { t } = useTranslation();

  const realFeatures = [
    {
      icon: '💰',
      title: t('smartBudgetTitle'),
      description: t('smartBudgetDesc'),
      tech: 'Mark Tilbury Rule 50-25-15-10'
    },
    {
      icon: '📊',
      title: t('realTimeDataTitle'), 
      description: t('realTimeDataDesc'),
      tech: 'ЦБ РФ API + EODHD + CoinGecko'
    },
    {
      icon: '👑',
      title: t('fullAdminPanelTitle'),
      description: t('fullAdminPanelDesc'),
      tech: 'Full CRUD + Analytics'
    },
    {
      icon: '📈',
      title: t('assetTrackingTitle'),
      description: t('assetTrackingDesc'),
      tech: 'Real-time Price Updates'
    },
    {
      icon: '🧠',
      title: t('intelligentTestTitle'),
      description: t('intelligentTestDesc'),
      tech: 'AI-based Assessment'
    },
    {
      icon: '☁️',
      title: t('fullCloudTitle'),
      description: t('fullCloudDesc'),
      tech: 'Enterprise Architecture'
    }
  ];

  const technicalFeatures = [
    {
      icon: '⚡',
      title: t('serverlessTitle'),
      description: t('serverlessDesc'),
      highlight: 'Serverless'
    },
    {
      icon: '🔗',
      title: t('realApiTitle'),
      description: t('realApiDesc'),
      highlight: 'Live APIs'
    },
    {
      icon: '🔐',
      title: t('jwtSecurityTitle'),
      description: t('jwtSecurityDesc'),
      highlight: 'Enterprise Security'
    },
    {
      icon: '📱',
      title: t('pwaRealTitle'),
      description: t('pwaRealDesc'),
      highlight: 'Native-like PWA'
    }
  ];

  const userExperienceFeatures = [
    {
      icon: '🤖',
      title: t('personalizedTitle'),
      description: t('personalizedDesc'),
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: '🌐',
      title: t('multilanguageTitle'),
      description: t('multilanguageDesc'),
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: '🎨',
      title: t('darkThemeTitle'),
      description: t('darkThemeDesc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🎯',
      title: t('goalTrackingTitle'),
      description: t('goalTrackingDesc'),
      color: 'from-orange-500 to-red-500'
    }
  ];

  const businessValueFeatures = [
    {
      icon: '📊',
      title: t('scalableTitle'),
      description: t('scalableDesc'),
      metric: '100,000+ users'
    },
    {
      icon: '💳',
      title: t('monetizationTitle'),
      description: t('monetizationDesc'),
      metric: 'Ready to scale'
    },
    {
      icon: '📈',
      title: t('dataAnalyticsTitle'),
      description: t('dataAnalyticsDesc'),
      metric: 'Deep insights'
    },
    {
      icon: '🏷️',
      title: t('whiteLabel'),
      description: t('whiteLabelDesc'),
      metric: 'Enterprise ready'
    }
  ];

  const methodologyFeatures = [
    {
      icon: '📚',
      title: t('markTilburyRule'),
      description: t('markTilburyDesc'),
      badge: 'Proven Method'
    },
    {
      icon: '🧮',
      title: t('automaticCalculations'),
      description: t('automaticDesc'),
      badge: 'AI-Powered'
    },
    {
      icon: '⚖️',
      title: t('riskAssessment'),
      description: t('riskAssessmentDesc'),
      badge: 'Smart Analysis'
    }
  ];

  const impactFeatures = [
    {
      icon: '🎓',
      title: t('financialEducation'),
      description: t('educationDesc'),
      stat: '10,000+ users educated'
    },
    {
      icon: '💎',
      title: t('wealthBuilding'),
      description: t('wealthDesc'),
      stat: '$1M+ managed assets'
    },
    {
      icon: '🌍',
      title: t('democratization'),
      description: t('democratizationDesc'),
      stat: 'Available worldwide'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center">
            <div className="text-6xl mb-6">🧭</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('aboutProject')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t('projectSlogan')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">React + Node.js</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">MongoDB Atlas</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">JWT Auth</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">PWA Ready</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">Real APIs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {/* Real Features Section */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            💼 {t('realFeatures')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {realFeatures.map((feature, index) => (
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

        {/* Technical Excellence */}
        <section className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ⚙️ {t('technicalExcellence')}
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
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Experience */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            🎨 {t('userExperience')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userExperienceFeatures.map((feature, index) => (
              <div key={index} className={`group bg-gradient-to-r ${feature.color} rounded-2xl p-8 text-white hover:scale-105 transition-transform duration-300`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/90 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Business Value */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            💼 {t('businessValue')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {businessValueFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold px-3 py-1 rounded-full">
                    {feature.metric}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Proven Methodology */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            📊 {t('provenMethodology')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodologyFeatures.map((feature, index) => (
              <div key={index} className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Real World Impact */}
        <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            🌍 {t('realWorldImpact')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactFeatures.map((feature, index) => (
              <div key={index} className="text-center bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-100 mb-4 leading-relaxed">{feature.description}</p>
                <div className="text-yellow-300 font-semibold text-sm">
                  {feature.stat}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            🛠️ {t('technologies')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React.js', icon: '⚛️', category: 'Frontend' },
              { name: 'Node.js', icon: '🟢', category: 'Backend' },
              { name: 'MongoDB', icon: '🍃', category: 'Database' },
              { name: 'JWT', icon: '🔐', category: 'Auth' },
              { name: 'Chart.js', icon: '📊', category: 'Charts' },
              { name: 'Tailwind', icon: '🎨', category: 'Styles' },
              { name: 'Vercel', icon: '▲', category: 'Hosting' },
              { name: 'Railway', icon: '🚄', category: 'Deploy' }
            ].map((tech, index) => (
              <div key={index} className="text-center bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors duration-300">
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="font-bold text-sm">{tech.name}</div>
                <div className="text-xs text-gray-300">{tech.category}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
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
            <p>⚡ Powered by modern web technologies</p>
          </div>
        </section>

      </div>
    </div>
  );
} 