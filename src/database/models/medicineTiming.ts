import {Model} from '@nozbe/watermelondb';
import {field, readonly, relation} from '@nozbe/watermelondb/decorators';
import MedicineDetails from './MedicineDetails'; // Import the MedicineDetails model

export default class MedicineTiming extends Model {
  static table = 'medicine_timings'; // Table name

  @field('time_of_day') timeOfDay!: string; // e.g., Morning, Evening
  @field('time') time!: string; // e.g., 9:00 AM
  @readonly @field('created_at') createdAt!: number;
  @readonly @field('updated_at') updatedAt!: number;
  @relation('medicines_details', 'medicine_id')
  medicine!: MedicineDetails; // Foreign key to MedicinesDetails
}
