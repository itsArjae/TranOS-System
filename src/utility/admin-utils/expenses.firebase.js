import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { app, storage } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as sref,
  getStorage,
} from "firebase/storage";
import { useState } from "react";
const db = getFirestore(app);
var ImageUrl;
var ResumeUrl;

export function saveMiddleware2(data, expensesID, date, time, pictureFile) {
  uploadRawGoodsPicture(data, expensesID, date, time, pictureFile);
}

export async function saveExpensesData(
  data,
  expensesID,
  date,
  time,
  pictureUrl
) {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      remarks: data.remarks,
      amount: data.amount,
      date: date,
      time: time,
      ImageUrl: pictureUrl,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function uploadRawGoodsPicture(data, expensesID, date, time, pictureFile) {
  if (!pictureFile) {
    return saveExpensesData(data, expensesID, date, time, null);
  }

  const storageRef = sref(storage, "RawGoodsFiles/" + pictureFile.name);
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        saveExpensesData(data, expensesID, date, time, pictureUrl);
      });
    }
  );
}

export function updateRawGoods(id, rawgoodsname, detail, unit, date, time) {
  const docRef = doc(db, "rawGoods", id);
  const data = {
    rawGoodsName: rawgoodsname,
    Details: detail,
    Unit: unit,
    UpdatedDate: date,
    Time: time,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}
