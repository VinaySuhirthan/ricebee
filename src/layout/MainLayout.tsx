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

  const closeSidebar = React.useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Light content area, dark sidebar stays its own bg */}
      <StatusBar barStyle="dark-content" backgroundColor={colors.headerBg} />
      <View style={styles.layoutContainer}>
        {/* Left Collapsible Dark Navy Sidebar */}
        {isSidebarOpen && <Sidebar onClose={closeSidebar} />}

        {/* Right Main Content Area — Zoho light canvas */}
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
    backgroundColor: colors.sidebarBg,
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
