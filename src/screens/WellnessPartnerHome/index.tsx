import {Header} from '@/components';
import {RootStackParamList} from '@/types/common';
import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ModulesProps} from '../types';

type WellnessPartnerHomeRouteProp = RouteProp<
  RootStackParamList,
  'WellnessPartnerHome'
>;

type WellnessHomeProps = {
  navigation: NavigationProp<RootStackParamList, 'MedicineDetailsHome'>;
};
const WellnessPartnerHome = ({navigation}: WellnessHomeProps) => {
  const route = useRoute<WellnessPartnerHomeRouteProp>();
  const {wellnessPartner} = route.params;

  const wellnessPartnerId = wellnessPartner.id;

  const data = [
    {id: 0, title: 'Medicines'},
    {id: 1, title: 'Profile'},
  ];
  const handlePress = (item: ModulesProps) => {
    switch (item.title) {
      case 'Medicines':
        navigation.navigate('MedicineDetailsHome', {wellnessPartnerId});
        break;
      case 'Profile':
        navigation.navigate('WellnessPartnerProfile', {wellnessPartnerId});
        break;
    }
  };

  const renderCard = ({item}: any) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>Image Icon</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{padding: 16}}>
      <Header
        title={'Wellness Partner Home'}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

export default WellnessPartnerHome;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow for iOS
    shadowOpacity: 0.2, // Shadow for iOS
    shadowRadius: 4, // Shadow for iOS
    width: '45%', // 45% width for two cards per row
    margin: 10, // Spacing between cards
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    color: '#aaa',
  },
  textContainer: {
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
