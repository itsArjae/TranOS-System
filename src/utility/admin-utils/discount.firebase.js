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


export async function deleteDiscount(disId) {
  try {
    await deleteDoc(doc(db, "discount", disId));
    console.log("Document deleted");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}