import React from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import Sidebar from './Sidebar';
import Header from './Header';
import {colors} from '../shared/theme/colors';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.sidebarBg} />
      <View style={styles.layoutContainer}>
        {/* Left Persistent Dark Navy Sidebar */}
        <Sidebar />

        {/* Right Main Content Area */}
        <View style={styles.mainContent}>
          <Header />
          <View style={styles.pageContainer}>{children}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  layoutContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.appBg,
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
