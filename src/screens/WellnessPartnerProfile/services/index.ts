import {database} from '@/database/database';
import WellnessPartner from '@/database/models/WellnessPartner';
import {Q} from '@nozbe/watermelondb';

const wellnessPartnerProfileService = {
  getWellnessPartnerDetails: async (wellnessPartnerId: string) => {
    const wellnessPartnersTable =
      database.get<WellnessPartner>('wellness_partners');

    const wellnessPartnerDetails = await wellnessPartnersTable
      .query(Q.where('id', wellnessPartnerId))
      .fetch();

    if (wellnessPartnerDetails.length > 0) {
      const partner = wellnessPartnerDetails[0];
      const formattedDetails = {
        id: partner.id,
        fullName: partner.fullName,
        age: partner.age,
        gender: partner.gender,
        phoneNumber: partner.phoneNumber,
        profileImage: partner.profileImage,
        createdAt: partner.createdAt,
        updatedAt: partner.updatedAt,
      };
      return formattedDetails;
    }

    return null;
  },
};

export default wellnessPartnerProfileService;
