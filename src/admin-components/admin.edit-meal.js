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
import { useAuth } from "../utility/firebase";
export default function EditMeal(props) {
  const currentUser = useAuth();
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
  const newMealserving = useRef(null);
  const [changes, setChanges] = useState([]);
  const [code, setCode] = useState("");

  useEffect(() => {
    {
      mealsData.map((data) => {
        Mealname.current.value = data.MealName;
        Mealprice.current.value = data.Price;
        Mealserving.current.value = data.Serving;
        setCode(data.ItemCode);
      });
    }
  }, []);

  const reset = () => {
    changesClear();
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
    changesClear();
    Mealname.current.value = null;
    Mealprice.current.value = null;
    Mealserving.current.value = null;
  };

  const updateMealData = () => {
    let message1 = "";

    for (var i = 0; i < changes.length; i++) {
      if (changes[i].value == 1) {
        message1 = `${message1}~ Name: ${Mealname.current.value}`;
      }
      if (changes[i].value == 2) {
        message1 = `${message1}~ Price: ${Mealprice.current.value}`;
      }
      if (changes[i].value == 3) {
        message1 = `${message1}~ Quantity: +${Mealserving.current.value}`;
      }
    }

    if (newMealserving == "") {
      updateMeal(
        id,
        Mealname.current.value,
        Number(Mealprice.current.value),
        Number(Mealserving.current.value),
        date,
        message1,
        currentUser.email
      );
      notify();
    } else {
      let qty = 0;
      qty = Number(mealServing) + Number(Mealserving.current.value);
      updateMeal(
        id,
        Mealname.current.value,
        Number(Mealprice.current.value),
        Number(qty),
        date,
        message1,
        currentUser.email
      );
      notify();
    }

    clear();
  };

  const handleChanges = (temp) => {
    let found = false;

    changes.map((data) => {
      if (data.value == temp) {
        found = true;
      }
    });

    let newTemp = { value: temp };

    if (found == false) {
      setChanges([...changes, newTemp]);
    }
  };

  const changesClear = () => {
    setChanges();
  };

  return (
    <div className={styles.Outside__Container}>
      <div className={styles.Container}>
        <div className={styles.Btn__Box}>
          <button className={styles.Exit__Button} onClick={setEditDataVisible}>
            ❌
          </button>
        </div>

        <div className={styles.Form__Container}>
          <div className={styles.Employees__Form}>
            <div className={styles.Form__Header}>
              <div className={styles.Header__Top1}>UPDATE MEAL DETAILS</div>
              <div className={styles.Header__Top2}>
                Meal {code?.substring(0, 6)}...
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
                    handleChanges(1);
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
                    handleChanges(2);
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
                  ref={newMealserving}
                  onChange={(event) => {
                    setServing(event.target.value);
                    setChange(false);
                    handleChanges(3);
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
