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
import { updateBeverage } from "../utility/admin-utils/beverages.firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function EditBeverage(props) {
  const router = useRouter();
  const db = getFirestore(app);

  const { setEditDataVisible, id, beverageData, notify } = props;
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

  const [bevName, setName] = useState("");
  const [bevQty, setQty] = useState("");
  const [bevPrice, setPrice] = useState("");
  const [bevSize, setSize] = useState("");
  const [bevDetail, setDetail] = useState("");
  const [bevCategory, setCategory] = useState("");
  const [bev, setBev] = useState("");

  const [change, setChange] = useState(true);
  const [enable, setEnable] = useState(false);

  const [detail, setDetailDisable] = useState(false);

  const Bevname = useRef(null);
  const Bevqty = useRef(null);
  const Bevprice = useRef(null);
  const Bevsize = useRef(null);
  const Bevnewqty = useRef(null);
  const [changes,setChanges] = useState([]);

  useEffect(() => {
    {
      beverageData.map((data) => {
        Bevname.current.value = data.BeverageName;
        Bevqty.current.value = data.Quantity;
        Bevprice.current.value = data.Price;
        Bevsize.current.value = data.Size;
        setDetail(data.Details);
        setCategory(data.Bucket);
        //Bevdetail.current.value = data.Details;
      });

      if (Bevsize.current.value == "") {
        setDetailDisable(true);
      }
    }
  }, []);

  const reset = () => {

    // addedddddddddddddddddddddddddddd
    changesClear();
    {
      beverageData.map((data) => {
        Bevname.current.value = data.BeverageName;
        Bevqty.current.value = data.Quantity;
        Bevprice.current.value = data.Price;
        Bevsize.current.value = data.Size;
        setDetail(data.Details);
        setCategory(data.Bucket);
        //Bevdetail.current.value = data.Details;
      });
      setChange(true);
      if (Bevsize.current.value == "") {
        setDetailDisable(true);
      } else {
        setDetailDisable(false);
      }
    }
  };

  useEffect(() => {
    if (Bevsize.current.value == "") {
      setDetailDisable(true);
    }
  });

  //addeddddddddddddddddddddddddddddddd
  const clear = () => {

    Bevname.current.value = null;
    Bevqty.current.value = null;
    Bevprice.current.value = null;
    Bevsize.current.value = null;
    //Bevdetail.current.value = null;
  };

  const bucketData = () => {
    if (bevCategory == true || bevCategory == "true") {
      return true;
    } else if (bevCategory == false || bevCategory == "false") {
      return false;
    }
  };

  const updateBeverageData = () => {

//addeddddddddddddd
    let message1 = "";

    for(var i=0; i<changes.length; i++){
      if(changes[i].value == 1){
        message1 = `${message1}, Name:${Bevname.current.value}`
      }
      if(changes[i].value == 2){
        message1 = `${message1}, Price:${Bevprice.current.value}`
      }
      if(changes[i].value == 3){
        message1 = `${message1}, Quantity:+${Bevnewqty.current.value}`
      } 
      if(changes[i].value == 4){
        message1 = `${message1}, Size:${Bevsize.current.value}`
      } 
      if(changes[i].value == 5){
        message1 = `${message1}, Detail:${bevDetail}`
      }
      if(changes[i].value == 5){
        message1 = `${message1}, Category:${bevCategory}`
      } 
    }

  //addeddd

    if (Bevsize.current.value == "" && Bevnewqty == "") {
      updateBeverage(
        id,
        Bevname.current.value,
        Bevqty.current.value,
        Number(Bevprice.current.value),
        Bevsize.current.value,
        bev,
        date,
        bucketData(),
        message1
        //Bevdetail.current.value
      );
      notify();
      clear();
    } else {
      let newqty = 0;
      newqty = Number(bevQty) + Number(Bevqty.current.value);
      updateBeverage(
        id,
        Bevname.current.value,
        Number(newqty),
        Number(Bevprice.current.value),
        Bevsize.current.value,
        bevDetail,
        date,
        bucketData(),
        message1
        //Bevdetail.current.value
      );
      notify();
      clear();
    }
  };

  const handleChanges = (temp) => {
    let found =  false;

    changes.map((data)=>{
      if(data.value == temp){
        found = true
      }
    });

    let newTemp = {value:temp};

    if(found ==  false){
      setChanges([...changes,newTemp]);
    }
  }

  const changesClear = () => {
    setChanges();
  }

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
              <div className={styles.Header__Top1}>UPDATE BEVERAGE DETAILS</div>
              <div className={styles.Header__Top2}>
                Beverage {id.substring(1, 6)}...
              </div>
            </div>

            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box1}>
                <label htmlFor="beveragename">Beverage Name:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="beveragename"
                  ref={Bevname}
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
                  ref={Bevprice}
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
                <label htmlFor="quantity">Remaining Stocks:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="quantity"
                  ref={Bevqty}
                  readOnly={true}
                ></input>
              </div>

              <div className={styles.Form__Input_Box1}>
                <label htmlFor="quantity">Additonal Stocks:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="quantity"
                  ref={Bevnewqty}
                  onChange={(event) => {
                    setQty(event.target.value);
                    setChange(false);
                    handleChanges(3);
                  }}
                ></input>
              </div>
            </div>

            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box1}>
                <label htmlFor="size">Size:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="size"
                  ref={Bevsize}
                  onChange={(event) => {
                    setSize(event.target.value);
                    setChange(false);
                    handleChanges(4);
                    setDetailDisable(false);
                  }}
                ></input>
              </div>

              <div className={styles.Form__Input_Box1}>
                <label htmlFor="weight">Details:</label>
                <select
                  name="Weight"
                  id="weight"
                  disabled={detail}
                  value={bevDetail}
                  onChange={(event) => {
                    setDetail(event.target.value);
                    setChange(false);
                    handleChanges(5);
                  }}
                >
                  <option value="N/A">None</option> 
                  <option value="ml">millimeter</option>
                  <option value="L">liter</option>
                </select>
              </div>

              <div className={styles.Form__Input_Box1}>
                <label htmlFor="category">Category:</label>
                <select
                  name="Category"
                  id="category"
                  value={bevCategory}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setChange(false);
                    handleChanges(6);
                  }}
                >
                  <option value="true">Bucket</option>
                  <option value="false">Solo</option>
                </select>
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
                  updateBeverageData();
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
