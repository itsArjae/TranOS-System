import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { app, storage } from "../firebase";
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
import { useState } from "react";
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
  year
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

export async function saveItems(
  id,
  orderData,
  miscData,
  date,
  day,
  month,
  year
) {
  orderData.map(async (val) => {
    try {
      const docRef = await addDoc(collection(db, "salesDetails"), {
        transacID: id,
        orderID: val.id,
        description: val.itemName,
        price: val.price,
        quantity: val.quantity,
        total: val.subTotal,
        dateBought: date,
        category: "order",
        day: day,
        month: month,
        year: year,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
  saveMiscItems(id, miscData, date);
}

export async function saveMiscItems(id, miscData, date) {
  miscData.map(async (val) => {
    try {
      const docRef = await addDoc(collection(db, "salesDetails"), {
        transacID: id,
        orderID: val.id,
        description: val.itemName,
        total: val.subTotal,
        dateBought: date,
        category: "misc",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });
}

export async function deleteData(orderData, miscData) {
  orderData.map(async (val) => {
    try {
      await deleteDoc(doc(db, "orders", val.id));
      console.log("Document deleted");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  });
  miscData.map(async (val) => {
    try {
      await deleteDoc(doc(db, "orders", val.id));
      console.log("Document deleted");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  });
}

export function updateTable(id) {
  const db = getDatabase(app);
  update(ref(db, "Dine/Tables/" + id), {
    Color: "green",
    Status: true,
  });
}

export async function saveDaily(total, year, month, day) {
  try {
    const docRef = await addDoc(collection(db, "dailySales"), {
      totalSales: total,
      year: year,
      month: month,
      day: day,
      date: Number(`${year}${Date.now()}`),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function saveMonthly(total, year, month) {
  try {
    const docRef = await addDoc(collection(db, "monthlySales"), {
      totalSales: total,
      year: year,
      month: month,
      date: Number(`${year}${Date.now()}`),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function saveYearly(total, year) {
  try {
    const docRef = await addDoc(collection(db, "yearlySales"), {
      totalSales: total,
      year: year,
      date: Number(`${year}${Date.now()}`),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export function updateDaily(dailyID, total) {
  const docRef = doc(db, "dailySales", dailyID);
  const data = {
    totalSales: total,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export function updateMonthly(monthlyID, total) {
  const docRef = doc(db, "monthlySales", monthlyID);
  const data = {
    totalSales: total,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export function updateYearly(yearlyID, total) {
  const docRef = doc(db, "yearlySales", yearlyID);
  const data = {
    totalSales: total,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function voidData(orderID) {
  try {
    await deleteDoc(doc(db, "orders", orderID));
    console.log("Document deleted");
  
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}


export function servedOrders(yearlyID, total) {
  const docRef = doc(db, "orders", yearlyID);
  const data = {
    status: true,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}