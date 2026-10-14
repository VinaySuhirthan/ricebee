import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import {IconName} from '../types/common';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {radii, spacing} from '../theme/spacing';
import AppIcon from './AppIcon';

export interface AppInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  icon?: IconName;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const AppInput: React.FC<AppInputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  icon,
  helperText,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[typography.captionMedium, styles.label]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : null,
          disabled ? styles.inputWrapperDisabled : null,
        ]}>
        {icon && (
          <AppIcon
            name={icon}
            size={14}
            color={isFocused ? colors.primary : colors.textMuted}
            style={styles.leadingIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            typography.body,
            styles.textInput,
            multiline && styles.textInputMultiline,
            inputStyle,
          ]}
        />
      </View>
      {error ? (
        <Text style={[typography.caption, styles.errorText]}>{error}</Text>
      ) : helperText ? (
        <Text style={[typography.caption, styles.helperText]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    minHeight: 38,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: '#0F1A30',
  },
  inputWrapperError: {
    borderColor: colors.danger,
  },
  inputWrapperDisabled: {
    backgroundColor: '#1E293B',
    opacity: 0.6,
  },
  leadingIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
    fontSize: 13,
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    color: colors.textMuted,
    marginTop: 4,
  },
  errorText: {
    color: colors.danger,
    marginTop: 4,
  },
});

export default AppInput;
