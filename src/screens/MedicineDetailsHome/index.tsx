import {RootStackParamList} from '@/types/common';
import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';

type WellnessPartnerHomeRouteProp = RouteProp<
  RootStackParamList,
  'MedicineDetailsHome'
>;
const MedicineDetailsHome = () => {
  const route = useRoute<WellnessPartnerHomeRouteProp>();
  const {wellnessPartnerId} = route.params;
  console.log('wellnessPartnerId==>', wellnessPartnerId);

  return (
    <View>
      <Text>MedicineDetailsHome</Text>
    </View>
  );
};

export default MedicineDetailsHome;

// const styles = StyleSheet.create({});
