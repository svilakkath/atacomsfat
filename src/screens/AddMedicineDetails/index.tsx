import {Swiper, TextInput} from '@/components';
import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  TextInput as RnTextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useStyles from './styles';

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
    required: true,
    validate: value => {
      const timesValid = Object.values(value).every(
        time => !time || /^([01]\d|2[0-3]):([0-5]\d)\s(AM|PM)$/.test(time),
      );
      return timesValid;
    },
    message: 'Time values must be valid 12-hour format (e.g., 08:00 AM).',
  },
};

export default function AddMedicineDetails() {
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
  // const {uid} = useUserStore();

  const addMedicinDetails = async () => {
    sanitizeForm();
    // await medicineDetailsService.addMedicineDetails(form, uid);
  };
  const onSubmit = () => {
    setSubmit(true);
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

  const dayTimes: DayTimeValues[] = [
    'Morning',
    'Afternoon',
    'Evening',
    'Night',
  ];

  const validateCurrentPage = useCallback(() => {
    const newErrors: ErrorProps = {};
    if (currentPage === 0) {
      ['name', 'doseDetails', 'medicineType', 'medicineDuration'].forEach(
        field => {
          if (
            validationRules[field as keyof MedicineFormState].required &&
            !form[field as keyof MedicineFormState]
          ) {
            newErrors[field as keyof MedicineFormState] =
              validationRules[field as keyof MedicineFormState].message ||
              'Required.';
          }
        },
      );
    } else if (currentPage === 1) {
      ['additionalNote', 'remainingNumberOfMedicine', 'timeOfDay'].forEach(
        field => {
          if (validationRules[field as keyof MedicineFormState].required) {
            const value = form[field as keyof MedicineFormState];
            if (
              (field === 'timeOfDay' &&
                Array.isArray(value) &&
                value.length === 0) || // Check for empty array
              (!Array.isArray(value) && !value) // General check for falsy values
            ) {
              newErrors[field as keyof MedicineFormState] =
                validationRules[field as keyof MedicineFormState].message ||
                'Required.';
            }
          }
        },
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentPage, form]);

  const goToPreviousPage = () => {
    if (swiperRef.current && currentPage > 0) {
      swiperRef.current.goToPage(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
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
    // addMedicinDetails();
  };
  // const handleDelete = () => {
  //   medicineDetailsService.deleteAllMedicineDetails();
  // };
  // const getDetails = () => {
  //   medicineDetailsService.getAllMedicineDetails();
  //   medicineDetailsService.getAllTimingDetails();
  // };
  return (
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

        <View style={styles.secondScreen}>
          <Text style={styles.label}>Additional Note</Text>
          <TextInput
            value={form.additionalNote}
            onChangeText={value => handleInputChange('additionalNote', value)}
            placeHolder="Enter additional note (optional)"
          />
          {submit && errors.additionalNote && (
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
      </TouchableOpacity> */}
          <Button title="get" onPress={() => {}} />
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
