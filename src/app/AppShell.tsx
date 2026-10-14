import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationProvider, useNavigation} from '../navigation/AppNavigator';
import MainLayout from '../layout/MainLayout';
import {ROUTE_REGISTRY, DEFAULT_ROUTE} from './routeConfig';
import EmptyState from '../shared/components/EmptyState';
import {colors} from '../shared/theme/colors';

const ShellContent: React.FC = () => {
  const {currentRoute, navigate} = useNavigation();

  const routeDef = ROUTE_REGISTRY[currentRoute];

  if (!routeDef) {
    return (
      <View style={styles.errorContainer}>
        <EmptyState
          title="Module Not Found"
          description={`The requested route "${currentRoute}" could not be resolved in the central route registry.`}
          actionTitle="Return to Dashboard"
          onAction={() => navigate(DEFAULT_ROUTE)}
        />
      </View>
    );
  }

  const ScreenComponent = routeDef.component;

  return (
    <MainLayout>
      <ScreenComponent />
    </MainLayout>
  );
};

export const AppShell: React.FC = () => {
  return (
    <NavigationProvider initialRoute={DEFAULT_ROUTE}>
      <ShellContent />
    </NavigationProvider>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: colors.appBg,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppShell;
