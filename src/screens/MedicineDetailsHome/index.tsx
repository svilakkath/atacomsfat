import {RootStackParamList} from '@/types/common';
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MedicineDetailsProps} from '../types';
import medicineDetailsService from './services';

type WellnessPartnerHomeRouteProp = RouteProp<
  RootStackParamList,
  'MedicineDetailsHome'
>;

const MedicineDetailsHome = () => {
  const route = useRoute<WellnessPartnerHomeRouteProp>();
  const {wellnessPartnerId} = route.params;
  const [medicinesList, setMedicinesList] = useState<MedicineDetailsProps[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getMedicineDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getMedicineDetails() {
    try {
      setLoading(true);
      const responseData =
        await medicineDetailsService.getAllMedicineDetailsById(
          wellnessPartnerId,
        );

      setMedicinesList(responseData);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setLoading(false);
    }
  }

  const renderMedicineItem = ({item}: {item: MedicineDetailsProps}) => (
    <View style={styles.card}>
      <Text style={styles.title}>Name: {item.name}</Text>
      <Text>Dose: {item.doseDetails}</Text>
      <Text>Type: {item.medicineType}</Text>
      <Text>Duration: {item.medicineDuration} days</Text>
      <Text>Remaining: {item.remainingNumberOfMedicine}</Text>
      <Text>Additional Note: {item.additionalNote}</Text>
      <Text style={styles.subtitle}>Timings:</Text>
      {item.timings.map((timing, index) => (
        <Text key={index}>
          - {timing.time} ({timing.timeOfDay})
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medicine Details</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text>Loading medicine details...</Text>
        </View>
      ) : medicinesList.length > 0 ? (
        <FlatList
          data={medicinesList}
          keyExtractor={item => item.id}
          renderItem={renderMedicineItem}
        />
      ) : (
        <Text>No Medicines Found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicineDetailsHome;
