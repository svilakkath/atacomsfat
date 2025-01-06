import {database} from '@/database/database';
import User from '@/database/models/User';
import {UserSignupProps} from '@/screens/types';
import {hashPassword} from '@/utils/helper';
import firestore from '@react-native-firebase/firestore';

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
  syncUsersToFirestore: async () => {
    try {
      const usersCollection = firestore().collection('users');
      const users = await database.collections
        .get<User>('users')
        .query()
        .fetch();

      // Use Firestore batch for efficient writes
      const batch = firestore().batch();

      users.forEach((user: User) => {
        const userRef = usersCollection.doc(user.userAuthId);
        batch.set(userRef, {
          full_name: user.fullName,
          phone_number: user.phoneNumber,
          email_address: user.emailAddress,
          password: user.password,
          profile_image: user.profileImage || null,
          user_auth_id: user.userAuthId,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        });
      });

      await batch.commit();
      console.log('Users synced to Firestore successfully');
    } catch (error) {
      console.error('Error syncing users to Firestore:', error);
    }
  },
};
export default userService;
