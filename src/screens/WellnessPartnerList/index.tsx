import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CustomCard, Header} from '@/components';
import {useUserStore} from '@/store';
import {RootStackParamList} from '@/types/common';
import {AllWellnessPartnersDetailsProps} from '../types';
import wellnessPartnerList from './services';

type WellnessListProps = {
  navigation: NavigationProp<RootStackParamList, 'WellnessPartnerHome'>;
};

const WellnessPartnerList = ({navigation}: WellnessListProps) => {
  const {uid} = useUserStore();
  const [partners, setPartners] = useState<AllWellnessPartnersDetailsProps[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getWellnessPartnersDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWellnessPartnersDetails = async () => {
    try {
      const responseData = await wellnessPartnerList.getWellnessPartnersList(
        uid,
      );
      if (responseData) {
        setPartners(responseData);
      }
    } catch (error) {
      console.error('Error fetching wellness partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationToDetails = (
    wellnessPartner: AllWellnessPartnersDetailsProps,
  ) => {
    navigation.navigate('WellnessPartnerHome', {wellnessPartner});
  };

  // const handleNavigationToAddPartner = () => {
  //   navigation.navigate('AddWellnessPartner');
  // };

  const renderPartner = ({item}: {item: AllWellnessPartnersDetailsProps}) => (
    <CustomCard
      buttonTitle="Details"
      subText={item.gender}
      mainText={item.fullName}
      onButtonPress={() => handleNavigationToDetails(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        title="Wellness Partners List"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('AddWellnessPartner')}
            style={{
              height: 35,
              width: 60,
              backgroundColor: '#3cb371',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 13,
              // position: 'absolute',
              alignSelf: 'center',
            }}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
              Add
            </Text>
          </TouchableOpacity>
        }
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={partners}
          keyExtractor={item => item.id}
          renderItem={renderPartner}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default WellnessPartnerList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
