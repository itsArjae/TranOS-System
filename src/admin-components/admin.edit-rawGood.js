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
import { updateRawGoods } from "../utility/admin-utils/raw-goods.firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export default function EditRawGood(props) {
  const router = useRouter();
  const db = getFirestore(app);

  const { setEditDataVisible, id, rawGoodsData } = props;
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
  let date = monthFixed() + `/${day}/${year}`;

  const [rawGoodsName, setName] = useState("");
  const [rawGoodsDetail, setDetail] = useState("");
  const [rawGoodsUnit, setUnit] = useState("");

  const [change, setChange] = useState(true);
  const [enable, setEnable] = useState(false);

  const Rawgoodsname = useRef(null);
  const Rawgoodsdetail = useRef(null);
  const Rawgoodsunit = useRef(null);

  useEffect(() => {
    {
      rawGoodsData.map((data) => {
        Rawgoodsname.current.value = data.rawGoodsName;
        Rawgoodsdetail.current.value = data.Details;
        setUnit(data.Unit);
      });
    }
  }, []);

  const reset = () => {
    {
      rawGoodsData.map((data) => {
        Rawgoodsname.current.value = data.rawGoodsName;
        Rawgoodsdetail.current.value = data.Details;
        setUnit(data.Unit);
      });
      setChange(true);
    }
  };

  const clear = () => {
    Rawgoodsname.current.value = null;
    Rawgoodsdetail.current.value = null;
  };

  const tryy = () => {
    console.log(rawGoodsUnit);
  };

  const updateRawGoodsData = () => {
    updateRawGoods(
      id,
      Rawgoodsname.current.value,
      Rawgoodsdetail.current.value,
      rawGoodsUnit,
      date,
      time
    );
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
              <div className={styles.Header__Top1}>UPDATE RAW GOOD DETAILS</div>
              <div className={styles.Header__Top2}>
                RAW GOOD {id.substring(1, 6)}...
              </div>
            </div>
            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box1}>
                <label htmlFor="rawgoodname">Raw Good Name:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="rawgoodname"
                  ref={Rawgoodsname}
                  onChange={(event) => {
                    setName(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>
            </div>

            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box1}>
                <label htmlFor="detail">
                  Details &#40; eg. weight, count, etc.&#41;:
                </label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="detail"
                  ref={Rawgoodsdetail}
                  onChange={(event) => {
                    setDetail(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>

              <div className={styles.Form__Input_Box2}>
                <select
                  name="Weight"
                  id="Weight"
                  value={rawGoodsUnit}
                  onChange={(event) => {
                    setUnit(event.target.value);
                    setChange(false);
                  }}
                >
                  <option value="kg">kilogram</option>
                  <option value="g">gram</option>
                  <option value="ml">millimeter</option>
                  <option value="L">liter</option>
                  <option value="can/s">can/s</option>
                  <option value="pack/s">pack/s</option>
                  <option value="pcs">piece/s</option>
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
                  updateRawGoodsData();
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
