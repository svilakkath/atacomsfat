import {database} from '@/database/database';
import MedicineDetails from '@/database/models/medicineDetails';
import MedicineTiming from '@/database/models/medicineTiming';
import {DayTimeValues} from '@/types/common';
import {Q} from '@nozbe/watermelondb';

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

const medicineDetailsService = {
  addMedicineDetails: async (form: MedicineFormState, uid: string | null) => {
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
        const users = await userCollection
          .query(Q.where('user_auth_id', uid))
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
};
export default medicineDetailsService;
