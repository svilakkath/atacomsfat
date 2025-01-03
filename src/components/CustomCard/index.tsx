import Text from '@/components/Text';
import React from 'react';
import {Image, View} from 'react-native';
import useStyles from './styles';

type UserCardProps = {
  mainText: string;
  subText: string | undefined;
  imageUrl?: string;
  rightComponent?: React.ReactNode;
};

const CustomCard = ({
  mainText,
  subText,
  imageUrl,
  rightComponent,
}: UserCardProps) => {
  const styles = useStyles();

  const defaultImage = 'https://via.placeholder.com/100';
  const resolvedImage =
    typeof imageUrl === 'number' ? imageUrl : {uri: imageUrl || defaultImage};

  return (
    <View style={styles.cardContainer}>
      <Image source={resolvedImage} style={styles.image} resizeMode="cover" />
      <View style={styles.detailsContainer}>
        <Text title={mainText} variant="headerSmall" color="#536872" />
        <Text
          title={subText ?? 'Medicine'}
          variant="baseFont"
          color="#708090"
        />
      </View>
      {rightComponent}
    </View>
  );
};

export default CustomCard;
