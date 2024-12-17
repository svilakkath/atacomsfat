import {Model} from '@nozbe/watermelondb';
import {field, readonly, relation} from '@nozbe/watermelondb/decorators';
import User from './User';

export default class WellnessPartner extends Model {
  static table = 'wellness_partners';

  @field('full_name') fullName!: string;
  @field('phone_number') phoneNumber!: string;
  @field('age') age!: number;
  @field('gender') gender!: string;
  @field('profile_image') profileImage: string | undefined;
  @readonly @field('created_at') createdAt!: number;
  @readonly @field('updated_at') updatedAt!: number;
  @relation('users', 'user_id') user!: User; // Foreign key to User table
  set: any;
}
