// ============================================================
// Root Layout — drawer navigator + global dictionary state
// Drawer links to Search and History pages (Android & iOS)
// ============================================================

import React, { useEffect, useMemo, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DictionaryProvider, useDictionary } from '../context/DictionaryContext';
import { colors } from '../constants/colors';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';
import AppSplash from '../components/AppSplash';

// Hide the default Expo splash so our custom icon screen shows instead
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Custom drawer — branding header + navigation links.
 * Full history list lives on the dedicated History page.
 */
function CustomDrawerContent(props) {
  const { searchHistory } = useDictionary();
  const { scale, drawerWidth } = useResponsive();
  const styles = useMemo(() => createDrawerStyles(scale), [scale]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerScroll}
      style={[styles.drawerContainer, { width: drawerWidth }]}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.accentDecor} />
        <View style={[styles.logoBox, { width: scale(48), height: scale(48) }]}>
          <Ionicons name="book" size={scale(26)} color={colors.white} />
        </View>
        <Text style={styles.drawerTitle}>LexiTech</Text>
        <Text style={styles.drawerSubtitle}>Dictionary App</Text>
        <Text style={styles.companyName}>LexiTech Solutions Ltd</Text>
      </View>

      <View style={styles.navSection}>
        <Text style={styles.sectionLabel}>Navigation</Text>
        <DrawerItemList {...props} />
      </View>

      {/* Quick history count — tap History in menu for full page */}
      <View style={styles.statsBox}>
        <Ionicons name="time-outline" size={scale(20)} color={colors.secondary} />
        <Text style={styles.statsText}>
          {searchHistory.length} word{searchHistory.length !== 1 ? 's' : ''} in history
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

function RootLayoutNav() {
  const { scale, drawerWidth } = useResponsive();

  return (
    <>
      <StatusBar style="light" />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: colors.white,
          drawerActiveBackgroundColor: colors.secondary + '33',
          drawerInactiveTintColor: colors.drawerTextMuted,
          drawerLabelStyle: {
            fontFamily: fonts.sans,
            fontSize: scale(15),
            fontWeight: '600',
            marginLeft: -8,
          },
          drawerStyle: {
            backgroundColor: colors.drawerBackground,
            width: drawerWidth,
          },
          headerStyle: {
            backgroundColor: colors.navy,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontFamily: fonts.sans,
            fontWeight: '800',
            fontSize: scale(18),
          },
          sceneContainerStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Dictionary',
            drawerLabel: 'Word Search',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: 'History',
            drawerLabel: 'Search History',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
      </Drawer>
    </>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Hide native Expo splash, then show our assets/icon.png screen briefly
      await SplashScreen.hideAsync();
      setTimeout(() => setAppReady(true), 1200);
    }

    prepare();
  }, []);

  if (!appReady) {
    return <AppSplash />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <DictionaryProvider>
        <RootLayoutNav />
      </DictionaryProvider>
    </GestureHandlerRootView>
  );
}

function createDrawerStyles(scale) {
  return StyleSheet.create({
    drawerContainer: { backgroundColor: colors.drawerBackground },
    drawerScroll: { flexGrow: 1, paddingBottom: scale(20) },
    drawerHeader: {
      paddingHorizontal: scale(24),
      paddingTop: scale(52),
      paddingBottom: scale(24),
      backgroundColor: colors.drawerSurface,
      marginBottom: scale(12),
      overflow: 'hidden',
    },
    accentDecor: {
      position: 'absolute',
      top: scale(-20),
      right: scale(-20),
      width: scale(100),
      height: scale(100),
      borderRadius: scale(50),
      backgroundColor: colors.secondary,
      opacity: 0.15,
    },
    logoBox: {
      borderRadius: scale(14),
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(14),
    },
    drawerTitle: {
      fontFamily: fonts.serif,
      fontSize: scale(26),
      fontWeight: '700',
      color: colors.drawerText,
    },
    drawerSubtitle: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      color: colors.secondary,
      fontWeight: '600',
      marginTop: scale(2),
    },
    companyName: {
      fontFamily: fonts.sans,
      fontSize: scale(12),
      color: colors.drawerTextMuted,
      marginTop: scale(6),
    },
    navSection: { paddingHorizontal: scale(4), marginBottom: scale(8) },
    sectionLabel: {
      fontFamily: fonts.sans,
      fontSize: scale(11),
      fontWeight: '700',
      color: colors.drawerTextMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      paddingHorizontal: scale(20),
      paddingVertical: scale(8),
    },
    statsBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      marginHorizontal: scale(16),
      marginTop: scale(8),
      padding: scale(16),
      backgroundColor: colors.drawerSurface,
      borderRadius: scale(14),
      borderWidth: 1,
      borderColor: colors.border,
    },
    statsText: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.drawerTextMuted,
      flex: 1,
    },
  });
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
