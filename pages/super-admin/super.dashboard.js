import React, { useEffect, useState } from 'react'
import SuperLayout from '../../src/super-admin-components/SuperLayout'
import styles from '../../styles/css/super-admin/super-dashboard.module.css'
import {
  collection,
  getDocs,
  getFirestore,
  query,
  onSnapshot,
  where,
  orderBy,
  limitToLast
} from "firebase/firestore";
import { app } from "../../src/utility/firebase";
import SuperTodaySales from '../../src/super-admin-components/super.todaysales';
export default function SuperDashboard() {
  const db = getFirestore(app);
 const [dailySales,setDailySales] = useState([]);

 const getDailySales = () => {
  const saleRef = collection(db, "dailySales");
  console.log("read daily");
  const q = query(saleRef, orderBy("date"),limitToLast(30));
  onSnapshot(q, (snapshot) => {
    let sale = [];
    snapshot.docs.forEach((doc) => {
      sale.push({ ...doc.data(), id: doc.id });
    });
    setDailySales(sale);
   
  });
};

useEffect(()=>{
getDailySales();
},[])

  return (
    <div className={styles.dash__container} >
        <div className={styles.sales__box} >
          <div className={styles.dash__today} >
            <h4>Today Sales: 1000</h4>
        <SuperTodaySales dailySales={dailySales} />
          </div>
          <div className={styles.dash__today} >
            <h4>Monthly Sales: 1000</h4>
        <SuperTodaySales dailySales={dailySales} />
          </div>
          <div className={styles.dash__today} >
            <h4>Yearly Sales: 1000</h4>
        <SuperTodaySales dailySales={dailySales} />
          </div>
        </div>
        <div className={styles.notif__box} >
          <h1>NOTIFICATION</h1>
        </div>
    </div>
  )
}

SuperDashboard.getLayout = function getLayout(page) {
  return <SuperLayout> {page}</SuperLayout>;
};
