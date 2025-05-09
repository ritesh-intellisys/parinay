import { Injectable } from '@angular/core';
import { initializeApp } from '@firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc 
} from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { BehaviorSubject, Observable } from 'rxjs';

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(firebaseConfig);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);
  private storage = getStorage(this.app);

  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.getUserProfile(user.uid);
      } else {
        this.userProfileSubject.next(null);
      }
    });
  }

  async register(email: string, password: string, profileData: any): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await setDoc(doc(this.db, 'users', user.uid), {
        ...profileData,
        email,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update display name
      await updateProfile(user, {
        displayName: profileData.name
      });

      await this.getUserProfile(user.uid);
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      await this.getUserProfile(userCredential.user.uid);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.userProfileSubject.next(null);
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        this.userProfileSubject.next({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.db, 'users', userId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      await this.getUserProfile(userId);
    } catch (error) {
      throw error;
    }
  }

  async uploadProfilePhoto(userId: string, file: File): Promise<string> {
    try {
      const storageRef = ref(this.storage, `profile-photos/${userId}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update profile photo URL in Firestore
      await this.updateUserProfile(userId, { photoURL: downloadURL });
      
      return downloadURL;
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}