import {Database} from '@nozbe/watermelondb';
import SqliteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import MedicineDetails from './models/medicineDetails';
import MedicineTiming from './models/medicineTiming';
import User from './models/user';
import WellnessPartner from './models/wellnessPartner';
import {mySchema} from './schema';

const adapter = new SqliteAdapter({
  schema: mySchema,
});

// Initialize the database with the models
export const database = new Database({
  adapter: adapter,
  modelClasses: [User, WellnessPartner, MedicineDetails, MedicineTiming], // Add your model classes here
});
