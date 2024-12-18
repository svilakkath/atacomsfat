import {BottomSheet, CustomCard, Header} from '@/components';
import {RootStackParamList} from '@/types/common';
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {MedicineDetailsProps} from '../types';
import medicineDetailsService from './services';

type WellnessPartnerHomeRouteProp = RouteProp<
  RootStackParamList,
  'MedicineDetailsHome'
>;

const MedicineDetailsHome = ({navigation}) => {
  const route = useRoute<WellnessPartnerHomeRouteProp>();
  // const title = options?.title;
  const {wellnessPartnerId} = route.params;

  const [medicinesList, setMedicinesList] = useState<MedicineDetailsProps[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false);
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

  const handleClose = () => {
    setIsVisible(false);
    setSelectedMedicine(null);
  };

  const dayTimeImages = [
    {
      timeOfDay: 'Morning',
      image: require('@/assets/images/DayTimes/morning.png'),
    },
    {
      timeOfDay: 'Afternoon',
      image: require('@/assets/images/DayTimes/afternoon.png'),
    },
    {
      timeOfDay: 'Evening',
      image: require('@/assets/images/DayTimes/evening.png'),
    },
    {timeOfDay: 'Night', image: require('@/assets/images/DayTimes/night.png')},
  ];

  return (
    <>
      <View style={styles.container}>
        <Header
          title={'Medicine Details'}
          onBackPress={() => navigation.goBack()}
        />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text>Loading medicine details...</Text>
          </View>
        ) : medicinesList.length > 0 ? (
          medicinesList.map(item => (
            <CustomCard
              key={item.id}
              buttonTitle="Details"
              mainText={item.name}
              onButtonPress={() => handleItemPress(item)}
              subText={item.doseDetails}
            />
          ))
        ) : (
          <Text>No Medicines Found</Text>
        )}
      </View>
      <BottomSheet isVisible={isVisible} onClose={handleClose}>
        {selectedMedicine ? (
          <View style={{padding: 20}}>
            <View style={{marginBottom: 15}}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: '500',
                  fontFamily: 'san-serif',
                }}>
                {selectedMedicine.name}
              </Text>
              <View style={{flexDirection: 'row', gap: 20}}>
                <View>
                  <Text style={{fontSize: 16, fontFamily: 'san-serif'}}>
                    {selectedMedicine.doseDetails}
                  </Text>
                </View>
                <View>
                  <Text style={{fontSize: 16, fontFamily: 'san-serif'}}>
                    {selectedMedicine.medicineType}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <View>
                <Text style={{fontSize: 18, fontFamily: 'san-serif'}}>
                  Medicine Duration (In days)
                </Text>
              </View>
              <View
                style={{
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
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: '500',
                  }}>
                  {selectedMedicine.medicineDuration}
                </Text>
              </View>
            </View>
            <Text style={{fontSize: 18, fontFamily: 'san-serif'}}>
              Medicine Timings
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              {selectedMedicine.timings.map((timing, index) => (
                <View
                  key={index}
                  style={{alignItems: 'center', justifyContent: 'center'}}>
                  {/* <View> */}
                  {dayTimeImages.map(dayTime =>
                    dayTime.timeOfDay === timing.timeOfDay ? (
                      <Image source={dayTime.image} resizeMode="contain" />
                    ) : (
                      ''
                    ),
                  )}
                  <View>
                    <Text
                      style={{
                        fontFamily: 'san-serif',
                        fontSize: 16,
                        textAlign: 'center',
                      }}>
                      {timing.timeOfDay}
                    </Text>
                    {timing.time ? (
                      <Text
                        style={{
                          fontFamily: 'san-serif',
                          fontSize: 15,
                          textAlign: 'center',
                        }}>
                        {timing.time || 'No time'}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: 'san-serif',
                          fontSize: 14,
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        {'No time'}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{fontSize: 18, fontFamily: 'san-serif'}}>
                  Medicine Remaining
                </Text>
              </View>
              <View
                style={{
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
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: '500',
                  }}>
                  {selectedMedicine.remainingNumberOfMedicine ?? 'NO data'}
                </Text>
              </View>
            </View>
            {/* <Text>Additional Note: {selectedMedicine.additionalNote}</Text> */}
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
  sheetHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sheetSubHeader: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicineDetailsHome;
