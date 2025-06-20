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
      metric: t('zeroErrorsMetric')
    },
    {
      icon: '📊',
      title: t('investmentTrackingTitle'),
      description: t('investmentTrackingDesc'),
      metric: t('realTimeMetric')
    },
    {
      icon: '🏆',
      title: t('goalPlanningTitle'),
      description: t('goalPlanningDesc'),
      metric: t('calculatedMetric')
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
      platforms: [t('russianLang'), t('englishLang')]
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-600 dark:via-indigo-700 dark:to-purple-700 text-gray-800 dark:text-white shadow-xl">
        <div className="absolute inset-0 bg-black/5 dark:bg-black/30 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="text-7xl mb-6 drop-shadow-lg">🧭</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white text-shadow">
              {t('aboutProject')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-indigo-700 dark:text-blue-100 max-w-4xl mx-auto text-shadow-sm">
              {t('projectSlogan')}
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
              <span className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer px-4 py-2 rounded-full backdrop-blur-lg border border-black/10 dark:border-white/20 text-gray-800 dark:text-white">React.js</span>
              <span className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer px-4 py-2 rounded-full backdrop-blur-lg border border-black/10 dark:border-white/20 text-gray-800 dark:text-white">Node.js + Express</span>
              <span className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer px-4 py-2 rounded-full backdrop-blur-lg border border-black/10 dark:border-white/20 text-gray-800 dark:text-white">MongoDB</span>
              <span className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer px-4 py-2 rounded-full backdrop-blur-lg border border-black/10 dark:border-white/20 text-gray-800 dark:text-white">Chart.js</span>
              <span className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer px-4 py-2 rounded-full backdrop-blur-lg border border-black/10 dark:border-white/20 text-gray-800 dark:text-white">JWT Auth</span>
              <span className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer px-4 py-2 rounded-full backdrop-blur-lg border border-black/10 dark:border-white/20 text-gray-800 dark:text-white">API Integrations</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">
        
        {/* Core Features */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white tracking-tight">
            <span className="inline-block mr-3">💼</span>{t('realFeatures')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-5xl mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">{feature.description}</p>
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full inline-block group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  {feature.tech}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Solutions */}
        <section className="bg-gray-100 dark:bg-gradient-to-r dark:from-gray-900 dark:to-indigo-900 rounded-3xl p-8 md:p-16 text-gray-800 dark:text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
             <span className="inline-block mr-3">⚙️</span>{t('technicalFeatures')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="bg-white/50 dark:bg-white/5 rounded-xl p-6 backdrop-blur-md border border-gray-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors">
                <div className="flex items-start space-x-5">
                  <div className="text-4xl pt-1">{feature.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-blue-100/80 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Proven Methodology */}
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white tracking-tight">
            <span className="inline-block mr-3">📊</span>{t('methodology')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methodologyFeatures.map((feature, index) => (
              <div key={index} className={`group bg-gradient-to-br ${feature.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
                <div className="text-5xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practical Value */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-3xl p-8 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white tracking-tight">
            <span className="inline-block mr-3">💎</span>{t('practicalValue')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practicalFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="text-5xl mb-4 text-green-500">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">{feature.description}</p>
                <span className="bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                  {feature.metric}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Modern Architecture */}
        <section className="bg-gray-100 dark:bg-gradient-to-r dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 rounded-3xl p-8 md:p-16 text-gray-800 dark:text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
            <span className="inline-block mr-3">🏗️</span>{t('modernArchitecture')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {architectureFeatures.map((feature, index) => (
              <div key={index} className="text-center bg-white/50 dark:bg-white/5 rounded-xl p-6 backdrop-blur-md border border-gray-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-blue-100/80 mb-5 leading-relaxed">{feature.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {feature.platforms.map((platform, i) => (
                    <span key={i} className="bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white text-xs px-3 py-1.5 rounded-full">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mark Tilbury Rule Explanation */}
        <section className="bg-white dark:bg-gray-800/30 rounded-3xl p-8 md:p-16 border border-gray-200 dark:border-gray-700/50">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-6xl mb-6 text-blue-500">📊</div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {t('markTilburyRuleTitle')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-4xl font-bold text-gray-700 dark:text-gray-200 mb-2">50%</div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">🏠 {t('needsCategory')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('needsCategoryDesc')}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">25%</div>
                <div className="font-semibold text-blue-800 dark:text-blue-200">🛡️ {t('savingsCategory')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('savingsCategoryDesc')}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">15%</div>
                <div className="font-semibold text-green-800 dark:text-green-200">📈 {t('investmentsCategory')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('investmentsCategoryDesc')}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">10%</div>
                <div className="font-semibold text-purple-800 dark:text-purple-200">🎉 {t('wantsCategory')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('wantsCategoryDesc')}</div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('markTilburyRuleDesc')}
            </p>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 md:p-16 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white tracking-tight">
            <span className="inline-block mr-3">🛠️</span>{t('techStack')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'React.js', icon: '⚛️', category: 'Frontend', color: 'bg-blue-500' },
              { name: 'Node.js', icon: '🟢', category: 'Backend', color: 'bg-green-500' },
              { name: 'MongoDB', icon: '🍃', category: 'Database', color: 'bg-green-600' },
              { name: 'Chart.js', icon: '📊', category: 'Charts', color: 'bg-orange-500' },
              { name: 'JWT', icon: '🔐', category: 'Auth', color: 'bg-purple-500' },
              { name: 'Tailwind', icon: '🎨', category: 'Styles', color: 'bg-cyan-500' },
              { name: 'Vercel', icon: '▲', category: 'Hosting', color: 'bg-gray-700' },
              { name: 'Railway', icon: '🚄', category: 'Deploy', color: 'bg-violet-500' }
            ].map((tech, index) => (
              <div key={index} className="text-center group">
                <div className={`flex items-center justify-center h-24 w-24 mx-auto rounded-full ${tech.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-4xl">{tech.icon}</div>
                </div>
                <div className="font-bold text-sm mt-4 text-gray-800 dark:text-white">{tech.name}</div>
                <div className="text-xs opacity-70 text-gray-600 dark:text-gray-400">{tech.category}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What Makes It Special */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-3xl p-8 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white tracking-tight">
             <span className="inline-block mr-3">🌟</span>{t('whatMakesSpecial')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="text-3xl text-amber-500 pt-1">🎯</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('scientificApproach')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('scientificApproachDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-3xl text-amber-500 pt-1">🔬</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('fullAutomation')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('fullAutomationDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-3xl text-amber-500 pt-1">📊</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('realTimeDataTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('realDataDesc')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="text-3xl text-amber-500 pt-1">🛡️</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('securityFeature')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('securityFeatureDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-3xl text-amber-500 pt-1">📱</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('accessibility')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('accessibilityDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-3xl text-amber-500 pt-1">🌍</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('openness')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('opennessDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-700 dark:to-indigo-700 rounded-3xl p-8 md:p-16 text-center shadow-xl">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white tracking-tight">
            {t('contactUsNew')}
          </h2>
          <p className="text-xl mb-10 text-gray-600 dark:text-blue-100 max-w-2xl mx-auto">
            {t('contactDescNew')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a 
              href="mailto:g53705046@gmail.com"
              className="group bg-white/50 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-2xl p-8 transition-all duration-300 hover:scale-105 backdrop-blur-md border border-gray-200/80 dark:border-white/20 shadow-lg"
            >
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('emailUs')}</h3>
              <p className="text-gray-600 dark:text-blue-100 mb-3 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">g53705046@gmail.com</p>
              <p className="text-sm text-gray-500 dark:text-blue-200">{t('responseTime')}</p>
            </a>
            
            <a 
              href="https://www.donationalerts.com/r/xxarnixx"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/50 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-2xl p-8 transition-all duration-300 hover:scale-105 backdrop-blur-md border border-gray-200/80 dark:border-white/20 shadow-lg"
            >
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('supportProject')}</h3>
              <p className="text-gray-600 dark:text-blue-100 mb-3 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">DonationAlerts</p>
              <p className="text-sm text-gray-500 dark:text-blue-200">{t('helpDevelopment')}</p>
            </a>
          </div>
          
          <div className="mt-12 text-sm text-gray-500 dark:text-blue-200/80 space-y-2">
            <p>🚀 {t('projectCommunity')}</p>
            <p>⚡ {t('modernTech')}</p>
          </div>
        </section>

      </main>
    </div>
  );
} 