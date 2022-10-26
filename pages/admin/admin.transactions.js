import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.transac.module.css";
import AdminLayout from "../../src/admin-components/adminLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { app } from "../../src/utility/firebase";
import * as Yup from "yup";
import Image from "next/image";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import AdminTablesTransaction from "../../src/admin-components/admin.tables.transactions";
import { saveMiddleware2 } from "../../src/utility/admin-utils/menu.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function AdminMenu() {
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Admin") {
      router.push("/sign-in");
    }
  }, []);

  const router = useRouter();
  const db = getFirestore(app);

  const [isLoading, setLoading] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [transacData, setTransactData] = useState([]); // data container
  const [picItem, setPicItem] = useState(); // for image
  const imageRef = useRef(null);
  const [stat, setStatus] = useState("Available");

  function Loading() {
    setLoading(!isLoading);
  }

  const updateData = () => {
    let needRender = true;
    const interval = setInterval(() => {
      if (needRender === true) {
        console.log("update");
        needRender = false;
        forceUpdate();
        setLoading(true);
      }
    }, 3000);
  };

  const id = () => {
    if (transacData.length === 0) {
      return 1;
    } else {
      return transacData.length + 1;
    }
  };

  const getTransactionData = async () => {
    const saleRef = collection(db, "transactions");
    console.log("read");
    const q = query(saleRef, orderBy("dateCreated", "desc"));
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });
      setTransactData(sale);
      setLoading(true);
    });
  };

  useEffect(() => {
    try {
      getTransactionData("id", "");
    } catch (err) {}
  }, [ignored]);
  //

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

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.transac__Container}>
        <div className={styles.header}>
          <Image
            src="/assets/admin-assets/svg/admin.transaction.icon.svg"
            width={50}
            height={50}
            alt="transactions icon"
          />
          <p>Transactions</p>
        </div>
        <div className={styles.Table__Container}>
          <AdminTablesTransaction
            transacData={transacData}
            updateData={updateData}
            Loading={Loading}
          />
        </div>
      </div>
    </IdleTimerContainer>
  ) : (
    <OuterBox>
      <InnerBox>
        <LoadingScreen />
      </InnerBox>
    </OuterBox>
  );
}
const OuterBox = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  backdrop-filter: blur(10px);
  display: flex;
  alignitems: center;
  justifycontent: center;
`;

const InnerBox = styled.div`
  margin: auto;
`;

AdminMenu.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
