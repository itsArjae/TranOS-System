import { app, storage } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
const db = getFirestore(app);



export async function saveDiscount(
  name, value
) {
  try {
    const docRef = await addDoc(collection(db, "discount"), {
      name:name,
      value:Number(value)
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}