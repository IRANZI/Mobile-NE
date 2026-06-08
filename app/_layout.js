// Root layout with drawer navigation and custom styling

import React, { useEffect, useMemo, useState } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DictionaryProvider, useDictionary } from '../context/DictionaryContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';
import AppSplash from '../components/AppSplash';

SplashScreen.preventAutoHideAsync().catch(() => {});

function CustomDrawerContent(props) {
  const router = useRouter();
  const { searchHistory, searchWord, loading, wordData, removeFromHistory } = useDictionary();
  const { colors } = useTheme();
  const { scale, drawerWidth } = useResponsive();
  const styles = useMemo(() => createDrawerStyles(scale, colors), [scale, colors]);

  const handleHistoryPress = (word) => {
    props.navigation.closeDrawer();
    router.push('/');
    searchWord(word);
  };

  const handleRemoveHistory = (word) => {
    removeFromHistory(word);
  };

  const activeWord = wordData?.word?.toLowerCase();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerScroll}
      style={[styles.drawerContainer, { width: drawerWidth }]}
    >
      <View style={styles.drawerHeader}>
        <View style={styles.accentDecor} />
        <View style={[styles.logoBox, { width: scale(48), height: scale(48) }]}>
          <Ionicons name="book" size={scale(26)} color={colors.iconOnPrimary} />
        </View>
        <Text style={styles.drawerTitle}>LexiTech</Text>
        <Text style={styles.drawerSubtitle}>Dictionary App</Text>
        <Text style={styles.companyName}>LexiTech Solutions Ltd</Text>
      </View>

      <View style={styles.navSection}>
        <Text style={styles.sectionLabel}>Navigation</Text>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.historySection}>
        <Text style={styles.sectionLabel}>
          Recent Searches {searchHistory.length > 0 ? `(${searchHistory.length})` : ''}
        </Text>

        {searchHistory.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Ionicons name="search-outline" size={scale(22)} color={colors.drawerTextMuted} />
            <Text style={styles.emptyHistoryText}>No searches yet</Text>
          </View>
        ) : (
          searchHistory.map((word, index) => {
            const isActive = activeWord === word.toLowerCase();

            return (
              <View
                key={`${word}-${index}`}
                style={[styles.historyItem, isActive && styles.historyItemActive]}
              >
                <TouchableOpacity
                  style={styles.historyItemMain}
                  onPress={() => handleHistoryPress(word)}
                  disabled={loading}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={isActive ? 'book' : 'text-outline'}
                    size={scale(18)}
                    color={isActive ? colors.iconOnPrimary : colors.secondary}
                  />
                  <Text
                    style={[styles.historyWord, isActive && styles.historyWordActive]}
                    numberOfLines={1}
                  >
                    {word}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemoveHistory(word)}
                  style={styles.historyRemoveBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={`Remove ${word} from history`}
                >
                  <Ionicons name="close-circle" size={scale(20)} color={colors.drawerTextMuted} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </DrawerContentScrollView>
  );
}

function RootLayoutNav() {
  const { colors } = useTheme();
  const { scale, drawerWidth } = useResponsive();

  const screenOptions = useMemo(
    () => ({
      drawerActiveTintColor: colors.iconOnPrimary,
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
      headerTintColor: colors.heroText,
      headerTitleStyle: {
        fontFamily: fonts.sans,
        fontWeight: '800',
        fontSize: scale(18),
      },
      sceneContainerStyle: {
        backgroundColor: colors.background,
      },
    }),
    [colors, scale, drawerWidth]
  );

  return (
    <>
      <StatusBar style={colors.statusBar} />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={screenOptions}
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
      <ThemeProvider>
        <DictionaryProvider>
          <RootLayoutNav />
        </DictionaryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function createDrawerStyles(scale, colors) {
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
    historySection: {
      marginTop: scale(4),
      paddingHorizontal: scale(12),
      paddingBottom: scale(16),
    },
    emptyHistory: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      marginHorizontal: scale(4),
      padding: scale(16),
      backgroundColor: colors.drawerSurface,
      borderRadius: scale(14),
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyHistoryText: {
      fontFamily: fonts.sans,
      fontSize: scale(14),
      color: colors.drawerTextMuted,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scale(6),
      borderRadius: scale(12),
      backgroundColor: colors.drawerSurface,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    historyItemMain: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(10),
      paddingVertical: scale(12),
      paddingLeft: scale(14),
      paddingRight: scale(8),
    },
    historyRemoveBtn: {
      paddingVertical: scale(12),
      paddingRight: scale(14),
      paddingLeft: scale(4),
    },
    historyItemActive: {
      backgroundColor: colors.secondary + '44',
      borderColor: colors.secondary,
    },
    historyWord: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: scale(15),
      fontWeight: '600',
      color: colors.drawerText,
      textTransform: 'capitalize',
    },
    historyWordActive: {
      fontWeight: '800',
    },
  });
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
