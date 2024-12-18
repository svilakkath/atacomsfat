import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

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

  const handlenavigation = (
    wellnessPartner: AllWellnessPartnersDetailsProps,
  ) => {
    navigation.navigate('WellnessPartnerHome', {wellnessPartner});
  };

  const renderPartner = ({item}: {item: AllWellnessPartnersDetailsProps}) => (
    <CustomCard
      buttonTitle="Details"
      subText={item.gender}
      mainText={item.fullName}
      onButtonPress={() => handlenavigation(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        title={'Wellness Partners List'}
        onBackPress={() => navigation.goBack()}
      />
      {loading ? (
        <View>
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
});
