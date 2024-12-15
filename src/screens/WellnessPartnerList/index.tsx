import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {UserCard} from '@/components';
import {useUserStore} from '@/store';
import {RootStackParamList} from '@/types/common';
import {Model} from '@nozbe/watermelondb';
import wellnessPartnerList from './services';

export type WellnessPartnerProps = {
  id: string;
  full_name: string;
  gender: string;
  phone_number: string;
  age: number;
  profile_image: string | null;
  user_id: string;
  created_at: number;
  updated_at: number;
};

type WellnessListProps = {
  navigation: NavigationProp<RootStackParamList, 'WellnessPartnerHome'>;
};

const WellnessPartnerList = ({navigation}: WellnessListProps) => {
  const {uid} = useUserStore();
  const [partners, setPartners] = useState<WellnessPartnerProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getWellnessPartnersDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWellnessPartnersDetails = async () => {
    try {
      const responseData: Model[] =
        await wellnessPartnerList.getWellnessPartnersList(uid);

      const formattedData = responseData.map((item: any) => ({
        id: item._raw.id,
        full_name: item._raw.full_name,
        gender: item._raw.gender,
        phone_number: item._raw.phone_number,
        age: item._raw.age,
        profile_image: item._raw.profile_image,
        user_id: item._raw.user_id,
        created_at: item._raw.created_at,
        updated_at: item._raw.updated_at,
      }));
      setPartners(formattedData);
    } catch (error) {
      console.error('Error fetching wellness partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlenavigation = (wellnessPartner: WellnessPartnerProps) => {
    navigation.navigate('WellnessPartnerHome', {wellnessPartner});
  };

  const renderPartner = ({item}: {item: WellnessPartnerProps}) => (
    <UserCard
      buttonTitle="Details"
      gender={item.gender}
      name={item.full_name}
      onButtonPress={() => handlenavigation(item)}
    />
  );

  return (
    <View style={styles.container}>
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
