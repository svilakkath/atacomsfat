import {database} from '@/database/database';
import MedicineDetails from '@/database/models/medicineDetails';
import WellnessPartner from '@/database/models/WellnessPartner';
import {Model, Q} from '@nozbe/watermelondb';
import React, {useState} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export type DayTimeValues = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

type FormState = {
  name: string;
  doseDetails: string;
  medicineType: string;
  medicineDuration: string;
  additionalNote: string;
  remainingNumberOfMedicine: string;
  timeOfDay: DayTimeValues[];
  dayTimeValues: Record<DayTimeValues, string>;
};
type MedicineTimingProps = {
  timeOfDay: string;
  time: string;
  medicine: MedicineDetails;
};

type MedicineDetailsProps = {
  name: string;
  doseDetails: string;
  medicineType?: string;
  medicineDuration?: number;
  additionalNote?: string;
  remainingNumberOfMedicine?: number;
  wellnessPartner: WellnessPartner;
};
export default function AddMedicineDetails() {
  const [form, setForm] = useState<FormState>({
    name: '',
    doseDetails: '',
    medicineType: '',
    medicineDuration: '',
    additionalNote: '',
    remainingNumberOfMedicine: '',
    timeOfDay: [],
    dayTimeValues: {
      Morning: '',
      Afternoon: '',
      Evening: '',
      Night: '',
    },
  });

  const addMedicinDetails = async () => {
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
      const medicineDetails = database.get('medicines_details');
      const medicineTimingDetails = database.get('medicine_timings');

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
        const medicineDetailsResponseData = await medicineDetails.create(
          (record: Model) => {
            const medicineDetailsValues =
              record as unknown as MedicineDetailsProps;
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
            console.log('Processing time of day:', timeOfDays);
            console.log('Time:', times);

            await medicineTimingDetails.create((record: Model) => {
              const medicineTimingDetailsValues =
                record as unknown as MedicineTimingProps;

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

  const getMedicineDetails = async () => {
    const wellnessPartnerCollection = await database.get('medicines_details');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);

    console.log('mnedicine details==>', formattedPartners);
  };
  const getMedicineTiming = async () => {
    const wellnessPartnerCollection = await database.get('medicine_timings');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);

    console.log('time details==>', formattedPartners);
  };

  const handleSelectTimeOfDay = (value: DayTimeValues) => {
    setForm(prevForm => {
      const {timeOfDay} = prevForm;
      if (timeOfDay.includes(value)) {
        return {
          ...prevForm,
          timeOfDay: timeOfDay.filter(item => item !== value),
          dayTimeValues: {...prevForm.dayTimeValues, [value]: ''},
        };
      } else {
        return {...prevForm, timeOfDay: [...timeOfDay, value]};
      }
    });
  };
  const handleInputChange = (field: keyof FormState, value: string) => {
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
      setForm(prevForm => ({
        ...prevForm,
        dayTimeValues: {
          ...prevForm.dayTimeValues,
          [timeOfDay]: value,
        },
      }));
    }
  };

  const handleTimeFormatChange = (
    timeOfDay: DayTimeValues,
    format: 'AM' | 'PM',
  ) => {
    const time = form.dayTimeValues[timeOfDay].split(' ')[0];
    setForm(prevForm => ({
      ...prevForm,
      dayTimeValues: {
        ...prevForm.dayTimeValues,
        [timeOfDay]: time + ' ' + format,
      },
    }));
  };

  const handleSubmit = async () => {
    const sanitizedTimeInputs = Object.fromEntries(
      Object.entries(form.dayTimeValues).filter(([timeOfDay, _]) =>
        form.timeOfDay.includes(timeOfDay as DayTimeValues),
      ),
    );

    const sanitizedForm = {
      ...form,
      dayTimeValues: sanitizedTimeInputs,
    };
    // setForm(sanitizedForm);
    console.log('Sanitized Form:', sanitizedForm.dayTimeValues);
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
        style={styles.input}
        value={form.name}
        onChangeText={value => handleInputChange('name', value)}
        placeholder="Enter medicine name"
      />

      <Text style={styles.label}>Dose Details</Text>
      <TextInput
        style={styles.input}
        value={form.doseDetails}
        onChangeText={value => handleInputChange('doseDetails', value)}
        placeholder="Enter dose details"
      />

      <Text style={styles.label}>Medicine Type</Text>
      <TextInput
        style={styles.input}
        value={form.medicineType}
        onChangeText={value => handleInputChange('medicineType', value)}
        placeholder="Enter medicine type"
      />

      <Text style={styles.label}>Medicine Duration (in days)</Text>
      <TextInput
        style={styles.input}
        value={form.medicineDuration}
        onChangeText={value => handleInputChange('medicineDuration', value)}
        placeholder="Enter duration in days"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Additional Note</Text>
      <TextInput
        style={styles.input}
        value={form.additionalNote}
        onChangeText={value => handleInputChange('additionalNote', value)}
        placeholder="Enter additional note (optional)"
      />
      <Text style={styles.label}>Remaining Number of Medicine</Text>
      <TextInput
        style={styles.input}
        value={form.remainingNumberOfMedicine}
        onChangeText={value =>
          handleInputChange('remainingNumberOfMedicine', value)
        }
        placeholder="Enter remaining number (optional)"
        keyboardType="numeric"
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
              <View style={{width: '30%'}}>
                <TextInput
                  style={styles.input}
                  value={form.dayTimeValues[time].split(' ')[0]} // Show time only
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
                    form.dayTimeValues[time].endsWith('AM') &&
                      styles.selectedFormatButton,
                  ]}
                  onPress={() => handleTimeFormatChange(time, 'AM')}>
                  <Text style={styles.formatText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.formatButton,
                    form.dayTimeValues[time].endsWith('PM') &&
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
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Medicine</Text>
      </TouchableOpacity>
      <Button title="add medicindetails" onPress={addMedicinDetails} />
      <Button title="get meidicne details" onPress={getMedicineDetails} />
      <Button title="getTimingDetails" onPress={getMedicineTiming} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  timeOfDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeButton: {
    marginRight: 10,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedTimeButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
  },
  formatContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  formatButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  selectedFormatButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  formatText: {
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
