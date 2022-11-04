import React from "react";
import SuperTodaySales from "../../src/super-admin-components/supertodaysales";
import styles from "../../styles/css/super-admin/super-dashboard.module.css";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
  orderBy,
  limitToLast,
  limit,
} from "firebase/firestore";
import { app } from "../../src/utility/firebase";
import { useState } from "react";
import { useEffect } from "react";
import SuperMonthlySales from "../../src/super-admin-components/supermonthlysales";
import SuperAdminLayout from "../../src/super-admin-components/superAdminLayout";
import { useRouter } from "next/router";
import SuperYearlySales from "../../src/super-admin-components/superyearsales";
export default function SuperDashboard() {
  const router = useRouter();
  var dt = new Date();

  let day = dt.getDate();
  let month = dt.getMonth() + 1;
  let year = dt.getFullYear();

  const db = getFirestore(app);

  const [dailySales, setDailySales] = useState();
  const [monthlySales, setMonthlySales] = useState();
  const [yearlySales, setYearlySales] = useState();

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
      sale.map((data) => {
        setDailySales(Number(data.totalSales).toFixed(2));
      });
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
      sale.map((data) => {
        setMonthlySales(Number(data.totalSales).toFixed(2));
      });
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

      sale.map((data) => {
        setYearlySales(Number(data.totalSales).toFixed(2));
      });
    });
  };
  const [notifSize, setNotifSize] = useState(5);
  const [notif, setNotif] = useState([]);
  const getNotif = () => {
    const temp = Number(notifSize);
    setNotifSize(temp + 5);
    const saleRef = collection(db, "actionNotifications");
    console.log("read notif", temp);
    const q = query(
      saleRef,
      orderBy("timeStamp", "desc"),
      limit(Number(notifSize))
    );
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      setNotif(sale);
    });
  };

  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "SuperAdmin") {
      router.push("/sign-in");
    }
    getDailySales();
    getMonthlySales();
    getYearlySales();
    getNotif();
  }, []);
  return (
    <div className={styles.dash__container}>
      <div className={styles.sales__box}>
        <div className={styles.dash__today}>
          <h2>TODAY SALES: Php. {dailySales ? dailySales : "0"}</h2>
          <SuperTodaySales />
        </div>
        <div className={styles.dash__today}>
          <h2>THIS MONTH SALES: Php. {monthlySales}</h2>
          <SuperMonthlySales />
        </div>
        <div className={styles.dash__today}>
          <h2>THIS YEAR SALES: Php. {yearlySales}</h2>
          <SuperYearlySales />
        </div>
      </div>

      <div className={styles.notif__box}>
        <h1>Log History</h1>
        {notif.map((data) => {
          return (
            <div className={styles.notif__container} key={data.id}>
              <div className={styles.notif__message}>
                <div>{data.details}</div>
                <div>-{data.email}</div>
              </div>
              <div className={styles.notif__date}> {data.date}</div>
            </div>
          );
        })}

        <button onClick={getNotif}>LOAD MORE</button>
      </div>
    </div>
  );
}

SuperDashboard.getLayout = function getLayout(page) {
  return <SuperAdminLayout>{page}</SuperAdminLayout>;
};
