import React, { useEffect, useRef, useState } from "react";
import Receipt from "../cashier-components/cashier.receipt";
import styles from "../../styles/css/cashier-styles/cashier.pay.module.css";
import { app } from "../utility/firebase";
import {
  saveTransaction,
  saveItems,
  deleteData,
  updateTable,
  saveDaily,
  saveMonthly,
  saveYearly,
  updateDaily,
  updateMonthly,
  updateYearly,
} from "../utility/cashier-utils/cashier.firebase";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { logoutUser, useAuth } from "../utility/firebase";
import { useReactToPrint } from "react-to-print";
export default function CashierPay(props) {
  const router = useRouter();
  const currentUser = useAuth();
  const {
    setEditDataVisible,
    orderData,
    tid,
    total,
    misce,
    getTotal,
    getTotalFixed,
    getTotalFixed2,
    successPayment,
    failPayment,
    cat,
    getGrandTotal1,
    getGTotalFixed2,
    miscData,
    charges,
    getTotalMisc,
    getTotalFixedMisc,
    getTotalFixedMisc2,
  } = props;


  const [disData, setDisData] = useState('');
  const [disValue,setDisValue] = useState(0);
  const getDiscount = async () => {
    
    const querySnapshot = await getDocs(collection(db, "discount"));
    let emp = [];
    querySnapshot.forEach((doc) => {
      emp.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    emp.map((data)=>{
      setDisValue(data.value);
      setDisData(data.id);
    })
  };

  const getGrandTotal = () =>{
    if(isDiscount == true){
      return Number(getGrandTotal1()) - ( Number(getGrandTotal1()) * (Number(disValue) / 100));
    }
    else{
      Number(getGrandTotal1())
    }
  }

  const getDiscountValue = () => {
    return Number(getGrandTotal1()) - ( Number(getGrandTotal1()) * (Number(disValue) / 100));
  }

  const noDiscountValue = () => {
    return Number(getGrandTotal1());
  }

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

  const changeRef = new useRef(0);
  const cashRef = new useRef(null);
  const [payment, setPayment] = useState(0);
  const [change, setChange] = useState(0);
  const [cashier, setCashier] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);

  const trID = Date.now();

  const pay = (val) => {
    setPayment(Number(val));
    console.log("pay",val)
    changeRef.current.value = Number(0)
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    let change = 0;
    
    if(isDiscount == true){
      change = Number(val) - (Number(getGrandTotal1()) - ( Number(getGrandTotal1()) * (Number(disValue) / 100)));
    
    }
    else{
      change = Number(val) - Number(getGrandTotal1());
    }
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
    if(isDiscount){
      return subtotal / 100;
    }
    else{
      return subtotal;
    }
    
  };

  const [dSales, setDSales] = useState();
  const [mSales, setMSales] = useState();
  const [ySales, setYSales] = useState();
  const [dSalesID, setDSalesID] = useState();
  const [mSalesID, setMSalesID] = useState();
  const [ySalesID, setYSalesID] = useState();
  const [isPaying, setIsPaying] = useState(false);

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

      sale.map((data) => {
        setDSales(data.totalSales);
        setDSalesID(data.id);
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
        setMSales(data.totalSales);
        setMSalesID(data.id);
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
        setYSales(data.totalSales);
        setYSalesID(data.id);
      });
    });
  };

  useEffect(() => {
    getDailySales();
    getMonthlySales();
    getYearlySales();
    getDiscount();
  }, []);

  const confirmPayment = () => {
    if (payment < getGrandTotal()) {
      console.log("Kulang"); //MAY LALABAS
      failPayment();
      return;
    }
    setBtnDisable(true);
    if (!dSales) {
      if(isDiscount == true){
        saveDaily(getDiscountValue(), year, month, day);
      }
      else{
        saveDaily(noDiscountValue(), year, month, day);
      }
      
    } else {

      let sum = 0;
      if(isDiscount == true){
        sum = Number(dSales) + Number(getDiscountValue());
      }
      else{
        sum = Number(dSales) + Number(noDiscountValue());
      }
      updateDaily(dSalesID, sum);
    }


    if (!mSales) {

      if(isDiscount == true){
        saveMonthly(getDiscountValue(), year, month);
      }
      else{
        saveMonthly(noDiscountValue(), year, month);
      }
    } else {
      let sum = 0;
      if(isDiscount == true){
        sum = Number(mSales) + Number(getDiscountValue());
      }
      else{
        sum = Number(mSales) + Number(noDiscountValue());
      }
      updateMonthly(mSalesID, sum);
    }
    if (!ySales) {
      if(isDiscount == true){
        saveYearly(getDiscountValue(), year);
      }
      else{
        saveYearly(noDiscountValue(), year);
      }
    } else {
      let sum = 0;
      if(isDiscount == true){
        sum = Number(ySales) + Number(getDiscountValue());
      }
      else{
        sum = Number(ySales) + Number(noDiscountValue());
      }
      updateYearly(ySalesID, sum);
    }
    if(isDiscount == true){
      saveTransaction(
        trID,
        d,
        currentUser.email,
        getDiscountValue(),
        tid,
        day,
        month,
        year
      );
    }
    else{
      saveTransaction(
        trID,
        d,
        currentUser.email,
        noDiscountValue(),
        tid,
        day,
        month,
        year
      );
    }
   
    saveItems(trID, orderData, miscData, dateTime, day, month, year);
    setIsPaying(true);
    cashRef.current.value = Number(0).toFixed(2);
    changeRef.current.value = Number(0).toFixed(2);
    successPayment();
  };

  const proceed = () => {
    deleteData(orderData, miscData);
    updateTable(tid);
    router.push("/cashier/cashier.table");
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Result",
    // onAfterPrint:()=>alert('success')
  });

  const [isDiscount,setIsDiscount] = useState(false);
  const handleDisc = () => {
    setIsDiscount(!isDiscount);
    console.log(isDiscount)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner__container}>
        <div className={styles.table__header}>
          <div className={styles.table__header1}>
            <div className={styles.Btn__Text1}>
              <img
                src="/assets/cashier-assets/svg/cashier.pay.icon.svg"
                height={35}
                width={35}
                alt="Pay Icon"
              />
              <h2>&nbsp;Payment</h2>
            </div>

            <div className={styles.Btn__Text}>
              <h2>
                {cat} {tid}
              </h2>
            </div>

            <div className={styles.Btn__Box}>
              <button
                className={styles.Exit__Button}
                onClick={setEditDataVisible}
                disabled={btnDisable}
              >
                ❌
              </button>
            </div>
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
                    value={isPaying ? Number(0).toFixed(2) : isDiscount? Number(getGrandTotal()).toFixed(2): getGTotalFixed2()}
                    readOnly={true}
                    disabled={btnDisable}
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
                    ref={cashRef}
                    disabled={btnDisable}
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
                    disabled={btnDisable}
                  ></input>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div style={{display:"flex",flexDirection:"row"}} >
                  
                <input type="checkbox" onChange={handleDisc} /> <div>Discount</div> 
                 
                </div>
                <div className={styles.Form__Input_Box1}>
                  {btnDisable ? (
                    <button className={styles.btn__pay1} onClick={proceed}>
                      PROCEED
                    </button>
                  ) : (
                    <button
                      className={styles.btn__pay}
                      onClick={confirmPayment}
                    >
                      PAY
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div red={componentRef} className={styles.other__container}>
            {btnDisable ? (
              <Receipt
                orderData={orderData}
                tid={tid}
                total={total}
                dateTime={dateTime}
                misce={misce}
                getTotal={ isDiscount? getDiscountValue :  getTotal}
                change={change}
                payment={payment}
                trID={trID}
                getTotalFixed={getTotalFixed}
                getTotalFixed2={getTotalFixed2}
                getGrandTotal={getGrandTotal}
                getGTotalFixed2={getGTotalFixed2}
                miscData={miscData}
                cat={cat}
                charges={charges}
                getTotalMisc={getTotalMisc}
                getTotalFixedMisc={getTotalFixedMisc}
                getTotalFixedMisc2={getTotalFixedMisc2}
                disValue={disValue}
                isDiscount={isDiscount}
                noDiscountValue={noDiscountValue}
                
              />
            ) : (
              <div className={styles.ImageCon}>
                <img
                  src="/assets/admin-assets/pictures/logo.png"
                  height={200}
                  width={200}
                  alt="beverages Icon"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
