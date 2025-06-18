import { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';

// Мемоизированный компонент для оптимизации рендеринга
const PerformanceOptimizer = memo(({ children, dependencies = [] }) => {
  return useMemo(() => children, dependencies);
});

// Хук для оптимизации обработчиков событий
export const useOptimizedCallback = (callback, dependencies) => {
  return useCallback(callback, dependencies);
};

// Хук для мемоизации вычислений
export const useOptimizedMemo = (factory, dependencies) => {
  return useMemo(factory, dependencies);
};

// Компонент для ленивой загрузки
export const LazyWrapper = memo(({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="animate-pulse bg-gray-200 h-32 rounded"></div>}
    </div>
  );
});

export default PerformanceOptimizer; 