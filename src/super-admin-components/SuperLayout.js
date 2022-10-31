import { Divider } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import styles from '../../styles/css/super-admin/superlayout.module.css';

export default function SuperLayout({children}) {

  const router = useRouter();

 const [dashColor,setDashColor] = useState('gray');
 const [empColor,setEmpColor] = useState('');
 const [salesColor,setSalesColor] = useState('');
 const [notifColor,setNotifColor] = useState('');
 const [logoutColor,setLogoutColor] = useState('');
 
    const buttonInitialState = ()=> {
      setDashColor('');
      setEmpColor('');
      setSalesColor('')
      setNotifColor('');
      setLogoutColor('');
    }

    const changePage = (action,link) => {
      buttonInitialState();

      if(action == 1) {
        setDashColor('gray')
     //  router.push(link);
       return;
      }
      if(action == 2) {
        setEmpColor('gray')
   //    router.push(link);
       return;
      }
      if(action == 3) {
        setSalesColor('gray')
      // router.push(link);
       return;
      }
      if(action == 4) {
        setNotifColor('gray')
    //   router.push(link);
       return;
      }
    }

  return (
    <div className={styles.layout__container} >
      <Head>
        <title>TRANOS | SUPER ADMIN</title>
        <link rel="icon" href="/assets/misc/tranos.icon.png" />
      </Head>
      <div className={styles.layout__box} >
          <div className={styles.layout__header} >
            <img src='/assets/admin-assets/pictures/logo.png'/>
            <h1>SUPER ADMIN</h1>
          </div>
         <div className={styles.layout__nav} >
          <button onClick={()=>{changePage(1,'')}} style={{backgroundColor: dashColor? dashColor: "transparent"}} >DASHBOARD</button>
          <button onClick={()=>{changePage(2,'')}} style={{backgroundColor: empColor? empColor: "transparent"}} >EMPLOYEES</button>
          <button onClick={()=>{changePage(3,'')}} style={{backgroundColor: salesColor? salesColor: "transparent"}} >SALES</button>
          <button onClick={()=>{changePage(4,'')}} style={{backgroundColor: notifColor? notifColor: "transparent"}} >NOTIFICATION</button>
          <button style={{backgroundColor: logoutColor? logoutColor: "transparent"}} >LOGOUT</button>
          </div> 
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}
