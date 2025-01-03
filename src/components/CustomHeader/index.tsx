import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../Text';
import useStyles from './styles';

type HeaderProps = {
  title: string;
  onBackPress?: () => void;
  showBackArrow?: boolean;
  rightComponent?: React.ReactNode;
};

export default function Header({
  title,
  onBackPress,
  showBackArrow = true,
  rightComponent,
}: HeaderProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View>
        {showBackArrow ? (
          <TouchableOpacity onPress={onBackPress}>
            <Icon name="chevron-left" size={35} color="#4f666a" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View>
        <Text title={title} variant="headerSmall" color="#4f666a" />
      </View>
      <View>{rightComponent}</View>
    </View>
  );
}
