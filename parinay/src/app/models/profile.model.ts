export interface Profile {
    _id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    email?: string;
    photoURL?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
    location?: string;
    religion?: string;
    caste?: string;
  }