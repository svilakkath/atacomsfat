import {database} from '@/database/database';
import MedicineDetails from '@/database/models/medicineDetails';
import MedicineTiming from '@/database/models/medicineTiming';
import {
  MedicineDetailsProps,
  MedicineDetailsTimingProps,
} from '@/screens/types';
import {Q} from '@nozbe/watermelondb';

const medicineDetailsService = {
  getAllMedicineDetailsById: async (
    wellnessPartnerId: string,
  ): Promise<MedicineDetailsProps[]> => {
    const medicineCollection =
      database.get<MedicineDetails>('medicines_details');
    const medicineTimingCollection =
      database.get<MedicineTiming>('medicine_timings');

    const medicineDetails = await medicineCollection
      .query(Q.where('wellness_partner_id', wellnessPartnerId))
      .fetch();

    const medicineDetailsWithTimings = await Promise.all(
      medicineDetails.map(async medicineDetail => {
        const medicineTimingDetails = await medicineTimingCollection
          .query(Q.where('medicine_id', medicineDetail.id))
          .fetch();

        const formattedTimings: MedicineDetailsTimingProps[] =
          medicineTimingDetails.map(timing => ({
            id: timing.id,
            time: timing.time,
            timeOfDay: timing.timeOfDay,
            createdAt: timing.createdAt,
            updatedAt: timing.updatedAt,
            medicineId: medicineDetail.id,
          }));

        return {
          id: medicineDetail.id,
          name: medicineDetail.name,
          doseDetails: medicineDetail.doseDetails,
          medicineType: medicineDetail.medicineType,
          medicineDuration: medicineDetail.medicineDuration,
          additionalNote: medicineDetail.additionalNote,
          remainingNumberOfMedicine: medicineDetail.remainingNumberOfMedicine,
          wellnessPartnerId: wellnessPartnerId,
          createdAt: medicineDetail.createdAt,
          updatedAt: medicineDetail.updatedAt,
          timings: formattedTimings,
        };
      }),
    );

    return medicineDetailsWithTimings;
  },
  deleteMedicineById: async (
    id: string,
  ): Promise<{success: boolean; message: string}> => {
    const medicineCollection =
      database.get<MedicineDetails>('medicines_details');
    const medicineTimingCollection =
      database.get<MedicineTiming>('medicine_timings');

    try {
      await database.write(async () => {
        // Fetch the medicine to delete
        const medicine = await medicineCollection.find(id);
        if (!medicine) {
          throw new Error('Medicine not found');
        }

        // Fetch related medicine timing details
        const medicineTimingDetails = await medicineTimingCollection
          .query(Q.where('medicine_id', id))
          .fetch();

        // Delete all related timing details
        for (const timing of medicineTimingDetails) {
          await timing.markAsDeleted(); // Marks for deletion
          await timing.destroyPermanently(); // Permanently deletes the timing
        }

        // Delete the medicine
        await medicine.markAsDeleted(); // Marks for deletion
        await medicine.destroyPermanently(); // Permanently deletes the medicine
      });

      return {
        success: true,
        message: `Medicine with ID ${id} and its timings deleted successfully.`,
      };
    } catch (error) {
      console.error('Error deleting medicine and its timings:', error);
      return {
        success: false,
        message: `Failed to delete medicine: ${error}`,
      };
    }
  },
};

export default medicineDetailsService;
export const dayTimeImages = [
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
