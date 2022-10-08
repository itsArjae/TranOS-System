import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,sendPasswordResetEmail} from 'firebase/auth';
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyC6szvLEp_-PUoPTGk9C1Kea2OrYeVmGrM",
  authDomain: "tranos-819f7.firebaseapp.com",
  databaseURL: "https://tranos-819f7-default-rtdb.firebaseio.com",
  projectId: "tranos-819f7",
  storageBucket: "tranos-819f7.appspot.com",
  messagingSenderId: "260969473008",
  appId: "1:260969473008:web:98d88a54af3781bfa2b335",
  measurementId: "G-RZNHPZ8SMZ",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const auth = getAuth(app);

var secondaryAuth = initializeApp(firebaseConfig,"Secondary");
const auth2 = getAuth(secondaryAuth);

export const addUser = (email,password,position) =>{
  return createUserWithEmailAndPassword(auth2,email,password,position).then(()=>{
    console.log('created')
    signOut(auth2);
  });
}

export const useAuth = () =>{
  const [currentUser, setCurrentUser] = useState();

  useEffect(()=>{
   const unsub = onAuthStateChanged(auth,user=>{
          setCurrentUser(user)
          return unsub;
    },[])
  })
  return currentUser;
}

export function loginUser(email,password){
  return signInWithEmailAndPassword(auth,email,password);
};

export function logoutUser(){
  return signOut(auth);
};

export function resetUserPassword(email){
  return sendPasswordResetEmail(auth,email);
};