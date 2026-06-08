// Global themed alert dialog — matches LexiTech light/dark UI

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { fonts } from '../constants/typography';
import { useResponsive } from '../constants/responsive';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const hideAlert = useCallback(() => setAlert(null), []);

  /**
   * Drop-in replacement for Alert.alert(title, message, buttons, options?)
   * options: { icon: string, variant: 'default' | 'danger' | 'info' }
   */
  const showAlert = useCallback((title, message, buttons, options = {}) => {
    const normalizedButtons =
      buttons?.length > 0 ? buttons : [{ text: 'OK', style: 'default' }];

    setAlert({
      title,
      message,
      buttons: normalizedButtons,
      icon: options.icon,
      variant: options.variant || 'default',
    });
  }, []);

  const handlePress = useCallback(
    (button) => {
      hideAlert();
      button?.onPress?.();
    },
    [hideAlert]
  );

  const value = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alert ? (
        <AppAlertModal alert={alert} onClose={hideAlert} onPress={handlePress} />
      ) : null}
    </AlertContext.Provider>
  );
}

function AppAlertModal({ alert, onClose, onPress }) {
  const { colors } = useTheme();
  const { scale } = useResponsive();
  const styles = useMemo(() => createStyles(scale, colors), [scale, colors]);

  const iconName =
    alert.icon ||
    (alert.variant === 'danger'
      ? 'trash-outline'
      : alert.variant === 'info'
        ? 'information-circle-outline'
        : 'alert-circle-outline');

  const iconBg =
    alert.variant === 'danger' ? colors.errorBackground : colors.cardBgElevated;

  const iconColor =
    alert.variant === 'danger' ? colors.danger : colors.secondary;

  const cancelBtn = alert.buttons.find((b) => b.style === 'cancel');
  const actionButtons = alert.buttons.filter((b) => b.style !== 'cancel');
  const primaryAction = actionButtons[actionButtons.length - 1];
  const secondaryAction = actionButtons.length > 1 ? actionButtons[0] : null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
            <Ionicons name={iconName} size={scale(28)} color={iconColor} />
          </View>

          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.message}>{alert.message}</Text>

          <View style={styles.actions}>
            {cancelBtn ? (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => onPress(cancelBtn)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>{cancelBtn.text}</Text>
              </TouchableOpacity>
            ) : null}

            {secondaryAction ? (
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => onPress(secondaryAction)}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryText}>{secondaryAction.text}</Text>
              </TouchableOpacity>
            ) : null}

            {primaryAction ? (
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  primaryAction.style === 'destructive' && styles.destructiveBtn,
                ]}
                onPress={() => onPress(primaryAction)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.primaryText,
                    primaryAction.style === 'destructive' && styles.destructiveText,
                  ]}
                >
                  {primaryAction.text}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(scale, colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scale(28),
    },
    dialog: {
      width: '100%',
      maxWidth: scale(340),
      backgroundColor: colors.cardBg,
      borderRadius: scale(22),
      paddingHorizontal: scale(24),
      paddingTop: scale(28),
      paddingBottom: scale(20),
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: scale(12) },
      shadowOpacity: 0.25,
      shadowRadius: scale(24),
      elevation: 12,
      alignItems: 'center',
    },
    iconWrap: {
      width: scale(56),
      height: scale(56),
      borderRadius: scale(28),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(16),
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontFamily: fonts.serif,
      fontSize: scale(22),
      fontWeight: '700',
      color: colors.textDark,
      textAlign: 'center',
      marginBottom: scale(10),
    },
    message: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      color: colors.textGrey,
      textAlign: 'center',
      lineHeight: scale(22),
      marginBottom: scale(24),
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
      gap: scale(10),
      width: '100%',
    },
    cancelBtn: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      borderRadius: scale(12),
      marginRight: 'auto',
    },
    cancelText: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      fontWeight: '600',
      color: colors.textGrey,
    },
    secondaryBtn: {
      paddingHorizontal: scale(18),
      paddingVertical: scale(12),
      borderRadius: scale(12),
      backgroundColor: colors.cardBgElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryText: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      fontWeight: '700',
      color: colors.textDark,
    },
    primaryBtn: {
      paddingHorizontal: scale(20),
      paddingVertical: scale(12),
      borderRadius: scale(12),
      backgroundColor: colors.secondary,
    },
    destructiveBtn: {
      backgroundColor: colors.danger,
    },
    primaryText: {
      fontFamily: fonts.sans,
      fontSize: scale(15),
      fontWeight: '700',
      color: colors.iconOnPrimary,
    },
    destructiveText: {
      color: colors.iconOnPrimary,
    },
  });
}

export function useAppAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAppAlert must be used inside AlertProvider');
  }

  return context;
}
