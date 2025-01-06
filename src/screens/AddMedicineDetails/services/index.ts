import {database} from '@/database/database';
import MedicineDetails from '@/database/models/medicineDetails';
import MedicineTiming from '@/database/models/medicineTiming';
import {AddMedicineDetailsProps, ValidationRules} from '@/screens/types';
import {DayTimeValues} from '@/types/common';
import {Q} from '@nozbe/watermelondb';
import firestore from '@react-native-firebase/firestore';

const medicineDetailsService = {
  addMedicineDetails: async (
    form: AddMedicineDetailsProps,
    uid: string | null,
    wellnessPartnerId: string,
  ): Promise<{success: boolean; message: string; id?: string}> => {
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

      return await database.write(async () => {
        const users = await userCollection
          .query(Q.where('user_auth_id', uid))
          .fetch();

        if (users.length === 0) {
          return {
            success: false,
            message: 'No user found with the provided userAuthId',
          };
        }

        // const foundUser = users[0];
        // const userId = foundUser._raw.id;
        const wellnessDetails = await wellnessPartnerDetails
          .query(Q.where('id', wellnessPartnerId))
          .fetch();
        console.log('partner details==>', wellnessDetails);

        if (wellnessDetails.length === 0) {
          console.error('No wellness partner found');
          return {
            success: false,
            message: 'No wellness partner found',
          };
        }

        const foundWellnessPartner = wellnessDetails[0];
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
          Object.entries(dayTimeValues).map(([timeOfDays, times]) =>
            medicineTimingDetails.create(medicineTimingDetailsValues => {
              medicineTimingDetailsValues.time = times || '';
              medicineTimingDetailsValues.timeOfDay = timeOfDays;
              medicineTimingDetailsValues.medicine.set(
                medicineDetailsResponseData,
              );
            }),
          );
        }

        console.log('Medicine details and timing details added successfully');
        return {
          success: true,
          message: 'Wellness Partner added successfully',
          id: medicineDetailsResponseData.id, // Include an ID if needed
        };
      });
    } catch (error) {
      console.error('Error adding wellness partner:', error);
      return {
        success: false,
        message: `Error: ${error}`,
      };
    }
  },

  deleteAllMedicineDetails: async () => {
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
  },
  getAllMedicineDetails: async () => {
    const wellnessPartnerCollection = await database.get('medicines_details');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);
    console.log('mnedicine details==>', formattedPartners);
  },
  getAllTimingDetails: async () => {
    const wellnessPartnerCollection = await database.get('medicine_timings');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);

    console.log('mnedicine details==>', formattedPartners);
  },
  syncMedicineDetailsToFirestore: async (medicineId: string) => {
    try {
      const medicineDetailsCollection =
        firestore().collection('medicines_details');
      const medicineTimingsCollection =
        firestore().collection('medicine_timings');

      const medicineDetails = await database.collections
        .get<MedicineDetails>('medicines_details')
        .find(medicineId);

      if (medicineDetails) {
        const batch = firestore().batch();

        const medicineRef = medicineDetailsCollection.doc(medicineDetails.id);

        batch.set(medicineRef, {
          name: medicineDetails.name,
          dose_details: medicineDetails.doseDetails,
          medicine_type: medicineDetails.medicineType,
          medicine_duration: medicineDetails.medicineDuration,
          additional_note: medicineDetails.additionalNote,
          remaining_number_of_medicine:
            medicineDetails.remainingNumberOfMedicine,
          wellness_partner_id: medicineDetails.wellnessPartner.id,
          created_at: medicineDetails.createdAt,
          updated_at: medicineDetails.updatedAt,
        });

        const medicineTimings = await database.collections
          .get<MedicineTiming>('medicine_timings')
          .query(Q.where('medicine_id', medicineDetails.id))
          .fetch();

        medicineTimings.forEach(timing => {
          const timingRef = medicineTimingsCollection.doc(timing.id);

          batch.set(timingRef, {
            time_of_day: timing.timeOfDay,
            time: timing.time,
            medicine_id: timing.medicine.id,
            created_at: timing.createdAt,
            updated_at: timing.updatedAt,
          });
        });

        await batch.commit();
        console.log(
          'Medicine details and timings synced to Firestore successfully',
        );
      } else {
        console.log('No medicine found with the provided ID');
      }
    } catch (error) {
      console.error(
        'Error syncing medicine details and timings to Firestore:',
        error,
      );
    }
  },
};

export default medicineDetailsService;

export const validationRules: Record<
  keyof AddMedicineDetailsProps,
  ValidationRules
> = {
  name: {
    required: true,
    message: '*Required',
  },
  doseDetails: {
    required: true,
    message: '*Required',
  },
  medicineType: {
    required: false,
    message: '',
  },
  medicineDuration: {
    required: false,
    message: 'Duration must be a positive number (in days).',
  },
  additionalNote: {
    required: false,
    message: '',
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

export const dayTimes: DayTimeValues[] = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
];

export const MedicineTypes = [
  {
    name: 'Capsule',
    normalImage: require('@/assets/images/Medicines/capsule.png'),
    highlightedImage: require('@/assets/images/Medicines/capsule-highlight.png'),
  },
  {
    name: 'Injection',
    normalImage: require('@/assets/images/Medicines/injection.png'),
    highlightedImage: require('@/assets/images/Medicines/injection-hignlight.png'),
  },
  {
    name: 'Ointment',
    normalImage: require('@/assets/images/Medicines/ointment.png'),
    highlightedImage: require('@/assets/images/Medicines/ointment-highlight.png'),
  },
  {
    name: 'Syrup',
    normalImage: require('@/assets/images/Medicines/syrup.png'),
    highlightedImage: require('@/assets/images/Medicines/syrup-highlight.png'),
  },
];
