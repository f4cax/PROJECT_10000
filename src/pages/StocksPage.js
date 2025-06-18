import React from 'react';

export default function StocksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📈 Акции и Инвестиции
        </h1>
        <p className="text-lg text-gray-600">
          Информация об акциях, индексных фондах и расчёт сложного процента
        </p>
      </div>

      <div className="card text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Страница в разработке</h2>
        <p className="text-gray-600 mb-4">
          Здесь будет калькулятор сложного процента, информация об индексных фондах ЦБ РФ и рекомендации по инвестициям.
        </p>
        <div className="text-sm text-gray-500">
          Планируемые возможности:
          <ul className="mt-2 space-y-1">
            <li>• Калькулятор сложного процента</li>
            <li>• Информация об индексных фондах</li>
            <li>• Актуальные котировки</li>
            <li>• Рекомендации по инвестициям</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 