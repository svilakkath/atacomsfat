import {database} from '@/database/database';
import User from '@/database/models/User';
import {Q} from '@nozbe/watermelondb';

const userProfileServices = {
  getUserDetails: async (
    userId: string | null,
  ): Promise<{
    success: boolean;
    message: string;
    userDetails?: {
      id: string;
      fullName: string;
      phoneNumber: string;
      emailAddress: string;
      profileImage?: string;
      createdAt: number;
      updatedAt: number;
    };
  }> => {
    try {
      const userDetailsTable = database.get<User>('users');
      const userDetails = await userDetailsTable
        .query(Q.where('user_auth_id', userId))
        .fetch();

      if (userDetails.length === 0) {
        console.error('No User found');
        return {
          success: false,
          message: 'No User found',
        };
      }

      const user = userDetails[0];
      return {
        success: true,
        message: 'Success',
        userDetails: {
          id: user.id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          emailAddress: user.emailAddress,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      console.error('Error getting user details:', error);
      return {
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
  updateUserDetails: async (
    uid: string | null,
    updatedData: {
      fullName?: string;
      phoneNumber?: string;
      // profileImage?: string;
    },
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const userDetailsTable = database.get<User>('users');
      const users = await userDetailsTable
        .query(Q.where('user_auth_id', uid))
        .fetch();

      if (users.length === 0) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const foundUser = users[0]; // Get the first user from the result

      await database.write(async () => {
        // Using update to modify fields
        await foundUser.update(user => {
          if (updatedData.fullName) {
            user.fullName = updatedData.fullName;
          }
          if (updatedData.phoneNumber) {
            user.phoneNumber = updatedData.phoneNumber;
          }
          // if (updatedData.profileImage) {
          //   user.profileImage = updatedData.profileImage;
          // }
        });
      });

      return {
        success: true,
        message: 'User details updated successfully.',
      };
    } catch (error) {
      console.error('Error updating user details:', error);
      return {
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
  updateProfileImage: async (
    uid: string | null,
    imagePath: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const userDetailsTable = database.get<User>('users');
      const users = await userDetailsTable
        .query(Q.where('user_auth_id', uid))
        .fetch();

      if (users.length === 0) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const foundUser = users[0];

      await database.write(async () => {
        // Using update to modify the profileImage field
        await foundUser.update(user => {
          user.profileImage = imagePath;
        });
      });

      return {
        success: true,
        message: 'Profile image updated successfully.',
      };
    } catch (error) {
      console.error('Error updating profile image:', error);
      return {
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
  deleteUserPhoto: async (
    uid: string | null,
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const userDetailsTable = database.get<User>('users'); // Replace 'users' with your actual table name
      const users = await userDetailsTable
        .query(Q.where('user_auth_id', uid))
        .fetch();

      if (users.length === 0) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const foundUser = users[0]; // Get the first user from the result

      await database.write(async () => {
        // Using update to set profileImage to null or undefined
        await foundUser.update(user => {
          user.profileImage = ''; // Or use `undefined` if that's your convention
        });
      });

      return {
        success: true,
        message: 'User photo deleted successfully.',
      };
    } catch (error) {
      console.error('Error deleting user photo:', error);
      return {
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
};
export default userProfileServices;
