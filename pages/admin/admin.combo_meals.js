import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.combomeal.module.css";
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
import AdminTablesBeverages from "../../src/admin-components/admin.tables.combo_meals";
import { saveMiddleware2 } from "../../src/utility/admin-utils/beverages.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function AdminBeverages() {
  const router = useRouter();
  const db = getFirestore(app);

  const [isLoading, setLoading] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [menuData, setMenuData] = useState([]);
  const [beverageData, setBeverageData] = useState([]); // data container
  const [picItem, setPicItem] = useState(); // for image
  const imageRef = useRef(null);
  const [stat, setStatus] = useState("Available");
  const [bevSize, setSize] = useState("");

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
  const onSubmit = (data, { resetForm }) => {
    setLoading(null);
    try {
      saveMiddleware2(data, beverageData.length, bevSize, picItem);
      resetForm();
      imageRef.current.value = "";
      setPicItem(null);
      const { id, BeverageName, Price, Quantity, Size, Image } = data;
      let needRender = true;
      const interval = setInterval(() => {
        if (needRender === true) {
          console.log("update");
          needRender = false;
          forceUpdate();
          setLoading(true);
        }
      }, 5000);
    } catch (err) {}
  };

  const id = () => {
    if (beverageData.length === 0) {
      return 1;
    } else {
      return beverageData.length + 1;
    }
  };

  const getBeverageData = async () => {
    const querySnapshot = await getDocs(collection(db, "beverages"));
    let beverage = [];
    querySnapshot.forEach((doc) => {
      beverage.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    setBeverageData(beverage);
    setLoading(true);
  };
  useEffect(() => {
    try {
      getBeverageData("id", "");
    } catch (err) {}
  }, [ignored]);
  //

  const getMenuData = async () => {
    const querySnapshot = await getDocs(collection(db, "meals"));
    let meals = [];
    querySnapshot.forEach((doc) => {
      meals.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    setMenuData(meals);
    setLoading(true);
  };
  useEffect(() => {
    try {
      getMenuData("id", "");
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
  let date = monthFixed() + `/${day}/${year}`;

  const initialValues = {
    BeverageName: "",
    Price: "",
    Quantity: "",
    Size: "",
    Status: "",
    Image: "",
    id: id(),
  };

  const validationSchema = Yup.object().shape({
    BeverageName: Yup.string().required("Incomplete Details!"),
    Price: Yup.string().required("Incomplete Details!"),
    Quantity: Yup.string().required("Incomplete Details!"),
  });

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.Beverages__Container}>
        <div className={styles.Form__Container}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form autoComplete="off" className={styles.Beverages__Form}>
              <div className={styles.Form__Header}>
                <div className={styles.Header__Top1}>ADD COMBO MEALS</div>
                <div className={styles.Header__Top2}>
                  <Image
                    src="/assets/admin-assets/svg/combomeal.icon.svg"
                    height={30}
                    width={30}
                    alt="beverages Icon"
                  />
                </div>
                <div className={styles.Header__Top3}>{date}</div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="ComboName"
                    placeholder=" Combo Name"
                  />
                  <ErrorMessage name="ComboName" />
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <select
                    name="beverage"
                    id="beverage"
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <option value="">
                      &lt;&minus;&minus;Select Beverage&minus;&minus;&gt;
                    </option>
                    {beverageData.map((item) => {
                      return (
                        <option
                          key={item.id}
                          value={
                            item.BeverageName + item.Size + " " + item.Details
                          }
                        >
                          {item.BeverageName + item.Size + " " + item.Details}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <select
                    name="meal"
                    id="meal"
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <option value="">
                      &lt;&minus;&minus;Select Meal&minus;&minus;&gt;
                    </option>
                    {menuData.map((item) => {
                      return (
                        <option key={item.id} value={item.MealName}>
                          {item.MealName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="Price"
                    placeholder="Price"
                    type="number"
                  />
                  <ErrorMessage name="Price" />
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
          <AdminTablesBeverages
            beverageData={beverageData}
            updateData={updateData}
            Loading={Loading}
          />
        </div>
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

AdminBeverages.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
