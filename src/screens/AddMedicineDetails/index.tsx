import {TextInput} from '@/components';
import {database} from '@/database/database';
import MedicineDetails from '@/database/models/medicineDetails';
import MedicineTiming from '@/database/models/medicineTiming';
import {Q} from '@nozbe/watermelondb';
import React, {useState} from 'react';
import {
  Button,
  TextInput as RnTextInput,
  ScrollView,
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

export default function AddMedicineDetails() {
  const styles = useStyles();

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
  const deleteTableDetails = async () => {
    try {
      const wellnessPartnerCollection = database.get('medicine_timings');

      const allPartners = await wellnessPartnerCollection.query().fetch();
      await database.write(async () => {
        const deletions = allPartners.map(partner =>
          partner.prepareDestroyPermanently(),
        );

        await database.batch(...deletions);
        console.log('All wellness partners deleted successfully');
      });
    } catch (error) {
      console.error('Error deleting wellness partners:', error);
    }
  };
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

  const handleSelectTimeOfDay = (value: DayTimeValues) => {
    setForm(prevForm => {
      const {timeOfDay, dayTimeValues} = prevForm;
      if (timeOfDay.includes(value)) {
        const updatedTimeOfDay = timeOfDay.filter(item => item !== value);
        const updatedDayTimeValues = {...dayTimeValues, [value]: ''};
        return {
          ...prevForm,
          timeOfDay: updatedTimeOfDay,
          dayTimeValues: updatedDayTimeValues,
        };
      } else {
        const updatedTimeOfDay = [...timeOfDay, value];
        const updatedDayTimeValues = {...dayTimeValues, [value]: ''};
        return {
          ...prevForm,
          timeOfDay: updatedTimeOfDay,
          dayTimeValues: updatedDayTimeValues,
        };
      }
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
    setForm({...form, [field]: value});
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

  const handleSubmit = async () => {
    const sanitizedForm = sanitizeForm();
    console.log('Sanitized Form:', sanitizedForm);
    // Call your function to save the data in the database here
    // await addMedicinDetails(sanitizedForm);
  };

  const dayTimes: DayTimeValues[] = [
    'Morning',
    'Afternoon',
    'Evening',
    'Night',
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Medicine Name</Text>
      <TextInput
        value={form.name}
        onChangeText={value => handleInputChange('name', value)}
        placeHolder="Enter medicine name"
      />

      <Text style={styles.label}>Dose Details</Text>
      <TextInput
        value={form.doseDetails}
        onChangeText={value => handleInputChange('doseDetails', value)}
        placeHolder="Enter dose details"
      />

      <Text style={styles.label}>Medicine Type</Text>
      <TextInput
        value={form.medicineType}
        onChangeText={value => handleInputChange('medicineType', value)}
        placeHolder="Enter medicine type"
      />

      <Text style={styles.label}>Medicine Duration (in days)</Text>
      <TextInput
        value={form.medicineDuration}
        onChangeText={value => handleInputChange('medicineDuration', value)}
        placeHolder="Enter duration in days"
      />

      <Text style={styles.label}>Additional Note</Text>
      <TextInput
        value={form.additionalNote}
        onChangeText={value => handleInputChange('additionalNote', value)}
        placeHolder="Enter additional note (optional)"
      />
      <Text style={styles.label}>Remaining Number of Medicine</Text>
      <TextInput
        value={form.remainingNumberOfMedicine}
        onChangeText={value =>
          handleInputChange('remainingNumberOfMedicine', value)
        }
        placeHolder="Enter remaining number (optional)"
      />
      <Text style={styles.label}>Time of Day</Text>
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
      <TouchableOpacity
        style={styles.submitButton}
        onPress={getMedicineDetails}>
        <Text style={styles.submitButtonText}>Add Medicine</Text>
      </TouchableOpacity>
      <Button title="add medicindetails" onPress={getMedicineDetails} />
    </ScrollView>
  );
}
