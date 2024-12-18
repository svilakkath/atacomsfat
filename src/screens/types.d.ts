export type ValidationRules = {
  required: boolean;
  validate?: (value: string) => boolean;
  message: string;
};

// ====================== Add Medicine Details Screen ====================== //
export type AddMedicineDetailsProps = {
  name: string;
  doseDetails: string;
  medicineType: string;
  medicineDuration: string;
  additionalNote: string;
  remainingNumberOfMedicine: string;
  timeOfDay: DayTimeValues[];
  dayTimeValues: Record<string, string>;
};

// ====================== Add Wellness Partner Screen ====================== //
export type AddWellnessPartnerProps = {
  fullName: string;
  phoneNumber: string;
  age: string;
  gender: string;
  profileImage?: string;
};

// ====================== Medicine Details ====================== //
export type MedicineDetailsTimingProps = {
  id: string;
  time: string;
  timeOfDay: string;
  createdAt: number;
  updatedAt: number;
  medicineId: string;
};

export type MedicineDetailsProps = {
  id: string;
  name: string;
  doseDetails: string;
  medicineType: string | undefined;
  medicineDuration: number | undefined;
  additionalNote: string | undefined;
  remainingNumberOfMedicine: number | undefined;
  wellnessPartnerId: string;
  createdAt: number;
  updatedAt: number;
  timings: MedicineDetailsTimingProps[];
};

// ====================== User Signup Screen ====================== //
export type UserSignupProps = {
  fullName: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
};

// ====================== Wellness Partner Modules ====================== //
export type ModulesProps = {
  id: number;
  title: string;
};

// ====================== Wellness Partners Listing Screen ====================== //
export type AllWellnessPartnersDetailsProps = {
  id: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  age: number;
  profileImage: string | undefined;
  userId: string;
  createdAt: number;
  updatedAt: number;
};

// ====================== Wellness Partner Profile Screen ====================== //
export type WellnessPartnerProfileProps = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  phoneNumber: string | null;
  profileImage: string | undefined;
  createdAt: number;
  updatedAt: number;
};
