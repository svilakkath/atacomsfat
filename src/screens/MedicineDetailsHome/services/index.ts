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
};

export default medicineDetailsService;
