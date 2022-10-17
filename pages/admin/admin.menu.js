import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.menu.module.css";
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
import AdminTablesMenu from "../../src/admin-components/admin.tables.menu";
import { saveMiddleware2 } from "../../src/utility/admin-utils/menu.firebase";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  getFirestore,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function AdminMenu() {
  const router = useRouter();
  const db = getFirestore(app);

  const [isLoading, setLoading] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [menuData, setMenuData] = useState([]); // data container
  const [categoryData, setCategoryData] = useState([]);
  const [picItem, setPicItem] = useState(); // for image
  const imageRef = useRef(null);
  const [type, setType] = useState("Appetizer");

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
      saveMiddleware2(data, menuData.length, type, picItem);
      resetForm();
      imageRef.current.value = "";
      setPicItem(null);
      const { id, MealName, Price, Image } = data;
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
    if (menuData.length === 0) {
      return 1;
    } else {
      return menuData.length + 1;
    }
  };

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

  const getCategoryData = async () => {
    const bevRef = collection(db, "menuCategory");
    const q = query(bevRef, where("category", "==", "Meal"));

    onSnapshot(q, (snapshot) => {
      let category = [];
      snapshot.docs.forEach((doc) => {
        category.push({ ...doc.data(), id: doc.id });
      });
      console.log("read");
      setCategoryData(category);
      setLoading(true);
      // bev.map((data) => {
      //   setBevName(data.BeverageName);
      //   setBevPrice(data.Price);
      // });
    });
  };

  // const getCategory = async () => {
  //   const querySnapshot = await getDocs(collection(db, "menuCategory"));
  //   let category = [];
  //   querySnapshot.forEach((doc) => {
  //     category.push({ ...doc.data(), id: doc.id });
  //   });
  //   console.log("read");
  //   setCategoryData(category);
  //   setLoading(true);
  // };
  useEffect(() => {
    try {
      getMenuData("id", "");
      //getCategory();
      getCategoryData();
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
    MealName: "",
    Price: "",
    Status: "",
    Image: "",
    id: id(),
  };

  const validationSchema = Yup.object().shape({
    MealName: Yup.string().required("Incomplete Details!"),
    Price: Yup.string().required("Incomplete Details!"),
  });

  return isLoading ? (
    <IdleTimerContainer>
      <div className={styles.Menu__Container}>
        <div className={styles.Form__Container}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form autoComplete="off" className={styles.Menu__Form}>
              <div className={styles.Form__Header}>
                <div className={styles.Header__Top1}>ADD MEALS</div>
                <div className={styles.Header__Top2}>
                  <Image
                    src="/assets/cashier-assets/svg/cashier.menu.icon.svg"
                    height={30}
                    width={30}
                    alt="User Icon"
                  />
                </div>
                <div className={styles.Header__Top3}>{date}</div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <Field
                    className={styles.Form__Input}
                    name="MealName"
                    placeholder=" Meal Name"
                  />
                  <ErrorMessage name="MealName" />
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

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box}>
                  <select
                    name="type"
                    id="type"
                    onChange={(event) => {
                      setType(event.target.value);
                    }}
                  >
                    <option value="">
                      &lt;&minus;&minus;Select Meal Type&minus;&minus;&gt;
                    </option>
                    {categoryData.map((item) => {
                      return (
                        <option key={item.id} value={item.type}>
                          {item.type}
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
                    name="Serving"
                    placeholder="Estimated Servings"
                    type="number"
                  />
                  <ErrorMessage name="Serving" />
                </div>
              </div>

              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box_File}>
                  <label htmlFor="imageFile">Image: </label>
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
          <AdminTablesMenu
            menuData={menuData}
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

AdminMenu.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
