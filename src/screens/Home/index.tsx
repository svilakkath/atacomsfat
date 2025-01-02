import {database} from '@/database/database';
import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

const Home = () => {
  const deleteWellnessPartnerById = async () => {
    try {
      await database.write(async () => {
        const wellnessPartnerCollection = database.get('wellness_partners');
        const partner = await wellnessPartnerCollection.find(
          'tmQTCkFzIjMWZgT9',
        );

        if (partner) {
          await partner.destroyPermanently();
          console.log(
            `Wellness partner with ID ${'wkoDL1r8udPFKu9v'} has been deleted.`,
          );
        } else {
          console.log(
            `No wellness partner found with ID ${'wkoDL1r8udPFKu9v'}.`,
          );
        }
      });
    } catch (error) {
      console.error(
        `Error deleting wellness partner with ID ${'wkoDL1r8udPFKu9v'}:`,
        error,
      );
      throw error;
    }
  };

  const getWellnessPartnerById = async () => {
    const wellnessPartnerCollection = await database.get('medicine_timings');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);

    console.log('mnedicine details==>', formattedPartners);
  };

  return (
    <View style={styles.container}>
      <Button title="delete" onPress={deleteWellnessPartnerById} />
      <Button title="get" onPress={getWellnessPartnerById} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdcdc',
    // opacity: 0.5,
  },
  blurBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
});
