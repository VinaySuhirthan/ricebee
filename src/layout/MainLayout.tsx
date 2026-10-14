import React from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import Sidebar from './Sidebar';
import Header from './Header';
import {colors} from '../shared/theme/colors';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = React.useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.layoutContainer}>
        {isSidebarOpen && <Sidebar />}

        {/* Right Main Content Area — Warm Off-white canvas */}
        <View style={styles.mainContent}>
          <Header
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <View style={styles.pageContainer}>{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  layoutContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.appBg,
    height: '100%',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
});

export default MainLayout;
