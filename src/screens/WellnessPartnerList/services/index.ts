import {database} from '@/database/database';
import {Q} from '@nozbe/watermelondb';

const wellnessPartnerList = {
  getWellnessPartnersList: async (uid: string | null) => {
    const userCollection = database.get('users');

    const users = await userCollection
      .query(Q.where('user_auth_id', uid))
      .fetch();

    const foundUser = users[0];
    const userId = foundUser._raw.id;
    const wellnessPartnerDetails = database.get('wellness_partners');
    const wellnessDetails = await wellnessPartnerDetails
      .query(Q.where('user_id', userId))
      .fetch();
    return wellnessDetails;
  },
};
export default wellnessPartnerList;
