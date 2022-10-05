import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { addUser, app, storage } from "../firebase";
import {
  collection,
  addDoc,
  getFirestore,
  setDoc,
  doc,
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

export function saveMiddleware(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen
) {
  uploadEmployeeResume(
    data,
    empId,
    resumeFile,
    pictureFile,
    Password,
    Username,
    defaultPass,
    pos,
    gen
  );
}
export function saveMiddleware2(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen,
  resumeUrl
) {
  uploadEmployeePicture(
    data,
    empId,
    resumeFile,
    pictureFile,
    Password,
    Username,
    defaultPass,
    pos,
    gen,
    resumeUrl
  );
}
function uploadEmployeeResume(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen
) {
  if (!resumeFile) {
    return saveMiddleware2(
      data,
      empId,
      resumeFile,
      pictureFile,
      Password,
      Username,
      defaultPass,
      pos,
      gen,
      null
    );
  }

  const storageRef = sref(
    storage,
    "EmployeesFiles/" +
      `${data.Surname}${data.FirstName}/Resume/` +
      resumeFile.name
  );
  const uploadTask = uploadBytesResumable(storageRef, resumeFile);
  console.log("resume upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((resumeUrl) => {
        saveMiddleware2(
          data,
          empId,
          resumeFile,
          pictureFile,
          Password,
          Username,
          defaultPass,
          pos,
          gen,
          resumeUrl
        );
      });
    }
  );
}

function uploadEmployeePicture(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen,
  resumeUrl
) {
  if (!pictureFile) {
    return addEmployeesData(
      data,
      empId,
      resumeFile,
      pictureFile,
      Password,
      Username,
      defaultPass,
      pos,
      gen,
      resumeUrl,
      null
    );
  }

  const storageRef = sref(
    storage,
    "EmployeesFiles/" +
      `${data.Surname}${data.FirstName}/Pictures/` +
      pictureFile.name
  );
  const uploadTask = uploadBytesResumable(storageRef, pictureFile);
  console.log("picture upload");
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((pictureUrl) => {
        addEmployeesData(
          data,
          empId,
          resumeFile,
          pictureFile,
          Password,
          Username,
          defaultPass,
          pos,
          gen,
          resumeUrl,
          pictureUrl
        );
      });
    }
  );
}

export function statusChange(empId, stat) {
  const docRef = doc(db, "employees", empId);
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

export function resetPassword(empId, pass) {
  const docRef = doc(db, "employees", empId);
  const data = {
    Password: pass,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export function updateEmployee(
  id,
  lname,
  fname,
  mname,
  empAge,
  empEmail,
  empContact,
  empAdd
) {
  const docRef = doc(db, "employees", id);
  const data = {
    Surname: lname,
    FirstName: fname,
    MiddleName: mname,
    Age: empAge,
    Email: empEmail,
    Number: empContact,
    Address: empAdd,
  };
  setDoc(docRef, data, { merge: true })
    .then((docRef) => {
      console.log("Entire Document has been updated successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

////// added

export async function addEmployeesData(
  data,
  empId,
  resumeFile,
  pictureFile,
  Password,
  Username,
  defaultPass,
  pos,
  gen,
  resumeUrl,
  pictureUrl
) {
 
 
  
  try {
    const docRef = await addDoc(collection(db, "employees"), {
      Surname: data.Surname,
      FirstName: data.FirstName,
      MiddleName: data.MiddleName,
      Age: data.Age,
      Status: true,
      Email: data.Email,
      Gender: gen,
      Position: pos,
      Address: data.Address,
      ImageUrl: pictureUrl,
      ResumeUrl: resumeUrl,
      Password: Password,
      Username:Username,
      Number: data.Number,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  
}
