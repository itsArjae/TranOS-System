import React from "react";
import AdminLayout from "../../../src/admin-components/adminLayout";
import styles from "../../../styles/css/admin-styles/components-css/transac.data.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { app } from "../../../src/utility/firebase";
import {
  getDatabase,
  ref,
  get,
  equalTo,
  orderByChild,
} from "firebase/database";
import { Divider } from "@mui/material";
import EditData from "../../../src/admin-components/admin.edit-beverage";
import styled from "@emotion/styled";
import {
  query,
  where,
  orderBy,
  limit,
  getFirestore,
  collection,
  onSnapshot,
  FieldPath,
  Firestore,
} from "firebase/firestore";
const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Drinks.png";
import { deleteData } from "../../../src/utility/admin-utils/beverages.firebase";
import AdminTablesTransac from "../../../src/admin-components/admin.tables.transaction-details";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminTransacData() {
  const notify = () =>
    toast.success("Data updated successfully!", {
      icon: "✔️",
      //icon: "❌",
    });

  const notifyDel = () =>
    toast.success("Data deleted successfully!", {
      icon: "✔️",
      //icon: "❌",
    });

  const router = useRouter();
  const db = getFirestore(app);
  const id = router.query.TransacID;
  const tableID = router.query.TableNum;
  const [transacData, setTransacData] = useState([]);
  const [transacDate, setTransacDate] = useState("");
  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const getTransacData = () => {
    const bevRef = collection(db, "salesDetails");

    console.log(id);

    const q = query(bevRef, where("transacID", "==", Number(id)));

    onSnapshot(q, (snapshot) => {
      let bev = [];
      snapshot.docs.forEach((doc) => {
        bev.push({ ...doc.data(), id: doc.id });
      });
      console.log("read");
      console.log(bev);
      bev.map((data) => {
        setTransacDate(data.dateBought);
      });
      setTransacData(bev);
    });
  };
  useEffect(() => {
    getTransacData();
  }, []);

  const goBack = () => {
    router.push("../admin.transactions");
  };

  var dt = new Date();
  let day = dt.getDate();
  let month = dt.getMonth() + 1;
  let monthFixed = () => {
    if (month.toString.length === 1) {
      return `0${month}`;
    } else {
      return month;
    }
  };
  let year = dt.getFullYear();
  let date = `${month}/${day}/${year}`;

  const deleteBev = (bevName) => {
    let needRender = true;
    deleteData(id, bevName, date);
    notifyDel();
    const interval = setInterval(() => {
      if (needRender == true) {
        router.push("/admin/admin.beverages");
        needRender = false;
      }
    }, 3000);
  };

  const getTotal = () => {
    let sum = 0;
    transacData.map((data) => {
      sum = sum + data.total;
    });
    return sum;
  };

  return (
    <div className={styles.Data__Container}>
      <div className={styles.Data__Box}>
        <div className={styles.Data__Box1}>
          <div className={styles.Btn__Box}>
            <button className={styles.Exit__Button} onClick={goBack}>
              ⇦
            </button>
          </div>
          <div className={styles.Data__First}>
            <h1>Order History</h1>
            <p>
              <b>Transaction ID:</b>
              <br></br> &emsp;{id}
            </p>
            <p>
              <b>Table No. :</b> {tableID}
            </p>
            <p>
              <b>Date & Time:</b>
              <br></br> &emsp; {transacDate}
            </p>
            <h2>
              Amount:
              <br></br> &emsp; ₱ &nbsp;
              {getTotal()
                .toFixed(2)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
            </h2>
          </div>
          <div className={styles.Picture}>
            <img
              src="/assets/admin-assets/pictures/logo.png"
              width={105}
              height={105}
              alt="Blue Restobar Logo"
            />
          </div>
        </div>
        <div className={styles.Data__Box2}>
          <div className={styles.Box2__Container}>
            <div className={styles.Table__Container}>
              <AdminTablesTransac
                transacData={transacData}
                tableID={tableID}
                id={id}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

AdminTransacData.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
