import React from "react";
import styles from "../../styles/css/admin-styles/components-css/editDataEmployee.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { app, resetUserPassword } from "../utility/firebase";
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
import {
  updateEmployee,
  resetPassword,
} from "../utility/admin-utils/employees.firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import bcrypt from "bcryptjs";

export default function EditEmployee(props) {
  const router = useRouter();
  const db = getFirestore(app);

  const { setEditDataVisible, id, empData, notify } = props;
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

  const [sName, setSurname] = useState("");
  const [fName, setFirstname] = useState("");
  const [mName, setMiddlename] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState("");
  const [add, setAdd] = useState("");
  const [curPass, setCurPass] = useState("");

  const [change, setChange] = useState(true);
  const [enable, setEnable] = useState(false);

  const Sname = useRef(null);
  const Fname = useRef(null);
  const Mname = useRef(null);
  const EmpAge = useRef(null);
  const EmpEmail = useRef(null);
  const EmpContact = useRef(null);
  const EmpType = useRef(null);
  const EmpAdd = useRef(null);

  useEffect(() => {
    {
      empData.map((data) => {
        Sname.current.value = data.Surname;
        Fname.current.value = data.FirstName;
        Mname.current.value = data.MiddleName;
        EmpAge.current.value = data.Age;
        EmpEmail.current.value = data.Email;
        EmpContact.current.value = data.Number;
        //EmpType.current.value = data.Position;
        EmpAdd.current.value = data.Address;
        setCurPass(data.DefaultPass);
        setType(data.Position);
      });
    }
  }, []);

  const reset = () => {
    {
      empData.map((data) => {
        Sname.current.value = data.Surname;
        Fname.current.value = data.FirstName;
        Mname.current.value = data.MiddleName;
        EmpAge.current.value = data.Age;
        EmpEmail.current.value = data.Email;
        EmpContact.current.value = data.Number;
        //EmpType.current.value = data.Position;
        EmpAdd.current.value = data.Address;
      });
      setChange(true);
    }
  };

  const clear = () => {
    Sname.current.value = null;
    Fname.current.value = null;
    Mname.current.value = null;
    EmpAge.current.value = null;
    EmpEmail.current.value = null;
    EmpContact.current.value = null;
    //EmpType.current.value = null;
    EmpAdd.current.value = null;
  };

  const updateEmployeeData = () => {
    updateEmployee(
      id,
      Sname.current.value,
      Fname.current.value,
      Mname.current.value,
      EmpAge.current.value,
      EmpEmail.current.value,
      EmpContact.current.value,
      EmpAdd.current.value
    );
    notify();
    clear();
  };

  const resetPass = async () => {
    try {
      await resetUserPassword(EmpEmail.current.value);
      console.log("semt");
    } catch (err) {
      console.log(err);
    }
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
              <div className={styles.Header__Top1}>UPDATE EMPLOYEE DETAILS</div>
              <div className={styles.Header__Top2}>
                {type} {id.substring(1, 6)}...
              </div>
            </div>
            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box}>
                <label htmlFor="surname">Surname:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="surname"
                  ref={Sname}
                  onChange={(event) => {
                    setSurname(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>

              <div className={styles.Form__Input_Box}>
                <div className={styles.Form__Input_Box}>
                  <label htmlFor="firstname">First Name:</label>
                  <input
                    className={styles.Form__Input}
                    type="text"
                    id="firstname"
                    ref={Fname}
                    onChange={(event) => {
                      setFirstname(event.target.value);
                      setChange(false);
                    }}
                  ></input>
                </div>
              </div>

              <div className={styles.Form__Input_Box}>
                <label htmlFor="middlename">Middle Name:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="middlename"
                  ref={Mname}
                  onChange={(event) => {
                    setMiddlename(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>
            </div>

            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box}>
                <label htmlFor="age">Age:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="age"
                  ref={EmpAge}
                  onChange={(event) => {
                    setAge(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>

              <div className={styles.Form__Input_Box}>
                <label htmlFor="email">Email:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="email"
                  readOnly={true}
                  ref={EmpEmail}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>

              <div className={styles.Form__Input_Box}>
                <label htmlFor="contact">Contact:</label>
                <input
                  className={styles.Form__Input}
                  type="text"
                  id="contact"
                  ref={EmpContact}
                  onChange={(event) => {
                    setContact(event.target.value);
                    setChange(false);
                  }}
                ></input>
              </div>
            </div>

            <div className={styles.Form__Input_Container}>
              <div className={styles.Form__Input_Box1}>
                <label htmlFor="position">Position:</label>
                <select
                  name="Position"
                  id="position"
                  disabled={true}
                  /*onChange={(event) => {
                      setPos(event.target.value);
                    }}*/
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Chef">Chef</option>
                </select>
              </div>

              <div className={styles.Form__Input_Box1}>
                <label htmlFor="address">Address:</label>
                <input
                  className={styles.Form__Input_Email}
                  type="text"
                  id="address"
                  ref={EmpAdd}
                  onChange={(event) => {
                    setAdd(event.target.value);
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
                  updateEmployeeData();
                }}
              >
                Update
              </button>
              <button
                type="submit"
                className={styles.Form__Reset_Btn}
                onClick={resetPass}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
