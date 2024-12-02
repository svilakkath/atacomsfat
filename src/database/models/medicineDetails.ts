import {Model} from '@nozbe/watermelondb';
import {field, readonly, relation} from '@nozbe/watermelondb/decorators';
import WellnessPartner from './WellnessPartner'; // Import the WellnessPartner model

export default class MedicineDetails extends Model {
  static table = 'medicines_details'; // Table name

  @field('name') name!: string;
  @field('dose_details') doseDetails!: string;
  @field('medicine_type') medicineType: string | undefined;
  @field('medicine_duration') medicineDuration: number | undefined; // Duration in days
  @field('additional_note') additionalNote: string | undefined;
  @field('remaining_number_of_medicine') remainingNumberOfMedicine:
    | number
    | undefined;
  @readonly @field('created_at') createdAt!: number;
  @readonly @field('updated_at') updatedAt!: number;

  @relation('wellness_partners', 'wellness_partner_id')
  wellnessPartner!: WellnessPartner; // Foreign key to WellnessPartner
}
