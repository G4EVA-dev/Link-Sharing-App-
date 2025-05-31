// links.ts
import { doc, setDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";

// Function to save a link
export const saveLink = async (userId: string, linkId: string, linkData: any) => {
  try {
    await setDoc(doc(db, "users", userId, "links", linkId), linkData);
    console.log("Link saved successfully!");
  } catch (error) {
    console.error("Error saving link:", error);
  }
};

// Function to get links for a user
export const getUserLinks = async (userId: string) => {
  try {
    const linksRef = collection(db, "users", userId, "links");
    const q = query(linksRef);
    const querySnapshot = await getDocs(q);
    const links = querySnapshot.docs.map((doc) => doc.data());
    console.log("User links:", links);
    return links;
  } catch (error) {
    console.error("Error retrieving links:", error);
  }
};
