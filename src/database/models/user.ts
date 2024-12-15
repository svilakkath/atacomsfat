import {Model} from '@nozbe/watermelondb';
import {field, readonly} from '@nozbe/watermelondb/decorators';

// export type UserDetailsProps = {
//   fullName: string;
//   emailAddress: string;
//   password: string;
//   phoneNumber: string;
//   userAuthId: string;
//   profileImage: string;
// };
export default class User extends Model {
  static table = 'users';

  @field('full_name') fullName!: string;
  @field('phone_number') phoneNumber!: string;
  @field('email_address') emailAddress!: string; // unique, not null
  @field('password') password!: string; // not null
  @field('profile_image') profileImage: string | undefined;
  @field('user_auth_id') userAuthId!: string; // unique, not null
  @readonly @field('created_at') createdAt!: number;
  @readonly @field('updated_at') updatedAt!: number;
  set: any;
}
