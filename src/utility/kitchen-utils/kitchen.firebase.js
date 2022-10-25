import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { addUser, app, storage } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  setDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
const db = getFirestore(app);

export function orderStatusChange(orderId, stat) {
  const docRef = doc(db, "orderQueue", orderId);
  const data = {
    status: stat,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export function orderStatusChangeServe(orderId, stat) {
  const docRef = doc(db, "orderQueue", orderId);
  const data = {
    status: stat,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteQueue(orderId){
  console.log("deleteing")
  try{
  await deleteDoc(doc(db, "orderQueue", orderId));
  console.log("Document deleted");
} catch (e) {
  console.error("Error deleting document: ", e);
}
}