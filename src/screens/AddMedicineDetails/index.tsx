/* eslint-disable react-native/no-inline-styles */
import {PreviewModal, Swiper, TextInput} from '@/components';
import {useUserStore} from '@/store';
import {DayTimeValues, RootStackParamList} from '@/types/common';
import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {
  Image,
  TextInput as RnTextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AddMedicineDetailsProps} from '../types';
import medicineDetailsService, {
  dayTimes,
  MedicineTypes,
  validationRules,
} from './services';
import useStyles from './styles';

type ErrorProps = Partial<Record<keyof AddMedicineDetailsProps, string>>;
type AddMedicineResponse = {
  id?: string;
  message: string;
  success: boolean;
};
type AddMedicineDetailsRouteProp = RouteProp<
  RootStackParamList,
  'AddMedicineDetails'
>;
type AddMedicineDetailsNavigationProps = {
  navigation: NavigationProp<RootStackParamList, 'AddMedicineDetails'>;
};
export default function AddMedicineDetails({
  navigation,
}: AddMedicineDetailsNavigationProps) {
  const route = useRoute<AddMedicineDetailsRouteProp>();
  const {wellnessPartnerId} = route.params;
  console.log(wellnessPartnerId);

  const styles = useStyles();
  const {uid} = useUserStore();
  const swiperRef = useRef<any>(null);
  const [submit, setSubmit] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [errors, setErrors] = useState<ErrorProps>({});
  const [form, setForm] = useState<AddMedicineDetailsProps>({
    name: '',
    doseDetails: '',
    medicineType: '',
    medicineDuration: '',
    additionalNote: '',
    remainingNumberOfMedicine: '',
    timeOfDay: [],
    dayTimeValues: {},
  });
  const [selectedType, setSelectedType] = useState<string | null>();
  const [response, setResponse] = useState<AddMedicineResponse | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (
    field: keyof AddMedicineDetailsProps,
    value: string,
  ) => {
    setForm(prevForm => ({...prevForm, [field]: value}));

    // Clear error when input is valid
    if (validationRules[field]?.required && value) {
      setErrors(prevErrors => ({...prevErrors, [field]: ''}));
    }
  };

  const handleTimeInputChange = (timeOfDay: DayTimeValues, value: string) => {
    if (value.length <= 5) {
      if (value.length === 2 && !value.includes(':')) {
        value = value + ':';
      }
      if (value.length > 2 && !value.includes(':') && value.length === 3) {
        value = value.slice(0, 2) + ':' + value.slice(2);
      }

      setForm(prevForm => {
        const updatedDayTimeValues = {
          ...prevForm.dayTimeValues,
          [timeOfDay]: value,
        };
        return {...prevForm, dayTimeValues: updatedDayTimeValues};
      });
    }
  };

  const handleSelectTimeOfDay = (value: DayTimeValues) => {
    setForm(prevForm => {
      const {timeOfDay, dayTimeValues} = prevForm;

      let updatedTimeOfDay;
      if (timeOfDay.includes(value)) {
        updatedTimeOfDay = timeOfDay.filter(item => item !== value);
      } else {
        updatedTimeOfDay = [...timeOfDay, value];
      }

      const updatedDayTimeValues = {
        ...dayTimeValues,
        [value]: timeOfDay.includes(value) ? '' : dayTimeValues[value] || '',
      };

      if (updatedTimeOfDay.length > 0) {
        setErrors(prevErrors => ({...prevErrors, timeOfDay: ''}));
      }

      return {
        ...prevForm,
        timeOfDay: updatedTimeOfDay,
        dayTimeValues: updatedDayTimeValues,
      };
    });
  };

  const handleTimeFormatChange = (
    timeOfDay: DayTimeValues,
    format: 'AM' | 'PM',
  ) => {
    const time = (form.dayTimeValues[timeOfDay] || '').split(' ')[0];
    if (time) {
      console.log('====>', time);
      setForm(prevForm => ({
        ...prevForm,
        dayTimeValues: {
          ...prevForm.dayTimeValues,
          [timeOfDay]: time + ' ' + format,
        },
      }));
    }
  };

  const handleSelect = (type: string) => {
    if (type === selectedType) {
      setSelectedType(null);
      return;
    }
    handleInputChange('medicineType', type);
    setSelectedType(type);
  };

  const goToNextPage = () => {
    setSubmit(true);
    const isValid = validateCurrentPage();

    if (!isValid) {
      return;
    }

    if (swiperRef.current && currentPage < 1) {
      swiperRef.current.goToPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    } else if (currentPage === 1) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log('submitted==>');
    const isValid = validateCurrentPage();

    if (!isValid) {
      return;
    }
    addMedicinDetails();
  };

  const goToPreviousPage = () => {
    if (swiperRef.current && currentPage > 0) {
      swiperRef.current.goToPage(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const sanitizeForm = () => {
    const sanitizedTimeInputs = Object.fromEntries(
      Object.entries(form.dayTimeValues).filter(([timeOfDay, _]) =>
        form.timeOfDay.includes(timeOfDay as DayTimeValues),
      ),
    );
    return {
      ...form,
      dayTimeValues: sanitizedTimeInputs,
    };
  };

  const addMedicinDetails = async () => {
    sanitizeForm();
    try {
      // setIsLoading(true);
      const response = await medicineDetailsService.addMedicineDetails(
        form,
        uid,
        wellnessPartnerId,
      );
      setResponse(response);
      setIsVisible(true);
    } catch (error) {
      console.error('Error adding  medicine details:', error);
    } finally {
      // setIsLoading(false);
    }
  };

  const validateCurrentPage = useCallback(() => {
    const newErrors: ErrorProps = {};
    if (currentPage === 0) {
      ['name', 'doseDetails', 'medicineType', 'medicineDuration'].forEach(
        field => {
          if (
            validationRules[field as keyof AddMedicineDetailsProps].required &&
            !form[field as keyof AddMedicineDetailsProps]
          ) {
            newErrors[field as keyof AddMedicineDetailsProps] =
              validationRules[field as keyof AddMedicineDetailsProps].message ||
              'Required.';
          }
        },
      );
    } else if (currentPage === 1) {
      ['additionalNote', 'remainingNumberOfMedicine', 'timeOfDay'].forEach(
        field => {
          if (
            validationRules[field as keyof AddMedicineDetailsProps].required
          ) {
            const value = form[field as keyof AddMedicineDetailsProps];
            if (
              (field === 'timeOfDay' &&
                Array.isArray(value) &&
                value.length === 0) ||
              (!Array.isArray(value) && !value)
            ) {
              newErrors[field as keyof AddMedicineDetailsProps] =
                validationRules[field as keyof AddMedicineDetailsProps]
                  .message || 'Required.';
            }
          }
        },
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentPage, form]);
  const handleClose = () => {
    setIsVisible(false);
    if (response?.success) {
      navigation.navigate('WellnessPartnerList');
    }
  };

  return (
    <>
      {isVisible && (
        <PreviewModal
          isVisible={isVisible}
          message={response?.message}
          onClose={handleClose}
          buttonText={response?.success ? 'Continue' : 'Close'}
          buttonStyle={
            response?.success ? styles.successButton : styles.failButton
          }
        />
      )}
      <View style={styles.container}>
        <Swiper
          isScrollable={false}
          ref={swiperRef}
          onPageChanged={(pageIndex: number) => setCurrentPage(pageIndex)}>
          <View style={styles.firstScreen}>
            <Text style={styles.label}>Medicine Name</Text>
            <TextInput
              value={form.name}
              onChangeText={value => handleInputChange('name', value)}
              placeHolder="Enter medicine name"
              left="pill"
            />
            {submit && errors.name && (
              <Text
                style={{
                  color: '#ff6347',
                  position: 'absolute',
                  top: 10,
                  right: 50,
                }}>
                {errors.name}
              </Text>
            )}

            <Text style={styles.label}>Dose Details</Text>
            <TextInput
              value={form.doseDetails}
              onChangeText={value => handleInputChange('doseDetails', value)}
              placeHolder="Enter dose details"
              left="move-resize"
            />
            {submit && errors.doseDetails && (
              <Text
                style={{
                  color: '#ff6347',
                  position: 'absolute',
                  top: 122,
                  right: 50,
                }}>
                {errors.doseDetails}
              </Text>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: 53,
                paddingBottom: 15,
              }}>
              <Text
                style={{
                  position: 'absolute',
                  fontSize: 16,
                  color: '#333',
                  marginTop: 18,
                  gap: 15,
                  fontFamily: 'san-serif',
                }}>
                Medicine Type
              </Text>

              {MedicineTypes.map(item => (
                <TouchableOpacity
                  key={item.name}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    backgroundColor:
                      selectedType === item.name ? '#389EBA' : '#f5f5f5',
                    width: 75,
                    height: 93,
                    marginHorizontal: 2,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 4},
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                    elevation: 5,
                    gap: 10,
                  }}
                  onPress={() => handleSelect(item.name)}>
                  <Image
                    source={
                      selectedType === item.name
                        ? item.highlightedImage
                        : item.normalImage
                    }
                    style={{
                      width: 40,
                      height: 25,
                      marginBottom: 2,
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: 'center',
                      color: selectedType === item.name ? '#fff' : '#333',
                      fontWeight:
                        selectedType === item.name ? 'bold' : 'normal',
                      fontFamily: 'san-serif',
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{marginRight: '38%', gap: 12}}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#333',
                  marginTop: 18,
                  fontFamily: 'san-serif',
                }}>
                Medicine Duration (in days)
              </Text>
              <TextInput
                value={form.medicineDuration}
                onChangeText={value =>
                  handleInputChange('medicineDuration', value)
                }
                placeHolder="Enter duration in days"
                left="car-speed-limiter"
              />
              {errors.medicineDuration && (
                <Text style={styles.errorText}>{errors.medicineDuration}</Text>
              )}
            </View>
          </View>

          <View style={styles.secondScreen}>
            <View style={{}}>
              <Text style={styles.label}>Additional Note</Text>
              <TextInput
                value={form.additionalNote}
                onChangeText={value =>
                  handleInputChange('additionalNote', value)
                }
                placeHolder="Enter additional note (optional)"
                left="text"
              />
              {submit && errors.additionalNote && (
                <Text style={styles.errorText}>{errors.additionalNote}</Text>
              )}
            </View>

            <View style={{marginTop: 9, marginBottom: 7}}>
              <Text style={styles.label}>Remaining Number of Medicine</Text>
              <TextInput
                value={form.remainingNumberOfMedicine}
                onChangeText={value =>
                  handleInputChange('remainingNumberOfMedicine', value)
                }
                placeHolder="Enter remaining number (optional)"
                left="minus-circle-outline"
              />
              {errors.remainingNumberOfMedicine && (
                <Text style={styles.errorText}>
                  {errors.remainingNumberOfMedicine}
                </Text>
              )}
            </View>
            <Text style={styles.label}>Time of Day</Text>
            {submit && errors.timeOfDay && (
              <Text style={styles.errorText}>{errors.timeOfDay}</Text>
            )}
            {dayTimes.map(time => (
              <View key={time} style={styles.timeOfDayRow}>
                <TouchableOpacity
                  style={[
                    styles.dayTimeButton,
                    form.timeOfDay.includes(time) &&
                      styles.selectedDayTimeButton,
                  ]}
                  onPress={() => handleSelectTimeOfDay(time)}>
                  <Text
                    style={[
                      styles.timeText,
                      form.timeOfDay.includes(time) && styles.selectedTimeText,
                    ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
                {form.timeOfDay.includes(time) && (
                  <>
                    <View style={styles.timeValue}>
                      <RnTextInput
                        value={(form.dayTimeValues[time] || '').split(' ')[0]}
                        onChangeText={value =>
                          handleTimeInputChange(time, value)
                        }
                        placeholder="hh:mm"
                        keyboardType="numeric"
                        maxLength={5}
                        style={{textAlign: 'center'}}
                      />
                    </View>
                    <View style={styles.formatContainer}>
                      <TouchableOpacity
                        style={[
                          styles.formatButton,
                          (form.dayTimeValues[time] || '').endsWith('AM') &&
                            styles.selectedFormatButton,
                        ]}
                        onPress={() => handleTimeFormatChange(time, 'AM')}>
                        <Text
                          style={[
                            styles.formatText,
                            (form.dayTimeValues[time] || '').endsWith('AM') &&
                              styles.selectedFormatText,
                          ]}>
                          AM
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.formatButton,
                          (form.dayTimeValues[time] || '').endsWith('PM') &&
                            styles.selectedFormatButton,
                        ]}
                        onPress={() => handleTimeFormatChange(time, 'PM')}>
                        <Text
                          style={[
                            styles.formatText,
                            (form.dayTimeValues[time] || '').endsWith('PM') &&
                              styles.selectedFormatText,
                          ]}>
                          PM
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        </Swiper>

        {currentPage > 0 && (
          <TouchableOpacity
            onPress={goToPreviousPage}
            style={styles.backButton}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
              Back
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={currentPage === 1 ? styles.submitButton : styles.nextButton}
          onPress={goToNextPage}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
            {currentPage === 1 ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
