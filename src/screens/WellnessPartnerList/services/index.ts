import {database} from '@/database/database';
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
};

export default wellnessPartnerList;
