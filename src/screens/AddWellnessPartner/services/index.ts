import {database} from '@/database/database';
import User from '@/database/models/User';
import WellnessPartner from '@/database/models/WellnessPartner';
import {AddWellnessPartnerProps, ValidationRules} from '@/screens/types';
import {Q} from '@nozbe/watermelondb';

const wellnessPartnerService = {
  // createWellnessPartner: async (
  //   form: AddWellnessPartnerProps,
  //   userAuthId: string | null,
  // ): Promise<any> => {
  //   const {fullName, phoneNumber, age, gender, profileImage} = form;

  //   try {
  //     const wellnessPartnerCollection =
  //       database.get<WellnessPartner>('wellness_partners');

  //     const userCollection = database.get<User>('users');

  //     await database.write(async () => {
  //       const users = await userCollection
  //         .query(Q.where('user_auth_id', userAuthId))
  //         .fetch();

  //       if (users.length === 0) {
  //         console.error('No user found with the provided userAuthId');
  //         return;
  //       }

  //       const foundUser = users[0];

  //       const newWellnessPartner = await wellnessPartnerCollection.create(
  //         wellnessPartner => {
  //           wellnessPartner.fullName = fullName;
  //           wellnessPartner.phoneNumber = phoneNumber;
  //           wellnessPartner.age = parseInt(age, 10);
  //           wellnessPartner.gender = gender;
  //           wellnessPartner.profileImage = profileImage || undefined;
  //           wellnessPartner.user.set(foundUser);
  //         },
  //       );
  //       return newWellnessPartner._raw.id;
  //       // console.log('Wellness Partner added successfully');
  //     });
  //   } catch (error) {
  //     console.error('Error adding wellness partner:', error);
  //     return null;
  //   }
  // },

  createWellnessPartner: async (
    form: AddWellnessPartnerProps,
    userAuthId: string | null,
  ): Promise<{success: boolean; message: string; id?: string} | null> => {
    const {fullName, phoneNumber, age, gender, profileImage} = form;

    try {
      const wellnessPartnerCollection =
        database.get<WellnessPartner>('wellness_partners');

      const userCollection = database.get<User>('users');

      return await database.write(async () => {
        const users = await userCollection
          .query(Q.where('user_auth_id', userAuthId))
          .fetch();

        if (users.length === 0) {
          console.error('No user found with the provided userAuthId');
          return {
            success: false,
            message: 'No user found with the provided userAuthId',
          };
        }

        const foundUser = users[0];

        const newWellnessPartner = await wellnessPartnerCollection.create(
          wellnessPartner => {
            wellnessPartner.fullName = fullName;
            wellnessPartner.phoneNumber = phoneNumber;
            wellnessPartner.age = parseInt(age, 10);
            wellnessPartner.gender = gender;
            wellnessPartner.profileImage = profileImage || undefined;
            wellnessPartner.user.set(foundUser);
          },
        );

        return {
          success: true,
          message: 'Wellness Partner added successfully',
          id: newWellnessPartner._raw.id, // Returning the new partner's ID
        };
      });
    } catch (error) {
      console.error('Error adding wellness partner:', error);
      return {
        success: false,
        message: 'Error adding wellness partner',
      };
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

export const validationRules: Record<
  keyof AddWellnessPartnerProps,
  ValidationRules
> = {
  fullName: {
    required: true,
    message: '*Required',
  },
  phoneNumber: {
    required: false,
    // validate: (value: string) => /^\d{10}$/.test(value),
    message: '*Required',
  },
  age: {
    required: true,
    validate: (value: string) => /^\d+$/.test(value) && parseInt(value, 10) > 0,
    message: '*Required',
  },
  gender: {
    required: true,
    validate: (value: string) =>
      ['Male', 'Female', 'Other'].includes(value.trim()),
    message: '*Required',
  },
  profileImage: {
    required: false,
    validate: (value: string) =>
      !value || /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i.test(value),
    message: 'Profile Image must be a valid URL (optional).',
  },
};
