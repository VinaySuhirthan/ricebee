import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {RouteKey, NavigationContextType} from './navigationTypes';

const NavigationContext = createContext<NavigationContextType | null>(null);

interface NavigationProviderProps {
  initialRoute?: RouteKey;
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  initialRoute = 'dashboard',
  children,
}) => {
  const [currentRoute, setCurrentRoute] = useState<RouteKey>(initialRoute);
  const [params, setParams] = useState<Record<string, unknown>>({});
  const [history, setHistory] = useState<RouteKey[]>([initialRoute]);

  const navigate = useCallback(
    (route: RouteKey, newParams?: Record<string, unknown>) => {
      setCurrentRoute(route);
      setParams(newParams || {});
      setHistory(prev =>
        prev[prev.length - 1] === route ? prev : [...prev, route],
      );
    },
    [],
  );

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) {
        return prev;
      }
      const nextHistory = prev.slice(0, -1);
      const lastRoute = nextHistory[nextHistory.length - 1];
      setCurrentRoute(lastRoute);
      setParams({});
      return nextHistory;
    });
  }, []);

  const canGoBack = history.length > 1;

  const value = useMemo(
    () => ({
      currentRoute,
      params,
      navigate,
      goBack,
      canGoBack,
    }),
    [currentRoute, params, navigate, goBack, canGoBack],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationProvider;
