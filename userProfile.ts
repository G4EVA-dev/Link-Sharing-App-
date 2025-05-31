// userProfile.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Function to save user profile
export const saveUserProfile = async (userId: string, profileData: any) => {
  try {
    await setDoc(doc(db, "users", userId), profileData);
    console.log("User profile saved successfully!");
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};
