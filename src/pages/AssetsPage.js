import React from 'react';

export default function AssetsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          💰 Подсчёт всех активов
        </h1>
        <p className="text-lg text-gray-600">
          Учёт и анализ всех ваших активов с поправкой на инфляцию
        </p>
      </div>

      <div className="card text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Страница в разработке</h2>
        <p className="text-gray-600 mb-4">
          Здесь будет возможность учёта всех ваших активов: банковские счета, инвестиции, недвижимость.
        </p>
        <div className="text-sm text-gray-500">
          Планируемые возможности:
          <ul className="mt-2 space-y-1">
            <li>• Учёт банковских счетов</li>
            <li>• Портфель инвестиций</li>
            <li>• Недвижимость и другие активы</li>
            <li>• Расчёт с учётом инфляции</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 