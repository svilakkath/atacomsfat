import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    // Users Table
    tableSchema({
      name: 'users',
      columns: [
        {name: 'full_name', type: 'string'},
        {name: 'phone_number', type: 'string'},
        {name: 'email_address', type: 'string', isOptional: false}, // unique and not null
        {name: 'password', type: 'string', isOptional: false}, // not null
        {name: 'profile_image', type: 'string', isOptional: true},
        {name: 'user_auth_id', type: 'string', isOptional: false}, // unique, not null
        {name: 'created_at', type: 'number'}, // Timestamp
        {name: 'updated_at', type: 'number'}, // Timestamp
      ],
    }),

    // Wellness Partners Table
    tableSchema({
      name: 'wellness_partners',
      columns: [
        {name: 'full_name', type: 'string'},
        {name: 'phone_number', type: 'string'},
        {name: 'age', type: 'number'},
        {name: 'gender', type: 'string'},
        {name: 'profile_image', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'user_id', type: 'string'}, // Foreign key to users table
      ],
    }),

    // Medicines Details Table
    tableSchema({
      name: 'medicines_details',
      columns: [
        {name: 'name', type: 'string', isOptional: false}, // not null
        {name: 'dose_details', type: 'string', isOptional: false}, // not null
        {name: 'medicine_type', type: 'string', isOptional: true},
        {name: 'medicine_duration', type: 'number', isOptional: true}, // Duration in days
        {name: 'additional_note', type: 'string', isOptional: true},
        {
          name: 'remaining_number_of_medicine',
          type: 'number',
          isOptional: true,
        },
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'wellness_partner_id', type: 'string'}, // Foreign key to wellness_partners table
      ],
    }),

    // Medicine Timing Table
    tableSchema({
      name: 'medicine_timings',
      columns: [
        {name: 'time_of_day', type: 'string'}, // e.g., Morning, Evening
        {name: 'time', type: 'string'}, // e.g., 9:00 AM
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'medicine_id', type: 'string'}, // Foreign key to medicines_details table
      ],
    }),
  ],
});
