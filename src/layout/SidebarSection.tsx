import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {NavSectionConfig, RouteKey} from '../navigation/navigationTypes';
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
          const isUrgent = item.key === 'notifications' || item.key === 'returns';
          const isTag = typeof item.badge === 'string';

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
              {/* 3px Left Accent Bar on Active item */}
              {isActive && <View style={styles.activeBar} />}

              <View style={styles.itemLeft}>
                <AppIcon
                  name={item.icon}
                  size={16}
                  color={isActive ? '#1F6B4F' : '#5E6661'}
                  style={styles.itemIcon}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.itemLabel,
                    isActive
                      ? styles.itemLabelActive
                      : styles.itemLabelInactive,
                  ]}>
                  {item.label}
                </Text>
              </View>

              {/* Badges & Tags: Quiet outlined chips or neutral count */}
              {item.badge !== undefined && (
                isTag ? (
                  <View style={styles.quietTag}>
                    <Text style={styles.quietTagText}>{item.badge}</Text>
                  </View>
                ) : isUrgent ? (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>{item.badge}</Text>
                  </View>
                ) : (
                  <Text style={styles.neutralCountText}>{item.badge}</Text>
                )
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
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: '#8B938E',
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    marginBottom: 4,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  itemsList: {
    paddingHorizontal: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    marginVertical: 1,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: '#E8F3EE', // Soft green tinted background
  },
  navItemPressed: {
    backgroundColor: '#F6F5F2',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3,
    backgroundColor: '#1F6B4F', // 3px left deep green accent bar
    borderRadius: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.xs,
  },
  itemIcon: {
    marginRight: 10,
  },
  itemLabel: {
    fontSize: 13,
  },
  itemLabelActive: {
    color: '#1F2421',
    fontWeight: '600',
  },
  itemLabelInactive: {
    color: '#5E6661',
    fontWeight: '400',
  },
  quietTag: {
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    backgroundColor: '#FAF9F6',
  },
  quietTagText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#5E6661',
    letterSpacing: 0.4,
  },
  urgentBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F9ECEB',
    borderWidth: 1,
    borderColor: '#F0C5C1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  urgentBadgeText: {
    color: '#C0392B',
    fontSize: 9.5,
    fontWeight: '600',
  },
  neutralCountText: {
    fontSize: 11,
    color: '#8B938E',
    fontWeight: '500',
  },
});

export default SidebarSection;
