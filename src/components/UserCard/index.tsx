import Text from '@/components/Text';
import React from 'react';
import {Button, Image, View} from 'react-native';
import useStyles from './styles';

type UserCardProps = {
  name: string;
  gender: string;
  imageUrl?: string;
  buttonTitle: string;
  onButtonPress: () => void;
};

const CustomUserCard = ({
  name,
  gender,
  imageUrl,
  buttonTitle,
  onButtonPress,
}: UserCardProps) => {
  const styles = useStyles();

  const defaultImage = 'https://via.placeholder.com/100';
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{uri: imageUrl || defaultImage}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <Text title={name} variant="displaySmall" color="primary" />
        <Text title={gender} variant="baseFont" color="primary" />
      </View>
      <Button title={buttonTitle} onPress={onButtonPress} />
    </View>
  );
};

export default CustomUserCard;
