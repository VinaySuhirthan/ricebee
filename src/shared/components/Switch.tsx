import React from 'react';
import {Pressable, View, StyleSheet, StyleProp, ViewStyle} from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  return (
    <Pressable
      style={[
        styles.track,
        value ? styles.trackActive : styles.trackInactive,
        disabled && styles.trackDisabled,
        style,
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled}}>
      <View
        style={[
          styles.thumb,
          value ? styles.thumbActive : styles.thumbInactive,
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 38,
    height: 22,
    borderRadius: 11,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
  },
  trackActive: {
    backgroundColor: '#1F6B4F',
    borderColor: '#1F6B4F',
  },
  trackInactive: {
    backgroundColor: '#E7E4DD',
    borderColor: '#D8D4CA',
  },
  trackDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  thumbActive: {
    alignSelf: 'flex-end',
  },
  thumbInactive: {
    alignSelf: 'flex-start',
  },
});

export default Switch;
