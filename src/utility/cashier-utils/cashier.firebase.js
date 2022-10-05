import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { app, storage } from "../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getFirestore,
  doc,
  setDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as sref,
  getStorage,
} from "firebase/storage";
import { async } from "@firebase/util";
const db = getFirestore(app);
var ImageUrl;
var ResumeUrl;

export async function saveTransaction(
  id,
  date,
  cashier,
  total,
  tid,
  day,
  month,
  year,
  time
) {
  try {
    const docRef = await addDoc(collection(db, "transactions"), {
      transacID: id,
      dateCreated: date,
      cashierName: cashier,
      totalAmount: total,
      tableNum: tid,
      day: day,
      month: month,
      year: year,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


export async function saveItems(id, orderData, date) {
  orderData.map(async (val) => {
    try {
      const docRef = await addDoc(collection(db, "salesDetails"), {
        transacID: id,
        orderID: val.id,
        description: val.mealName,
        price: val.price,
        quantity: val.quantity,
        total: val.total,
        dateBought: date,
      });
      console.log("Document written with a ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
}

let found = true;

const getFound = () => {
  return found;
}


export async function saveNewDaily(year,month,day,total){
  try {
    const docRef = await addDoc(collection(db, "dailySales"), {
     year:year,
     day:day,
     month:month,
     total:total

    });
    console.log("Document written with ID: ", docRef.id);
    return;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
