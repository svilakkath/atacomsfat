import { Alert } from '@/components';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type MedicineTypes = 'Capsule' | 'Injection' | 'Ointment' | 'Syrup';
type Items = {
  id: number;
  doseDetails: string;
  fullName: string;
  medicineName: string;
  medicineType: MedicineTypes;
};

const Home = () => {
  const data: Items[] = [
    {
      id: 1,
      doseDetails: '120 mg',
      fullName: 'name 1',
      medicineName: 'dolo',
      medicineType: 'Capsule',
    },
  ];

  const renderItems = ({item}: {item: Items}) => {
    return (
      // <View style={styles.itemContainer}>
      <Alert
        doseDetails={item.doseDetails}
        fullName={item.fullName}
        medicineName={item.medicineName}
        medicineType={item.medicineType}
      />

      // </View>
    );
  };

  const handleGet = async () => {
    await fetch('http://192.168.1.4:5500/api/v1/users')
      .then(res => res.json())
      .then(data => console.log(data.data.users))
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greetingText}>Hello,</Text>
        <Text style={styles.nameText}>Samadu</Text>

        <View style={{}}>
          <View style={styles.activitiesHeader}>
            <Text style={styles.activitiesTitle}>Today's activities</Text>
          </View>
          {/* <View> */}
          <FlatList
            data={data}
            renderItem={renderItems}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
          {/* <Button title="click" onPress={handleGet} /> */}
          {/* </View> */}
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  greetingText: {
    fontSize: 21,
    color: '#333333',
  },
  nameText: {
    fontSize: 24,
    color: '#2F4F4F',
    fontWeight: '500',
    marginTop: 5,
  },
  activitiesSection: {
    marginTop: 35,
  },
  activitiesHeader: {
    marginBottom: 15,
  },
  activitiesTitle: {
    fontSize: 19,
    color: '#555555',
  },
  itemSeparator: {
    width: 10,
  },
});
