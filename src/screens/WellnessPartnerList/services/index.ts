import {database} from '@/database/database';
import MedicineDetails from '@/database/models/medicineDetails';
import MedicineTiming from '@/database/models/medicineTiming';
import WellnessPartner from '@/database/models/WellnessPartner';
import {AllWellnessPartnersDetailsProps} from '@/screens/types';
import {Q} from '@nozbe/watermelondb';

const wellnessPartnerList = {
  getWellnessPartnersList: async (
    uid: string | null,
  ): Promise<AllWellnessPartnersDetailsProps[]> => {
    const userCollection = database.get('users');

    const users = await userCollection
      .query(Q.where('user_auth_id', uid))
      .fetch();
    if (users.length === 0) {
      return [];
    }

    const foundUser = users[0];
    const userId = foundUser.id;

    const wellnessPartnerDetails =
      database.get<WellnessPartner>('wellness_partners');

    const wellnessDetails = await wellnessPartnerDetails
      .query(Q.where('user_id', userId))
      .fetch();

    return wellnessDetails.map(partner => ({
      id: partner.id,
      fullName: partner.fullName,
      gender: partner.gender,
      phoneNumber: partner.phoneNumber,
      age: partner.age,
      profileImage: partner.profileImage,
      userId: partner.user.id,
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
    }));
  },
  deleteWellnessPartnerById: async (
    partnerId: string,
  ): Promise<{success: boolean; message: string}> => {
    const wellnessPartnerCollection =
      database.get<WellnessPartner>('wellness_partners');
    const medicineDetailsCollection =
      database.get<MedicineDetails>('medicines_details');
    const medicineTimingCollection =
      database.get<MedicineTiming>('medicine_timings');

    try {
      await database.write(async () => {
        // Fetch the wellness partner to delete
        const wellnessPartner = await wellnessPartnerCollection.find(partnerId);
        if (!wellnessPartner) {
          throw new Error('Wellness partner not found');
        }

        // Fetch related medicine details
        const medicineDetails = await medicineDetailsCollection
          .query(Q.where('wellness_partner_id', partnerId))
          .fetch();

        // Iterate over each medicine detail and delete related timings
        for (const medicine of medicineDetails) {
          const medicineTimings = await medicineTimingCollection
            .query(Q.where('medicine_id', medicine.id))
            .fetch();

          // Delete all related medicine timings
          for (const timing of medicineTimings) {
            await timing.markAsDeleted(); // Marks for deletion
            await timing.destroyPermanently(); // Permanently deletes the timing
          }

          // Delete the medicine detail
          await medicine.markAsDeleted(); // Marks for deletion
          await medicine.destroyPermanently(); // Permanently deletes the medicine
        }

        // Finally, delete the wellness partner
        await wellnessPartner.markAsDeleted(); // Marks for deletion
        await wellnessPartner.destroyPermanently(); // Permanently deletes the partner
      });

      return {
        success: true,
        message: `Wellness partner with ID ${partnerId} and all related data deleted successfully.`,
      };
    } catch (error) {
      console.error('Error deleting wellness partner and related data:', error);
      return {
        success: false,
        message: `Failed to delete wellness partner: ${error}`,
      };
    }
  },
};

export default wellnessPartnerList;
