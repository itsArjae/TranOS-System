import React from "react";
import styles from "../../styles/css/admin-styles/components-css/editData.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { app } from "../utility/firebase";
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
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { updateMeal } from "../utility/admin-utils/menu.firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function EditMeal(props) {
  const router = useRouter();
  const db = getFirestore(app);

  const { setEditDataVisible, id, mealsData, notify } = props;
  const [isLoading, setLoading] = useState(false);
  // data container
  const [picItem, setPicItem] = useState(); // for image
  const [resItem, setResItem] = useState(); // for resume
  const imageRef = useRef(null);
  const resumeRef = useRef(null);
  const [pos, setPos] = useState("Cashier");
  const [gen, setGen] = useState("Male");
  const [update, forceUpdate] = useState(0);
  const imageHandler = (event) => {
    setPicItem(event.target.files[0]);
  };
  const resumeHandler = (event) => {
    setResItem(event.target.files[0]);
  };
  //backend

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

  const [mealName, setName] = useState("");
  const [mealPrice, setPrice] = useState("");
  const [mealServing, setServing] = useState("");

  const [change, setChange] = useState(true);
  const [enable, setEnable] = useState(false);

  const Mealname = useRef(null);
  const Mealprice = useRef(null);
  const Mealserving = useRef(null);

  useEffect(() => {
    {
      mealsData.map((data) => {
        Mealname.current.value = data.MealName;
        Mealprice.current.value = data.Price;
        Mealserving.current.value = data.Serving;
      });
    }
  }, []);

  const reset = () => {
    {
      mealsData.map((data) => {
        Mealname.current.value = data.MealName;
        Mealprice.current.value = data.Price;
        Mealserving.current.value = data.Serving;
      });
      setChange(true);
    }
  };

  const clear = () => {
    Mealname.current.value = null;
    Mealprice.current.value = null;
    Mealserving.current.value = null;
  };

  const updateMealData = () => {
    if (mealServing == "") {
      updateMeal(
        id,
        Mealname.current.value,
        Number(Mealprice.current.value),
        Number(Mealserving.current.value),
        date
      );
      notify();
    } else {
      let qty = 0;
      qty = Number(Mealserving.current.value) + Number(mealServing);
      updateMeal(
        id,
        Mealname.current.value,
        Number(Mealprice.current.value),
        Number(qty),
        date
      );
      notify();
    }

    clear();
  };

  return (
    <div className={styles.Outside__Container}>
      <div className={styles.Container}>
        <div className={styles.Btn__Box}>
          <div className={styles.Exit__Button}>
            <button className={styles.Exit} onClick={setEditDataVisible}>
              ❌
            </button>
          </div>
        </div>

        <div className={styles.Form__Container}>
          <div className={styles.Employees__Form}>
            <div className={styles.Form__Header}>
              <div className={styles.Header__Top1}>UPDATE MEAL DETAILS</div>
              <div className={styles.Header__Top2}>
                Meal {id.substring(1, 6)}...
              </div>
            </div>

            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box1}>
                <label htmlFor="mealname">Meal Name:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="mealname"
                  ref={Mealname}
                  onChange={(event) => {
                    setName(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>

              <div className={styles.Form__Input_Box1}>
                <label htmlFor="price">Price:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="price"
                  ref={Mealprice}
                  onChange={(event) => {
                    setPrice(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>
            </div>

            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box1}>
                <label htmlFor="rServing"> Remaining Serving/s:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="rServing"
                  ref={Mealserving}
                  readOnly={true}
                ></input>
              </div>

              <div className={styles.Form__Input_Box1}>
                <label htmlFor="aServing"> Additional Serving/s:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="aServing"
                  onChange={(event) => {
                    setServing(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>
            </div>

            <div className={styles.Form__Btn_Container}>
              <button
                className={styles.Form__Clear_Btn}
                type="button"
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={change}
                className={styles.Form__Submit_Btn}
                onClick={() => {
                  setEnable(!enable);
                  setEditDataVisible();
                  updateMealData();
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
