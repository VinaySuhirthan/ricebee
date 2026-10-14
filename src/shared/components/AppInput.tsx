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
  required?: boolean;
  icon?: IconName;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  suffix?: string;
}

export const AppInput: React.FC<AppInputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  required = false,
  icon,
  helperText,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  style,
  inputStyle,
  suffix,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[typography.label, styles.label]}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
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
            typography.bodySmall,
            styles.textInput,
            multiline && styles.textInputMultiline,
            inputStyle,
          ]}
        />
        {suffix && <Text style={styles.suffixText}>{suffix}</Text>}
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
    marginVertical: spacing.xxs,
  },
  label: {
    color: '#5E6661',
    marginBottom: 4,
    fontSize: 12.5,
    fontWeight: '500',
  },
  requiredStar: {
    color: '#C0392B',
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: radii.sm, // 6px
    paddingHorizontal: 12,
    height: 40,
  },
  inputWrapperFocused: {
    borderColor: '#1F6B4F',
    borderWidth: 1.5,
  },
  inputWrapperError: {
    borderColor: '#C0392B',
  },
  inputWrapperDisabled: {
    backgroundColor: '#F6F5F2',
    opacity: 0.7,
  },
  leadingIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: '#1F2421',
    fontSize: 13.5,
    height: '100%',
    paddingVertical: 0, // vertically centered
    paddingHorizontal: 0,
  },
  textInputMultiline: {
    minHeight: 70,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  suffixText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8B938E',
    marginLeft: 4,
  },
  helperText: {
    color: '#8B938E',
    marginTop: 3,
    fontSize: 11.5,
  },
  errorText: {
    color: '#C0392B',
    marginTop: 3,
    fontSize: 11.5,
  },
});

export default AppInput;
