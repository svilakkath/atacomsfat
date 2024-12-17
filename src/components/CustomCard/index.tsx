import Text from '@/components/Text';
import React from 'react';
import {Button, Image, View} from 'react-native';
import useStyles from './styles';

type UserCardProps = {
  mainText: string;
  subText: string;
  imageUrl?: string;
  buttonTitle: string;
  onButtonPress: () => void;
};

const CustomCard = ({
  mainText,
  subText,
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
        <Text title={mainText} variant="displaySmall" color="primary" />
        <Text title={subText} variant="baseFont" color="primary" />
      </View>
      <Button title={buttonTitle} onPress={onButtonPress} />
    </View>
  );
};

export default CustomCard;
