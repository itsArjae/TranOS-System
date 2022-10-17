import React from 'react'
import SuperTodaySales from '../../src/super-admin-components/supertodaysales'
import styles from '../../styles/css/super-admin/super-dashboard.module.css'
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import {app} from '../../src/utility/firebase'
import { useState } from 'react';
import { useEffect } from 'react';
import SuperMonthlySales from '../../src/super-admin-components/supermonthlysales';
export default function SuperDashboard() {

  var dt = new Date();

  let day = dt.getDate();
  let month = dt.getMonth() + 1;
  let year = dt.getFullYear();

  const db = getFirestore(app);

  const [dailySales,setDailySales] = useState();
  const [monthlySales,setMonthlySales] = useState();
  const [yearlySales,setYearlySales] = useState();

  const getDailySales = () => {
    const saleRef = collection(db, "dailySales");
    console.log("read daily");
    const q = query(
      saleRef,
      where("day", "==", day),
      where("month", "==", month),
      where("year", "==", year)
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });
      //console.log(sale);
      sale.map((data)=>{
        setDailySales(Number(data.totalSales).toFixed(2))
      })
     
    });
  };

  const getMonthlySales = () => {
    const saleRef = collection(db, "monthlySales");
    console.log("read monthly");
    const q = query(
      saleRef,
      where("month", "==", month),
      where("year", "==", year)
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
       
      });
      sale.map((data)=>{
        setMonthlySales(Number(data.totalSales).toFixed(2))
      })

     
    });
  };

  const getYearlySales = () => {
    const saleRef = collection(db, "yearlySales");
    console.log("read yearly");
    const q = query(saleRef, where("year", "==", year));
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      sale.map((data)=>{
        setYearlySales(Number(data.totalSales).toFixed(2))
      })
    });
  };

  useEffect(() => {
    getDailySales();
    getMonthlySales();
    getYearlySales();
  }, []);
  return (
    <div className={styles.dash__container} >
      <div className={styles.sales__box} >
      <div className={styles.dash__today} >
        <h2>TODAY SALES: Php. {dailySales}</h2>
      <SuperTodaySales/>
      </div>
      <div className={styles.dash__today} >
      <h2>THIS MONTH SALES: Php. {monthlySales}</h2>
      <SuperMonthlySales/>
      </div>
      <div className={styles.dash__today} >
      <h2>THIS YEAR SALES: Php. {yearlySales}</h2>
      <SuperTodaySales/>
      </div>
      </div>

      <div className={styles.notif__box} >
      <h1>NOTIFICATION</h1>
      <div className={styles.notif__container} >
        <div className={styles.notif__message} ><div>25 Pieces of Red Horse Has been added</div><div>-arjaeiporong@gmail.com</div></div>
        <div className={styles.notif__date} > 10 / 17 / 2022 </div>
      </div>

      <button>LOAD MORE</button>
      </div>
    
    </div>
  )
}
