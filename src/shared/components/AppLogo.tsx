import React from 'react';
import {Image, View, StyleSheet} from 'react-native';

interface AppLogoProps {
  size?: number;
}

// Place your logo file at: src/assets/logo.png
// Then this component will automatically render it.
const logo = require('../../assets/logo.png');

export const AppLogo: React.FC<AppLogoProps> = ({size = 32}) => {
  return (
    <View style={[styles.wrapper, {width: size, height: size}]}>
      <Image
        source={logo}
        style={{width: size, height: size}}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppLogo;
