import React, { useEffect, useRef, useState } from "react";
import Receipt from "../cashier-components/cashier.receipt";
import styles from "../../styles/css/cashier-styles/cashier.pay.module.css";
import { app } from "../utility/firebase";
import {
  saveTransaction,
  saveItems,
  saveDaily,
  deleteData,
  updateTable,
  saveData,
} from "../utility/cashier-utils/cashier.firebase";
import { collection, getDocs, getFirestore,query,where,onSnapshot } from "firebase/firestore";

export default function CashierPay(props) {
  const {
    setEditDataVisible,
    orderData,
    tid,
    total,
    misce,
    getTotal,
    getTotalFixed,
    getTotalFixed2,
  } = props;

  const db = getFirestore(app);

  var dt = new Date();
  var hours = dt.getHours();
  var minute = String(dt.getMinutes()).padStart(2, "0");

  const date = new Date();

  let day = dt.getDate();
  let month = dt.getMonth() + 1;
  let year = dt.getFullYear();

  hours = hours % 12 || 12;

  var d = new Date().toString().split(" ").splice(1, 3).join(" ");
  var t = hours + ":" + minute;
  var curMeridiem = new Date().getHours() > 12 ? "PM" : "AM";

  var dateTime = d + " " + t + " " + curMeridiem;

  const changeRef = new useRef(null);
  const [payment, setPayment] = useState(0);
  const [change, setChange] = useState(0);
  const [cashier, setCaschier] = useState("Mark");
  const [monthlyData, setMonthly] = useState([]);
  const [yearlyData, setYearly] = useState([]);

  const trID = Date.now();

  const getMonthlyData = async () => {
    const querySnapshot = await getDocs(collection(db, "monthlySales"));
    let msale = [];
    querySnapshot.forEach((doc) => {
      msale.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    setMonthly(msale);
  };
  useEffect(() => {
    getMonthlyData();
  }, []);

  const pay = (val) => {
    setPayment(Number(val));
    changeRef.current.value = Number(0)
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    let change = 0;
    change = Number(val) - Number(getSubTotal());
    if (change < 0) {
      return;
    }
    changeRef.current.value = Number(change)
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    setChange(change);
  };

  const getSubTotal = () => {
    let subtotal = getTotal() + misce;
    return subtotal;
  };

  const confirmPayment = async() => {
    saveTransaction(trID, d, cashier, getSubTotal(), tid, day, month, year);
    saveItems(trID, orderData, dateTime);
    saveDaily(year, month, day, getSubTotal());
    saveTodaySales();
  };

  const saveTodaySales = (year, month, day, total) => {
    saveNewDaily(year, month, day, total);
  }

    let foundDaily = true;
    async function saveDaily(year, month, day, total) {
    const empRef = collection(db, "dailySales");
    console.log("read");
    const q = query(
      empRef,
      where("day", "==", day),
      where("month", "==", month),
      where("year", "==", year)
    );
 onSnapshot(q, (snapshot) => {
      let daily = "";
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
     if(!data.id){
      return saveNewDaily(year, month, day, total);
     }
     else{
      foundDaily = true;
     }
  
    });

  
    
  }
  

  return (
    <div className={styles.container}>
      <div className={styles.inner__container}>
        <div className={styles.table__header}>
          <img
            src="/assets/cashier-assets/svg/cashier.pay.icon.svg"
            height={35}
            width={35}
            alt="Order Icon"
          />
          <h2>&nbsp;Table No. {tid} Payment </h2>
          <div className={styles.Btn__Box}>
            <button onClick={setEditDataVisible}>❌</button>
          </div>
        </div>
        <div className={styles.order__box}>
          <div className={styles.table__container}>
            <div className={styles.other__box}>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <label htmlFor="total">TOTAL:</label>
                  <input
                    className={styles.Form__Input}
                    type="text"
                    id="total"
                    value={total ? getTotalFixed() : getTotalFixed2()}
                    readOnly={true}
                  ></input>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <label htmlFor="cash">CASH:</label>
                  <input
                    className={styles.Form__Input}
                    type="number"
                    id="cash"
                    placeholder="0.00"
                    onChange={(e) => {
                      pay(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <label htmlFor="change">CHANGE:</label>
                  <input
                    className={styles.Form__Input}
                    type="text"
                    id="change"
                    placeholder="0.00"
                    ref={changeRef}
                    readOnly={true}
                  ></input>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <button className={styles.btn__pay} onClick={confirmPayment}>
                    PAY
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.other__container}>
            <Receipt
              orderData={orderData}
              tid={tid}
              total={total}
              dateTime={dateTime}
              misce={misce}
              getTotal={getTotal}
              change={change}
              payment={payment}
              trID={trID}
              getTotalFixed={getTotalFixed}
              getTotalFixed2={getTotalFixed2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
{
  /**try */
}
