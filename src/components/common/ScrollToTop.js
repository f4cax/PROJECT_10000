import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Мгновенно прокручиваем к началу страницы при смене маршрута
    // Для админ-панели и других страниц важна быстрая навигация
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop; 