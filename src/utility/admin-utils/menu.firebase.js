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
const db = getFirestore(app);
var ImageUrl;
var ResumeUrl;

export function saveMiddleware2(data, menuId, pictureFile, date) {
  uploadMenuPicture(data, menuId, pictureFile, date);
}

export function updateMenu(mealID, stat) {
  const docRef = doc(db, "meals", mealID);
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

export async function saveMenuData(data, menuId, pictureUrl, date) {
  const noServing = () => {
    let serve = 0;
    if (data.Serving == "") {
      return serve;
    } else {
      return Number(data.Serving);
    }
  };
  const pCode = Date.now();
  try {
    const docRef = await addDoc(collection(db, "meals"), {
      MealName: data.MealName,
      Price: Number(data.Price),
      Serving: noServing(),
      Status: true,
      ImageUrl: pictureUrl,
      ItemCode: `M${pCode}`,
    });
    console.log("Document written with ID: ", docRef.id);
    saveNotifData(
      data,
      date,
      `${data.MealName} successfully added!`,
      "meals",
      docRef.id
    );
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function uploadMenuPicture(data, menuId, pictureFile, date) {
  if (!pictureFile) {
    return saveMenuData(data, menuId, null, date);
  }

  const storageRef = sref(storage, "MenuFiles/" + pictureFile.name);
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        saveMenuData(data, menuId, pictureUrl, date);
      });
    }
  );
}

export function updateMeal(
  id,
  mealname,
  mealprice,
  serving,
  date,
  message,
  email
) {
  const docRef = doc(db, "meals", id);
  const data = {
    MealName: mealname,
    Price: Number(mealprice),
    Serving: Number(serving),
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
      saveNotifDataUpd(
        date,
        `${mealname} [${message}] data successfully updated!`,
        "MealName",
        id,
        email
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteData(mealID, mealName, date) {
  try {
    await deleteDoc(doc(db, "meals", mealID));
    console.log("Document deleted");
    saveNotifDataDel(
      date,
      `${mealName} successfully deleted!`,
      "meals",
      mealID
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

export async function saveNotifDataUpd(date, details, tblName, id, email) {
  const dt = new Date();
  let year = dt.getFullYear();
  try {
    const docRef = await addDoc(collection(db, "actionNotifications"), {
      date: date,
      details: details,
      itemID: id,
      tableName: tblName,
      timeStamp: Number(`${year}${Date.now()}`),
      email: email,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
