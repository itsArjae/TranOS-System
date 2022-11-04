import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react';
import { statusLoginChange } from '../src/utility/admin-utils/employees.firebase';
import { loginUser, resetUserPassword } from '../src/utility/firebase';
import styles from '../styles/css/misc/resetpass.module.css'
export default function ResetPassword() {

  const router = useRouter();

  const id = router.query.id;
  const email = router.query.email;
  const pass = router.query.password;

  useEffect(()=>{
    statusLoginChange(id);
  set();
  
  },[])

  const set = async () =>{
   
    try {
    await resetUserPassword(email);
    await loginUser(email, pass);
   
    console.log("semt");
  } catch (err) {
    console.log(err);
  }
  }
  

  return (
    <div className={styles.reset__container} >
        <div className={styles.image} >
        <img src="/assets/admin-assets/pictures/logo.png" />
        </div>
      <h1>THANK YOU{'!'} THE RESET PASSWORD LINK HAS BEEN SENT TO YOUR EMAIL</h1>
      <p>IF BY CHANCE THAT YOU DIDN'T RECEIVE THE EMAIL KINDLY REPORT TO THE ADMIN</p>
    <button onClick={()=>{router.push('/')}} >GO BACK LOGIN</button>
    </div>
  )
}
