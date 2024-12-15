import {database} from '@/database/database';
import React from 'react';
import {Button, Text, View} from 'react-native';

const Users = () => {
  const getMedicineDetails = async () => {
    const wellnessPartnerCollection = await database.get('users');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);

    console.log('mnedicine details==>', formattedPartners);
  };

  return (
    <View>
      <Button title="clik here" onPress={getMedicineDetails} />

      <Text>Users</Text>
    </View>
  );
};

export default Users;
