import React from 'react';
import {View, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {IconName} from '../types/common';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, radii} from '../theme/spacing';
import AppIcon from './AppIcon';
import AppButton from './AppButton';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconName;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'search',
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <AppIcon name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={[typography.h3, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.description]}>{description}</Text>
      {actionTitle && onAction && (
        <AppButton
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="sm"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 28, 49, 0.4)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(30, 47, 77, 0.6)',
    borderStyle: 'dashed',
    marginVertical: spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 420,
    lineHeight: 20,
  },
  actionBtn: {
    marginTop: spacing.lg,
  },
});

export default EmptyState;
