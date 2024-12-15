import {Swiper, TextInput} from '@/components';
import {database} from '@/database/database';
import MedicineDetails from '@/database/models/medicineDetails';
import MedicineTiming from '@/database/models/medicineTiming';
import {Q} from '@nozbe/watermelondb';
import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  TextInput as RnTextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useStyles from './AddMedicineDetails/styles';

export type DayTimeValues = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

type MedicineFormState = {
  name: string;
  doseDetails: string;
  medicineType: string;
  medicineDuration: string;
  additionalNote: string;
  remainingNumberOfMedicine: string;
  timeOfDay: DayTimeValues[];
  dayTimeValues: Record<string, string>;
};

type ValidationRule = {
  required?: boolean;
  validate?: (value: string) => boolean;
  message?: string;
};

type ErrorProps = Partial<Record<keyof MedicineFormState, string>>;
const validationRules: Record<keyof MedicineFormState, ValidationRule> = {
  name: {
    required: true,
    message: 'Medicine name is required.',
  },
  doseDetails: {
    required: true,
    message: 'Dose details are required.',
  },
  medicineType: {
    required: false,
  },
  medicineDuration: {
    required: false,
    // validate: value => /^\d+$/.test(value) && parseInt(value, 10) > 0,
    message: 'Duration must be a positive number (in days).',
  },
  additionalNote: {
    required: false,
  },
  remainingNumberOfMedicine: {
    required: false,
    validate: value => !value || /^\d+$/.test(value),
    message: 'Remaining medicine count must be a valid number.',
  },
  timeOfDay: {
    required: true,
    validate: value => value.length > 0,
    message: 'Select at least one time of day.',
  },
  dayTimeValues: {
    required: false,
    validate: value => {
      const timesValid = Object.values(value).every(
        time => !time || /^([01]\d|2[0-3]):([0-5]\d)\s(AM|PM)$/.test(time),
      );
      return timesValid;
    },
    message: 'Time values must be valid 12-hour format (e.g., 08:00 AM).',
  },
};

export default function TestScreen() {
  const styles = useStyles();
  const swiperRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [form, setForm] = useState<MedicineFormState>({
    name: '',
    doseDetails: '',
    medicineType: '',
    medicineDuration: '',
    additionalNote: '',
    remainingNumberOfMedicine: '',
    timeOfDay: [],
    dayTimeValues: {},
  });
  const [errors, setErrors] = useState<ErrorProps>({});
  const [submit, setSubmit] = useState(false);

  const addMedicinDetails = async () => {
    sanitizeForm();
    const {
      name,
      doseDetails,
      medicineType,
      medicineDuration,
      additionalNote,
      remainingNumberOfMedicine,
      dayTimeValues,
    } = form;

    try {
      const medicineDetails =
        database.get<MedicineDetails>('medicines_details');
      const medicineTimingDetails =
        database.get<MedicineTiming>('medicine_timings');

      const userCollection = database.get('users');
      const wellnessPartnerDetails = database.get('wellness_partners');

      await database.write(async () => {
        // Query for the user based on userAuthId
        const cler_id = '12345';
        const users = await userCollection
          .query(Q.where('user_auth_id', cler_id))
          .fetch();

        if (users.length === 0) {
          console.error('No user found with the provided userAuthId');
          return;
        }

        const foundUser = users[0];
        const userId = foundUser._raw.id;
        const wellnessDetails = await wellnessPartnerDetails
          .query(Q.where('user_id', userId))
          .fetch();

        if (wellnessDetails.length === 0) {
          console.error('No wellness partner found');
          return;
        }

        const foundWellnessPartner = wellnessDetails[0];
        console.log('====>', foundWellnessPartner);

        const medicineDetailsResponseData = await medicineDetails.create(
          medicineDetailsValues => {
            medicineDetailsValues.additionalNote = additionalNote;
            medicineDetailsValues.doseDetails = doseDetails;
            medicineDetailsValues.medicineDuration = parseInt(
              medicineDuration,
              10,
            );
            medicineDetailsValues.medicineType = medicineType;
            medicineDetailsValues.name = name;
            medicineDetailsValues.remainingNumberOfMedicine = parseInt(
              remainingNumberOfMedicine,
              10,
            );

            medicineDetailsValues.wellnessPartner.set(foundWellnessPartner);
          },
        );

        if (medicineDetailsResponseData) {
          Object.entries(dayTimeValues).forEach(async ([timeOfDays, times]) => {
            await medicineTimingDetails.create(medicineTimingDetailsValues => {
              medicineTimingDetailsValues.time = times || '';
              medicineTimingDetailsValues.timeOfDay = timeOfDays;

              medicineTimingDetailsValues.medicine.set(
                medicineDetailsResponseData,
              );
            });
          });
        }

        console.log('medicine details and timing details added successfully');
      });
    } catch (error) {
      console.error('Error adding wellness partner:', error);
    }
  };
  const onSubmit = () => {
    setSubmit(true);
    if (validateForm()) {
      console.log('Form submitted:', form);
      // Proceed with form submission logic
    } else {
      console.log('Validation failed:', errors);
    }
  };
  // const deleteTableDetails = async () => {
  //   try {
  //     const wellnessPartnerCollection = database.get('medicine_timings');

  //     const allPartners = await wellnessPartnerCollection.query().fetch();
  //     await database.write(async () => {
  //       const deletions = allPartners.map(partner =>
  //         partner.prepareDestroyPermanently(),
  //       );

  //       await database.batch(...deletions);
  //       console.log('All wellness partners deleted successfully');
  //     });
  //   } catch (error) {
  //     console.error('Error deleting wellness partners:', error);
  //   }
  // };
  const getMedicineDetails = async () => {
    const wellnessPartnerCollection = await database.get('medicine_timings');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);

    console.log('mnedicine details==>', formattedPartners);
  };
  // const getMedicineTiming = async () => {
  //   const wellnessPartnerCollection = await database.get('medicine_timings');
  //   const partners = await wellnessPartnerCollection.query().fetch();
  //   const formattedPartners = partners.map((partner: any) => partner._raw);

  //   console.log('time details==>', formattedPartners);
  // };

  // const handleSelectTimeOfDay = (value: DayTimeValues) => {
  //   setForm(prevForm => {
  //     const {timeOfDay, dayTimeValues} = prevForm;
  //     if (timeOfDay.includes(value)) {
  //       const updatedTimeOfDay = timeOfDay.filter(item => item !== value);
  //       const updatedDayTimeValues = {...dayTimeValues, [value]: ''};
  //       return {
  //         ...prevForm,
  //         timeOfDay: updatedTimeOfDay,
  //         dayTimeValues: updatedDayTimeValues,
  //       };
  //     } else {
  //       const updatedTimeOfDay = [...timeOfDay, value];
  //       const updatedDayTimeValues = {...dayTimeValues, [value]: ''};
  //       return {
  //         ...prevForm,
  //         timeOfDay: updatedTimeOfDay,
  //         dayTimeValues: updatedDayTimeValues,
  //       };
  //     }
  //   });
  // };
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

      // Clear error if at least one time of day is selected
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
  const handleInputChange = (field: keyof MedicineFormState, value: string) => {
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

  const handleTimeFormatChange = (
    timeOfDay: DayTimeValues,
    format: 'AM' | 'PM',
  ) => {
    const time = (form.dayTimeValues[timeOfDay] || '').split(' ')[0];
    setForm(prevForm => ({
      ...prevForm,
      dayTimeValues: {
        ...prevForm.dayTimeValues,
        [timeOfDay]: time + ' ' + format,
      },
    }));
  };

  // const handleSubmit = async () => {
  //   const sanitizedForm = sanitizeForm();
  //   console.log('Sanitized Form:', sanitizedForm);
  //   // Call your function to save the data in the database here
  //   // await addMedicinDetails(sanitizedForm);
  // };

  const dayTimes: DayTimeValues[] = [
    'Morning',
    'Afternoon',
    'Evening',
    'Night',
  ];
  const validateForm = useCallback(() => {
    const newErrors: ErrorProps = {};

    Object.entries(validationRules).forEach(([field, rule]) => {
      const value = form[field as keyof MedicineFormState];

      if (rule.required && !value) {
        newErrors[field as keyof MedicineFormState] =
          rule.message || 'Required.';
      } else if (rule.validate) {
        // Check if the value is a string before validating
        if (typeof value === 'string' && !rule.validate(value)) {
          newErrors[field as keyof MedicineFormState] =
            rule.message || 'Invalid.';
        }
      }
    });

    // Additional validation for time-of-day
    if (!form.timeOfDay.length) {
      newErrors.timeOfDay = 'Please select at least one time of day.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const goToPreviousPage = () => {
    if (swiperRef.current && currentPage > 0) {
      swiperRef.current.goToPage(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    setSubmit(true);
    // const isValid = validateCurrentPage();

    // Block navigation if validation fails
    // if (!isValid) {
    //   return;
    // }

    if (swiperRef.current && currentPage < 1) {
      swiperRef.current.goToPage(currentPage + 1);
      setCurrentPage(currentPage + 1);
    } else if (currentPage === 1) {
      handleSubmit();
    }
  };
  const handleSubmit = () => {
    console.log();
  };
  // const validateCurrentPage = () => {
  //   console.log();
  // };
  return (
    <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center'}}>
      <Swiper
        isScrollable={false}
        ref={swiperRef}
        onPageChanged={(pageIndex: number) => setCurrentPage(pageIndex)}>
        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <Text style={styles.label}>Medicine Name</Text>
          <TextInput
            value={form.name}
            onChangeText={value => handleInputChange('name', value)}
            placeHolder="Enter medicine name"
          />
          {submit && errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}

          <Text style={styles.label}>Dose Details</Text>
          <TextInput
            value={form.doseDetails}
            onChangeText={value => handleInputChange('doseDetails', value)}
            placeHolder="Enter dose details"
          />
          {submit && errors.doseDetails && (
            <Text style={styles.errorText}>{errors.doseDetails}</Text>
          )}
          <Text style={styles.label}>Medicine Type</Text>
          <TextInput
            value={form.medicineType}
            onChangeText={value => handleInputChange('medicineType', value)}
            placeHolder="Enter medicine type"
          />
          {errors.medicineType && (
            <Text style={styles.errorText}>{errors.medicineType}</Text>
          )}
          <Text style={styles.label}>Medicine Duration (in days)</Text>
          <TextInput
            value={form.medicineDuration}
            onChangeText={value => handleInputChange('medicineDuration', value)}
            placeHolder="Enter duration in days"
          />
          {errors.medicineDuration && (
            <Text style={styles.errorText}>{errors.medicineDuration}</Text>
          )}
        </View>

        <View
          style={{
            width: '100%',
            height: '100%',
          }}>
          <Text style={styles.label}>Additional Note</Text>
          <TextInput
            value={form.additionalNote}
            onChangeText={value => handleInputChange('additionalNote', value)}
            placeHolder="Enter additional note (optional)"
          />
          {errors.additionalNote && (
            <Text style={styles.errorText}>{errors.additionalNote}</Text>
          )}
          <Text style={styles.label}>Remaining Number of Medicine</Text>
          <TextInput
            value={form.remainingNumberOfMedicine}
            onChangeText={value =>
              handleInputChange('remainingNumberOfMedicine', value)
            }
            placeHolder="Enter remaining number (optional)"
          />
          {errors.remainingNumberOfMedicine && (
            <Text style={styles.errorText}>
              {errors.remainingNumberOfMedicine}
            </Text>
          )}
          <Text style={styles.label}>Time of Day</Text>
          {submit && errors.timeOfDay && (
            <Text style={styles.errorText}>{errors.timeOfDay}</Text>
          )}
          {dayTimes.map(time => (
            <View key={time} style={styles.timeOfDayRow}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  form.timeOfDay.includes(time) && styles.selectedTimeButton,
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
                  <View style={styles.test}>
                    <RnTextInput
                      style={styles.input}
                      value={(form.dayTimeValues[time] || '').split(' ')[0]}
                      onChangeText={value => handleTimeInputChange(time, value)}
                      placeholder="hh:mm"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    {/* <TextInput
                  value={(form.dayTimeValues[time] || '').split(' ')[0]}
                  onChangeText={value => handleTimeInputChange(time, value)}
                  placeHolder="hh:mm"
                /> */}
                  </View>
                  <View style={styles.formatContainer}>
                    <TouchableOpacity
                      style={[
                        styles.formatButton,
                        (form.dayTimeValues[time] || '').endsWith('AM') &&
                          styles.selectedFormatButton,
                      ]}
                      onPress={() => handleTimeFormatChange(time, 'AM')}>
                      <Text style={styles.formatText}>AM</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.formatButton,
                        (form.dayTimeValues[time] || '').endsWith('PM') &&
                          styles.selectedFormatButton,
                      ]}
                      onPress={() => handleTimeFormatChange(time, 'PM')}>
                      <Text style={styles.formatText}>PM</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
          {/* <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <Button title="add medicindetails" onPress={getMedicineDetails} /> */}
        </View>
      </Swiper>
      <View style={styles.buttonContainer}>
        {currentPage > 0 && <Button title="Back" onPress={goToPreviousPage} />}
        <Button
          title={currentPage === 1 ? 'Submit' : 'Next'}
          onPress={goToNextPage}
        />
      </View>
    </View>
  );
}
