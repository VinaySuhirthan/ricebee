import React from 'react';
import {View, Text, Pressable, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {radii} from '../theme/spacing';
import AppIcon from './AppIcon';
import {IconName} from '../types/common';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, style]}>
      {options.map(opt => {
        const isActive = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onChange(opt.value)}>
            {opt.icon && (
              <AppIcon
                name={opt.icon}
                size={14}
                color={isActive ? '#1F6B4F' : '#5E6661'}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F0EFEA',
    borderRadius: radii.sm, // 6px
    padding: 3,
    borderWidth: 1,
    borderColor: '#E7E4DD',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 5,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#101814',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  labelActive: {
    color: '#1F2421',
    fontWeight: '600',
  },
  labelInactive: {
    color: '#5E6661',
  },
});

export default SegmentedControl;
