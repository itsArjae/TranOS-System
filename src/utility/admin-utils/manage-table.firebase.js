import { getDatabase, ref, set, child, get } from "firebase/database";
import {app,storage} from '../firebase';
import { getDownloadURL, uploadBytesResumable, ref as sref,  getStorage,} from "firebase/storage";
import { useState } from "react";
import {
  collection,
  addDoc,
  getFirestore,
  setDoc,
  doc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  orderBy
} from "firebase/firestore";

export function AddTables(TableId,data){
  console.log("renderData");
  
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/" + TableId), {
    id: TableId,
    Color:data.Color,
    Category:data.Category,
    x:0,
    y:0,
    Status:true
  });
  console.log("success");
 // AddTables2(TableId,data);
}

async function AddTables2(TableId,data){
  console.log("renderData2");
  const db = getFirestore(app);
  
    const docRef = await addDoc(collection(db, "tables"), {
      TableID: TableId,
      Color:data.Color,
      Category:data.Category,
      x:0,
      y:0,
      Status:true
    });
    console.log("Document written with ID: ", docRef.id);

}




export function changeTablePos(TableId,x,y,color,category,status){
  console.log(TableId+" "+x,+" "+y+" "+color+" "+category+" "+status);
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/" + TableId), {
    id: TableId,
    Color:color,
    Category:category,
    x:x,
    y:y,
    Status:status
  });
  console.log("success");
}

// change position combine realtime and firestore 
export async function changeTablePos2(TableId,x,y,color,category,status){
  const db = getFirestore(app);

  const empRef = collection(db, "tables");

  const q = query(empRef, where("TableID", "==", TableId));
  onSnapshot(q, (snapshot) => {
    let id = '';
   snapshot.docs.forEach((doc) => {
     id = doc.id;
   });
   console.log(id);

   const docRef = doc(db, "tables", id);
   const data = {
    Color:color,
    Category:category,
    x:x,
    y:y,
    Status:status
   };
   setDoc(docRef, data, { merge: true })
     .then((docRef) => {
       console.log("Entire Document has been updated successfully");
     })
     .catch((error) => {
       console.log(error);
     });

 });


  
}

export function deleteTables(id){
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/" + id), {
    id: null,
    Color:null,
    Category:null,
    x:null,
    y:null,
    Status:null
  });
}

export function deleteTables2(id){
  const db = getFirestore();

  const empRef = collection(db, "tables");

  const q = query(empRef, where("TableID", "==", id),orderBy('Category'));
  onSnapshot(q, (snapshot) => {
    let docid = '';
   snapshot.docs.forEach((doc) => {
     docid = doc.id;
   });
   console.log("delete",id);
   const docRef = doc(db, "tables", docid);

   deleteDoc(docRef)
   .then(() => {
       console.log("Entire Document has been deleted successfully.")
   })
   .catch(error => {
       console.log(error);
   })
   

 });



const docRef = doc(db, "tables", "yftq9RGp4jWNSyBZ1D6L");

deleteDoc(docRef)
.then(() => {
    console.log("Entire Document has been deleted successfully.")
})
.catch(error => {
    console.log(error);
})
}

export function clearTables(){
  const db = getDatabase(app);
  set(ref(db, "Dine/Tables/"), {
    id: null,
  });
}