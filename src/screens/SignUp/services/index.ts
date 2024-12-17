import {database} from '@/database/database';
import User from '@/database/models/User';
import {UserSignupProps} from '@/screens/types';
import {hashPassword} from '@/utils/helper';

const userService = {
  createUser: async (form: UserSignupProps, uid: string) => {
    const {fullName, phoneNumber, emailAddress} = form;
    const hashedPassword = await hashPassword(form.password);

    try {
      const userDbinformation = database.get<User>('users');
      await database.write(async () => {
        await userDbinformation.create(userDetails => {
          userDetails.fullName = fullName.trim();
          userDetails.emailAddress = emailAddress;
          userDetails.password = hashedPassword || form.password;
          userDetails.phoneNumber = phoneNumber;
          userDetails.userAuthId = uid;
          userDetails.profileImage = '';
        });
        console.log('user added successfully');
      });
      //   navigation.navigate('BottomNavigator');
    } catch (error) {
      console.error('Error adding user details:', error);
    }
  },
  getUserDetails: async () => {
    const wellnessPartnerCollection = await database.get('users');
    const partners = await wellnessPartnerCollection.query().fetch();
    const formattedPartners = partners.map((partner: any) => partner._raw);

    console.log('mnedicine details==>', formattedPartners);
  },
  deleteAllUserDetails: async () => {
    try {
      const wellnessPartnerCollection = database.get('users');

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
};
export default userService;
