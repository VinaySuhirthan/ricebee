import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NavSectionConfig, RouteKey} from '../navigation/navigationTypes';
import {colors} from '../shared/theme/colors';
import {typography} from '../shared/theme/typography';
import {radii, spacing} from '../shared/theme/spacing';
import AppIcon from '../shared/components/AppIcon';

interface SidebarSectionProps {
  section: NavSectionConfig;
  currentRoute: RouteKey;
  onSelectRoute: (key: RouteKey) => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  currentRoute,
  onSelectRoute,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[typography.sectionHeading, styles.sectionTitle]}>
        {section.title}
      </Text>
      <View style={styles.itemsList}>
        {section.items.map(item => {
          const isActive = currentRoute === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => onSelectRoute(item.key)}
              accessibilityRole="tab"
              accessibilityState={{selected: isActive}}
              style={({pressed}) => [
                styles.navItem,
                isActive && styles.navItemActive,
                pressed && !isActive && styles.navItemPressed,
              ]}>
              <View style={styles.itemLeft}>
                {isActive && <View style={styles.activeIndicator} />}
                <AppIcon
                  name={item.icon}
                  size={15}
                  color={
                    isActive ? colors.sidebarTextActive : colors.sidebarText
                  }
                  style={styles.itemIcon}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    typography.bodyMedium,
                    styles.itemLabel,
                    isActive
                      ? styles.itemLabelActive
                      : styles.itemLabelInactive,
                  ]}>
                  {item.label}
                </Text>
              </View>

              {item.badge !== undefined && (
                <View
                  style={[
                    styles.badge,
                    item.badgeVariant === 'info'
                      ? styles.badgeInfo
                      : styles.badgeDanger,
                  ]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.sidebarSection,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginBottom: 4,
  },
  itemsList: {
    paddingHorizontal: spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    marginVertical: 1,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: colors.sidebarActive,
  },
  navItemPressed: {
    backgroundColor: colors.sidebarHover,
  },
  activeIndicator: {
    position: 'absolute',
    left: -spacing.md,
    top: 6,
    bottom: 6,
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  itemIcon: {
    marginRight: spacing.md,
  },
  itemLabel: {
    fontSize: 13,
  },
  itemLabelActive: {
    color: colors.sidebarTextActive,
    fontWeight: '600',
  },
  itemLabelInactive: {
    color: colors.sidebarText,
    fontWeight: '400',
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: radii.full,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDanger: {
    backgroundColor: colors.danger,
  },
  badgeInfo: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default SidebarSection;
