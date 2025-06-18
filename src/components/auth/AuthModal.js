import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '../../utils/translations';

export default function AuthModal({ isOpen, onClose, onAuth }) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Произошла ошибка');
      }

      // Логируем результат для отладки
      console.log('Авторизация успешна:', result.user);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Вызываем callback для обновления состояния авторизации
      onAuth(result.user, result.token);
      
      // Закрываем модальное окно
      onClose();
      reset();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? `🔑 ${t('login')}` : `📝 ${t('register')}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="label">{t('name')}</label>
              <input
                {...register('name', { 
                  required: 'Имя обязательно',
                  minLength: { value: 2, message: 'Минимум 2 символа' }
                })}
                type="text"
                className="input-field"
                placeholder={t('name')}
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="label">{t('email')}</label>
            <input
              {...register('email', { 
                required: 'Email обязателен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email'
                }
              })}
              type="email"
              className="input-field"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">{t('password')}</label>
            <input
              {...register('password', { 
                required: 'Пароль обязателен',
                minLength: { value: 6, message: 'Минимум 6 символов' }
              })}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isLogin ? `${t('login')}...` : `${t('register')}...`}
              </span>
            ) : (
              isLogin ? t('login') : t('register')
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button
              onClick={toggleMode}
              className="ml-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
            >
              {isLogin ? t('register') : t('login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 