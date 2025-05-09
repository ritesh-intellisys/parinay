export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  gender: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  religion: string;
  caste: string;
  subcaste?: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  motherTongue: string;
  education: string;
  occupation: string;
  income: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}