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

export function saveMiddleware2(
  data,
  rawGoodsId,
  date,
  time,
  weight,
  pictureFile
) {
  uploadRawGoodsPicture(data, rawGoodsId, date, time, weight, pictureFile);
}

export async function saveRawGoodsData(
  data,
  rawGoodsId,
  date,
  time,
  weight,
  pictureUrl
) {
  try {
    const docRef = await addDoc(collection(db, "rawGoods"), {
      rawGoodsName: data.rawGoodsName,
      Details: data.Details,
      Unit: weight,
      Date: date,
      UpdatedDate: date,
      Time: time,
      ImageUrl: pictureUrl,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function uploadRawGoodsPicture(
  data,
  rawGoodsId,
  date,
  time,
  weight,
  pictureFile
) {
  if (!pictureFile) {
    return saveRawGoodsData(data, rawGoodsId, date, time, weight, null);
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
        saveRawGoodsData(data, rawGoodsId, date, time, weight, pictureUrl);
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
