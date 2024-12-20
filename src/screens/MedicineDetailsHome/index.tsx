import {BottomSheet, CustomCard, Header, PreviewModal} from '@/components';
import {RootStackParamList} from '@/types/common';
import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MedicineDetailsProps} from '../types';
import medicineDetailsService, {dayTimeImages} from './services';

type MedicineDetailsHomeRouteProp = RouteProp<
  RootStackParamList,
  'MedicineDetailsHome'
>;

type MedicineDetailsHomeRoutePropNavigationProps = {
  navigation: NavigationProp<RootStackParamList, 'MedicineDetailsHome'>;
};

const MedicineDetailsHome = ({
  navigation,
}: MedicineDetailsHomeRoutePropNavigationProps) => {
  const route = useRoute<MedicineDetailsHomeRouteProp>();
  const {wellnessPartnerId} = route.params;

  const [medicinesList, setMedicinesList] = useState<MedicineDetailsProps[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selecteName, setSelectedName] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineDetailsProps | null>(null);

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

  const handleItemPress = (medicine: MedicineDetailsProps) => {
    setSelectedMedicine(medicine);
    setIsVisible(true);
  };

  async function handleDelete() {
    setIsModalVisible(false);
    if (selecteName && selecteName.id) {
      const result = await medicineDetailsService.deleteMedicineById(
        selecteName.id,
      );
      result.success
        ? console.log(result.message)
        : console.error(result.message);
    }
  }

  const handleClose = () => {
    setIsVisible(false);
    setSelectedMedicine(null);
  };

  const handleSettings = (item: MedicineDetailsProps) => {
    setIsModalVisible(true);
    setSelectedName({id: item.id, name: item.name});
  };

  return (
    <>
      <PreviewModal
        isVisible={isModalVisible}
        message={`Are you sure you want to delete "${selecteName?.name}"?`}
        onClose={handleDelete}
        buttonText="Delete"
        buttonStyle={styles.deleteButton}
        buttonTextStyle={styles.buttonText}
        onCancel={() => setIsModalVisible(false)}
      />

      <View style={styles.container}>
        <Header
          title="Medicine Details"
          onBackPress={() => navigation.goBack()}
          rightComponent={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddMedicineDetails', {wellnessPartnerId})
              }
              style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          }
        />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text>Loading medicine details...</Text>
          </View>
        ) : medicinesList.length > 0 ? (
          medicinesList.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item)}>
              <CustomCard
                buttonTitle="Delete"
                mainText={item.name}
                onButtonPress={() => handleSettings(item)}
                subText={item.doseDetails}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text>No medicines available</Text>
        )}
      </View>

      <BottomSheet isVisible={isVisible} onClose={handleClose}>
        {selectedMedicine ? (
          <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>{selectedMedicine.name}</Text>
            <View style={styles.sheetDetails}>
              <Text style={styles.sheetSubText}>
                {selectedMedicine.doseDetails}
              </Text>
              <Text style={styles.sheetSubText}>
                {selectedMedicine.medicineType}
              </Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.durationLabel}>
                Medicine Duration (In days)
              </Text>
              <View style={styles.durationBox}>
                <Text style={styles.durationText}>
                  {selectedMedicine.medicineDuration}
                </Text>
              </View>
            </View>
            <Text style={styles.sheetSubText}>Medicine Timings</Text>
            <View style={styles.timingsContainer}>
              {selectedMedicine.timings.map((timing, index) => (
                <View key={index} style={styles.timingItem}>
                  {dayTimeImages.map(dayTime =>
                    dayTime.timeOfDay === timing.timeOfDay ? (
                      <Image
                        source={dayTime.image}
                        resizeMode="contain"
                        key={timing.id}
                      />
                    ) : null,
                  )}
                  <Text style={styles.timingText}>{timing.timeOfDay}</Text>
                  <Text
                    style={timing.time ? styles.timingText : styles.noTimeText}>
                    {timing.time || 'No time'}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.remainingContainer}>
              <Text style={styles.remainingLabel}>Medicine Remaining</Text>
              <View style={styles.remainingBox}>
                <Text style={styles.remainingText}>
                  {selectedMedicine.remainingNumberOfMedicine ?? 'No data'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>Please wait ...</Text>
        )}
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    height: 35,
    width: 60,
    backgroundColor: '#3cb371',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContainer: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 25,
    fontWeight: '500',
  },
  sheetDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  sheetSubText: {
    fontSize: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  durationLabel: {
    fontSize: 18,
  },
  durationBox: {
    backgroundColor: '#fff',
    height: 45,
    width: 65,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  timingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  timingItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noTimeText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  remainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingLabel: {
    fontSize: 18,
  },
  remainingBox: {
    backgroundColor: '#fff',
    height: 45,
    width: 65,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default MedicineDetailsHome;
