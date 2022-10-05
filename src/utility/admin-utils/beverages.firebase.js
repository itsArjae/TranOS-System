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

export function saveMiddleware2(data, bevId, bevSize, pictureFile) {
  uploadBeveragesPicture(data, bevId, bevSize, pictureFile);
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

function uploadBeveragesPicture(data, bevId, bevSize, pictureFile) {
  if (!pictureFile) {
    return saveBeveragesData(data, bevId, bevSize, null);
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
        saveBeveragesData(data, bevId, bevSize, pictureUrl);
      });
    }
  );
}

export function updateBeverage(
  id,
  bevname,
  bevqty,
  bevprice,
  bevsize,
  bevdetail
) {
  const docRef = doc(db, "beverages", id);
  const data = {
    BeverageName: bevname,
    Quantity: bevqty,
    Price: bevprice,
    Size: bevsize,
    Details: bevdetail,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function saveBeveragesData(data, bevId, bevSize, pictureUrl) {
  try {
    const docRef = await addDoc(collection(db, "beverages"), {
      BeverageName: data.BeverageName,
      Price: data.Price,
      Quantity: data.Quantity,
      Size: data.Size,
      Details: bevSize,
      Status: true,
      ImageUrl: pictureUrl,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
