import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { app, storage } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as sref,
  getStorage,
} from "firebase/storage";
import { useState } from "react";
import { date } from "yup";
const db = getFirestore(app);
var ImageUrl;
var ResumeUrl;

export function saveMiddleware2(
  data,
  bevId,
  bevSize,
  pictureFile,
  date,
  bucket
) {
  uploadBeveragesPicture(data, bevId, bevSize, pictureFile, date, bucket);
}

export function updateBeverageStatus(beverageID, stat) {
  const docRef = doc(db, "beverages", beverageID);
  const data = {
    Status: stat,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

function uploadBeveragesPicture(
  data,
  bevId,
  bevSize,
  pictureFile,
  date,
  bucket
) {
  if (!pictureFile) {
    return saveBeveragesData(data, bevId, bevSize, null, date, bucket);
  }

  const storageRef = sref(storage, "BeveragesFiles/" + pictureFile.name);
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        saveBeveragesData(data, bevId, bevSize, pictureUrl, date, bucket);
      });
    }
  );
}

export function updateBeverage(
  drinksId,
  bevname,
  bevqty,
  bevprice,
  bevsize,
  bevdetail,
  date,
  bucket
) {
  const docRef = doc(db, "beverages", drinksId);
  const data = {
    BeverageName: bevname,
    Quantity: bevqty,
    Price: bevprice,
    Size: bevsize,
    Details: bevdetail,
    Bucket: bucket,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
      saveNotifDataUpd(
        date,
        `${data.BeverageName} data successfully updated!`,
        "beverages",
        drinksId
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function saveBeveragesData(
  data,
  bevId,
  bevSize,
  pictureUrl,
  date,
  bucket
) {
  try {
    const docRef = await addDoc(collection(db, "beverages"), {
      BeverageName: data.BeverageName,
      Price: data.Price,
      Quantity: data.Quantity,
      Size: data.Size,
      Details: bevSize,
      Status: true,
      Bucket: bucket,
      ImageUrl: pictureUrl,
    });
    console.log("Document written with ID: ", docRef.id);
    saveNotifData(
      data,
      date,
      `${data.BeverageName} successfully added!`,
      "beverages",
      docRef.id
    );
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function deleteData(bevID, bevName, date) {
  try {
    await deleteDoc(doc(db, "beverages", bevID));
    console.log("Document deleted");
    saveNotifDataDel(
      date,
      `${bevName} successfully deleted!`,
      "beverages",
      bevID
    );
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

export async function saveNotifData(data, date, details, tblName, id) {
  const dt = new Date();
  let year = dt.getFullYear();
  try {
    const docRef = await addDoc(collection(db, "actionNotifications"), {
      date: date,
      details: details,
      itemID: id,
      tableName: tblName,
      timeStamp: Number(`${year}${Date.now()}`),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function saveNotifDataDel(date, details, tblName, id) {
  const dt = new Date();
  let year = dt.getFullYear();
  try {
    const docRef = await addDoc(collection(db, "actionNotifications"), {
      date: date,
      details: details,
      itemID: id,
      tableName: tblName,
      timeStamp: Number(`${year}${Date.now()}`),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function saveNotifDataUpd(date, details, tblName, id) {
  const dt = new Date();
  let year = dt.getFullYear();
  try {
    const docRef = await addDoc(collection(db, "actionNotifications"), {
      date: date,
      details: details,
      itemID: id,
      tableName: tblName,
      timeStamp: Number(`${year}${Date.now()}`),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
