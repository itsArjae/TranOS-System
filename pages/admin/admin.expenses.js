import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.expenses.module.css";
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
import AdminExpensesTable from "../../src/admin-components/admin.tables.expenses";
import { saveMiddleware2 } from "../../src/utility/admin-utils/expenses.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import { collection, getDocs, getFirestore } from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminExpenses() {
  const notify = () =>
    toast.success(`Expenses successfully added!`, {
      icon: "✔️",
      //icon: "❌",
    });

  const router = useRouter();
  const db = getFirestore(app);

  const [isLoading, setLoading] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [expensesData, setExpensesData] = useState([]); // data container
  const [picItem, setPicItem] = useState(); // for image
  const imageRef = useRef(null);
  const [weight, setWeight] = useState("kg");

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

  const imageHandler = (event) => {
    setPicItem(event.target.files[0]);
  };
  const resumeHandler = (event) => {
    setResItem(event.target.files[0]);
  };

  //backend
  const id = () => {
    if (expensesData.length === 0) {
      return 1;
    } else {
      return expensesData.length + 1;
    }
  };

  const getExpensesData = async () => {
    const querySnapshot = await getDocs(collection(db, "expenses"));
    let expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    setExpensesData(expenses);
    setLoading(true);
  };
  useEffect(() => {
    try {
      getExpensesData("id", "");
    } catch (err) {}
  }, []);
  //

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  let time = formatAMPM(new Date());

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

  const initialValues = {
    remarks: "",
    amount: "",
    Image: "",
    id: id(),
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required("Incomplete Details!"),
  });

  const onSubmit = (data, { resetForm }) => {
    let needRender = true;
    setLoading(null);
    saveMiddleware2(data, expensesData.length, date, time, picItem);
    resetForm();
    imageRef.current.value = "";
    setPicItem(null);
    const { id, remarks, amount, Image } = data;

    const interval = setInterval(() => {
      if (needRender === true) {
        notify();
        renderEmp();
        needRender = false;
      }
    }, 5000);
  };

  const renderEmp = async () => {
    const querySnapshot = await getDocs(collection(db, "meals"));
    let emp = [];
    querySnapshot.forEach((doc) => {
      emp.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    setExpensesData(emp);
    setLoading(true);
  };

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.expenses__Container}>
        <div className={styles.Form__Container}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form autoComplete="off" className={styles.expenses__Form}>
              <div className={styles.Form__Header}>
                <div className={styles.Header__Top1}>ADD EXPENSES</div>
                <div className={styles.Header__Top2}>
                  <Image
                    src="/assets/admin-assets/svg/admin.expenses.icon.svg"
                    height={30}
                    width={30}
                    alt="Expenses Icon"
                  />
                </div>
                <div className={styles.Header__Top3}>{date}</div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="remarks"
                    placeholder="Remarks"
                  />
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="amount"
                    placeholder="Amount"
                    type="number"
                    required={true}
                  />
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box_File}>
                  <label htmlFor="imageFile">Image: </label> <br></br>
                  <input
                    className={styles.Form__Input_File}
                    name="Image"
                    type="file"
                    id="imageFile"
                    onChange={imageHandler}
                    ref={imageRef}
                  />
                </div>
              </div>

              <div className={styles.Form__Btn_Container}>
                <button
                  className={styles.Form__Clear_Btn}
                  type="button"
                  onClick={() => {
                    console.log(initialValues);
                  }}
                >
                  Clear
                </button>
                <button type="submit" className={styles.Form__Submit_Btn}>
                  Submit
                </button>
              </div>
            </Form>
          </Formik>
        </div>
        <div className={styles.Table__Container}>
          <AdminExpensesTable expensesData={expensesData} />
        </div>
        <ToastContainer />
      </div>
    </IdleTimerContainer>
  ) : (
    <OuterBox>
      {" "}
      <InnerBox>
        <LoadingScreen />
      </InnerBox>{" "}
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

AdminExpenses.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
