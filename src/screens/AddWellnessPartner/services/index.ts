import {database} from '@/database/database';
import User from '@/database/models/User';
import WellnessPartner from '@/database/models/WellnessPartner';
import {Q} from '@nozbe/watermelondb';

type WellnessPartnerProps = {
  fullName: string;
  phoneNumber: string;
  age: string;
  gender: string;
  profileImage?: string;
};

const wellnessPartnerService = {
  createWellnessPartner: async (
    form: WellnessPartnerProps,
    userAuthId: string | null,
  ) => {
    const {fullName, phoneNumber, age, gender, profileImage} = form;

    try {
      const wellnessPartnerCollection =
        database.get<WellnessPartner>('wellness_partners');

      const userCollection = database.get<User>('users');

      await database.write(async () => {
        const users = await userCollection
          .query(Q.where('user_auth_id', userAuthId))
          .fetch();

        if (users.length === 0) {
          console.error('No user found with the provided userAuthId');
          return;
        }

        const foundUser = users[0];

        await wellnessPartnerCollection.create(wellnessPartner => {
          wellnessPartner.fullName = fullName;
          wellnessPartner.phoneNumber = phoneNumber;
          wellnessPartner.age = parseInt(age, 10);
          wellnessPartner.gender = gender;
          wellnessPartner.profileImage = profileImage || undefined;
          wellnessPartner.user.set(foundUser);
        });

        console.log('Wellness Partner added successfully');
      });
    } catch (error) {
      console.error('Error adding wellness partner:', error);
    }
  },

  deleteAllWellnessPartnerDetails: async () => {
    try {
      const wellnessPartnerCollection = database.get('wellness_partners');

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

  getAllWellnessPartnersDetails: async () => {
    const wellnessPartnerCollection = await database.get('wellness_partners');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);
    console.log('wellness partners ==>', formattedPartners);
  },
};
export default wellnessPartnerService;
