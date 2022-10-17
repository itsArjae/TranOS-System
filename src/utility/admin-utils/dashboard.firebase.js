import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { app, storage } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  where,
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

export function saveMiddleware2(data, menuId, pictureFile) {
  uploadMenuPicture(data, menuId, pictureFile);
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

export async function saveNotificationData(details, itemID) {
  try {
    const docRef = await addDoc(collection(db, "stockNotifications"), {
      details: details,
      itemID: itemID,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function deleteData(dataID, itemID) {
  try {
    await deleteDoc(doc(db, "stockNotifications", dataID));
    console.log("Document deleted");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

function uploadMenuPicture(data, menuId, pictureFile) {
  if (!pictureFile) {
    return saveMenuData(data, menuId, null);
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
        saveMenuData(data, menuId, pictureUrl);
      });
    }
  );
}

export function updateMeal(id, mealname, mealprice, serving) {
  const docRef = doc(db, "meals", id);
  const data = {
    MealName: mealname,
    Price: mealprice,
    Serving: serving,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}
