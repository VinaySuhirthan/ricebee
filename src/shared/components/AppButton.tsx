import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import {ButtonVariant, ButtonSize, IconName} from '../types/common';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {radii, spacing} from '../theme/spacing';
import AppIcon from './AppIcon';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const getVariantStyle = (
    pressed: boolean,
  ): {container: ViewStyle; text: TextStyle; iconColor: string} => {
    if (disabled) {
      return {
        container: {
          backgroundColor: colors.tableRowAlt,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        },
        text: {color: colors.textDisabled},
        iconColor: colors.textDisabled,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: pressed ? colors.primaryHover : colors.primary,
            borderColor: colors.primary,
          },
          text: {color: colors.white},
          iconColor: colors.white,
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: pressed ? colors.tableRowHover : colors.cardBg,
            borderColor: colors.inputBorder,
            borderWidth: 1,
          },
          text: {color: colors.textPrimary},
          iconColor: colors.textPrimary,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: pressed ? colors.primaryLight : colors.transparent,
            borderColor: colors.primary,
            borderWidth: 1,
          },
          text: {color: colors.primary},
          iconColor: colors.primary,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: pressed ? '#DC2626' : colors.danger,
            borderColor: colors.danger,
          },
          text: {color: colors.white},
          iconColor: colors.white,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: pressed ? colors.tableRowHover : colors.transparent,
            borderColor: colors.transparent,
          },
          text: {color: colors.primary},
          iconColor: colors.primary,
        };
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({pressed}) => {
        const currentVariant = getVariantStyle(pressed);
        return [
          styles.baseButton,
          isSm && styles.btnSm,
          isLg && styles.btnLg,
          currentVariant.container,
          style,
        ];
      }}>
      {({pressed}) => {
        const currentVariant = getVariantStyle(pressed);
        const iconSize = isSm ? 12 : isLg ? 18 : 14;

        return (
          <View style={styles.contentRow}>
            {icon && (
              <AppIcon
                name={icon}
                size={iconSize}
                color={currentVariant.iconColor}
                style={styles.btnIcon}
              />
            )}
            <Text
              style={[
                typography.bodyMedium,
                styles.btnText,
                isSm && styles.btnTextSm,
                isLg && styles.btnTextLg,
                currentVariant.text,
                textStyle,
              ]}>
              {title}
            </Text>
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    minHeight: 36,
  },
  btnSm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 28,
  },
  btnLg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: spacing.sm,
  },
  btnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  btnTextSm: {
    fontSize: 12,
  },
  btnTextLg: {
    fontSize: 15,
  },
});

export default AppButton;
