import {database} from '@/database/database';
import WellnessPartner from '@/database/models/WellnessPartner';
import {Q} from '@nozbe/watermelondb';

const wellnessPartnerProfileService = {
  getWellnessPartnerDetails: async (
    wellnessPartnerId: string | null,
  ): Promise<{
    success: boolean;
    message: string;
    wellnessPartnerDetails?: {
      id: string;
      fullName: string;
      age: number;
      gender: string;
      phoneNumber: string;
      profileImage: string | undefined;
      createdAt: number;
      updatedAt: number;
    };
  }> => {
    try {
      if (!wellnessPartnerId) {
        console.error('Invalid wellness partner ID');
        return {
          success: false,
          message: 'Invalid wellness partner ID',
        };
      }

      const wellnessPartnersTable =
        database.get<WellnessPartner>('wellness_partners');
      const wellnessPartnerDetails = await wellnessPartnersTable
        .query(Q.where('id', wellnessPartnerId))
        .fetch();

      if (wellnessPartnerDetails.length === 0) {
        console.error('No Wellness Partner found');
        return {
          success: false,
          message: 'No Wellness Partner found',
        };
      }

      const partner = wellnessPartnerDetails[0];
      return {
        success: true,
        message: 'Success',
        wellnessPartnerDetails: {
          id: partner.id,
          fullName: partner.fullName,
          age: partner.age,
          gender: partner.gender,
          phoneNumber: partner.phoneNumber,
          profileImage: partner.profileImage,
          createdAt: partner.createdAt,
          updatedAt: partner.updatedAt,
        },
      };
    } catch (error) {
      console.error('Error getting wellness partner details:', error);
      return {
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
  updateWellnessPartnerDetails: async (
    wellnessPartnerId: string | null,
    updatedData: {
      fullName?: string;
      phoneNumber?: string | null;
      age?: number;
      profileImage?: string;
    },
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      if (!wellnessPartnerId) {
        return {
          success: false,
          message: 'Invalid wellness partner ID',
        };
      }

      const wellnessPartnersTable =
        database.get<WellnessPartner>('wellness_partners');
      const partners = await wellnessPartnersTable
        .query(Q.where('id', wellnessPartnerId))
        .fetch();

      if (partners.length === 0) {
        return {
          success: false,
          message: 'Wellness partner not found',
        };
      }

      const foundPartner = partners[0]; // Get the first partner from the result

      await database.write(async () => {
        // Using update to modify fields
        await foundPartner.update(partner => {
          if (updatedData.fullName) {
            partner.fullName = updatedData.fullName;
          }
          if (updatedData.phoneNumber) {
            partner.phoneNumber = updatedData.phoneNumber;
          }
          if (updatedData.age) {
            partner.age = updatedData.age;
          }
          if (updatedData.profileImage) {
            partner.profileImage = updatedData.profileImage;
          }
        });
      });

      return {
        success: true,
        message: 'Wellness partner details updated successfully.',
      };
    } catch (error) {
      console.error('Error updating wellness partner details:', error);
      return {
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
  deleteWellnessPartnerPhoto: async (
    wellnessPartnerId: string | null,
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const wellnessPartnerDetailsTable =
        database.get<WellnessPartner>('wellness_partners'); // Replace 'users' with your actual table name
      const wellnessPartners = await wellnessPartnerDetailsTable
        .query(Q.where('id', wellnessPartnerId))
        .fetch();

      if (wellnessPartners.length === 0) {
        return {
          success: false,
          message: 'wellness Partner not found',
        };
      }

      const foundUser = wellnessPartners[0]; // Get the first user from the result

      await database.write(async () => {
        // Using update to set profileImage to null or undefined
        await foundUser.update(wellnessPartner => {
          wellnessPartner.profileImage = ''; // Or use `undefined` if that's your convention
        });
      });

      return {
        success: true,
        message: 'wellnessPartner photo deleted successfully.',
      };
    } catch (error) {
      console.error('Error deleting wellnessPartner photo:', error);
      return {
        success: false,
        message: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
  updateProfileImage: async (
    wellnessPartnerId: string | null,
    imagePath: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const wellnessPartnerDetailsTable =
        database.get<WellnessPartner>('wellness_partners');
      const wellnessPartners = await wellnessPartnerDetailsTable
        .query(Q.where('id', wellnessPartnerId))
        .fetch();

      if (wellnessPartners.length === 0) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const foundUser = wellnessPartners[0];

      await database.write(async () => {
        // Using update to modify the profileImage field
        await foundUser.update(wellnessPartner => {
          wellnessPartner.profileImage = imagePath;
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
};

export default wellnessPartnerProfileService;
