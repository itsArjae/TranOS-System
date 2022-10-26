import React, { useEffect, useState } from "react";
import styles from "../styles/css/login-pages/login.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { app, loginUser, useAuth } from "../src/utility/firebase";
import { useRouter } from "next/router";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { async } from "@firebase/util";
import { sign } from "jsonwebtoken";
import { TailSpin } from "react-loader-spinner";
import { UserDocument } from "../src/misc/userdata";

export default function SignIn() {

  useEffect(()=>{
    sessionStorage.removeItem("Position");
  },[])

  const router = useRouter();
  const [pos, setPos] = useState("Admin");
  const currentUser = useAuth();
  const initialValues = {
    email: "",
    password: "",
  };
  const db = getFirestore(app);

  const [step, setStep] = useState(1);

  const onSubmit = async (password) => {
    setIsLogging(true);
    try {
      await loginUser(userInfo.Email, password);
    } catch (err) {
      handleErrorMessage("Wrong Password");
      setIsLogging(false);
      return;
    }
  if(userInfo.Position == "Admin"){
    sessionStorage.setItem("Position","Admin");
    router.push("/admin/Admin.Dashboard");
    return;
  }
  if(userInfo.Position == "Cashier"){
    sessionStorage.setItem("Position","Cashier");
    router.push("/cashier/cashier.table");
    return;
  }
  if(userInfo.Position == "SuperAdmin"){
    sessionStorage.setItem("Position","SuperAdmin");
    router.push("/super-admin/super.dashboard");
    return;
  }
  if(userInfo.Position == "Chef"){
    sessionStorage.setItem("Position","Chef");
    router.push("/kitchen/kitchen.home");
    return;
  }
  };

  const [userInfo, setUserInfo] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(true);
  const [emailExist, setEmailExist] = useState(true);
  const [email, setEmail] = useState("");
  const [errorMes, setErrorMes] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLogging,setIsLogging] = useState(false)

  const getUserInfo = async (temp) => {
    setHasLoaded(false);
    console.log("try");
    setUserInfo([]);
    try {
      const saleRef = collection(db, "employees");
      console.log("read users");
      const q = query(saleRef, where("Email", "==", temp));
      onSnapshot(q, (snapshot) => {
        let sale = [];
        let uid = "";
        snapshot.docs.forEach((doc) => {
          sale.push({ ...doc.data(), id: doc.id });
          uid = doc.id;
        });
        if (!uid) {
          handleErrorMessage("Email Doesn't Exist");
          setHasLoaded(true);
          return;
        }
        sale.map((data) => {
          setUserInfo({ Email: data.Email, Position: data.Position });
        });
        setHasLoaded(true);
      });
    } catch (err) {}
  };
  useEffect(() => {
    if (!userInfo.Email) {
      console.log("emaill", userInfo.Email);
    } else {
      console.log("the Email has changed", userInfo.Email);
      setStep(2);
      setHasError(false);
    }
  }, [userInfo]);

  const handleErrorMessage = (message) => {
    setErrorMes(message);
    setHasError(true);
  };

  const InputEmail = (props) => {
    const [temp, setTemp] = useState("");
    return hasLoaded ? (
      <div>
        <div className={styles.Input__Box}>
          <input
            placeholder="Enter Email"
            onChange={(event) => {
              setTemp(event.target.value);
            }}
          />
        </div>
        <div className={styles.Button__Box}>
          <button
            className={styles.submit1}
            onClick={() => {
              if (!temp) {
                handleErrorMessage("Please input an email");
                return;
              }
              getUserInfo(temp);
            }}
          >
            Next
          </button>
        </div>
      </div>
    ) : (
      <Loading />
    );
  };

  const back = () => {
    setStep(1);
    setUserInfo([]);
  };

  const InputPassword = () => {
    const [temp, setTemp] = useState("");
    return hasLoaded ? (
      <div className={styles.Input_Pass__Box}>
        <div className={styles.Button__Box2}>
          <button className={styles.submit1} onClick={back}>
            Back
          </button>
        </div>
        <div className={styles.Input_Pass_Content}>
          <div className={styles.Input_Pass__Credentials}>
            <b>Log in as: </b>
            {userInfo.Email}
            <br />
            <b>Position: </b>
            {userInfo.Position}
          </div>
          <div className={styles.Input1__Pass}>
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(event) => {
                setTemp(event.target.value);
              }}
            />
          </div>
          <div className={styles.Button__Box}>
            <button
              className={styles.submit1}
              onClick={() => {
                if (!temp) {
                  handleErrorMessage("Please Input a password");
                  return;
                }
                onSubmit(temp);
              }}
            >
              {
                isLogging? 'Logging In' : 'Log In'
              }
            </button>
          </div>
        </div>
      </div>
    ) : (
      <Loading />
    );
  };

  const Loading = () => {
    return (
      <div>
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.Login__Box}>
        <div className={styles.Login__Form}>
          <h2>Welcome to TranOS</h2>
          <h3>Login</h3>
          <div className={styles.Form__Box}>
            {step == 1 && hasLoaded ? (
              <InputEmail />
            ) : step == 2 && hasLoaded ? (
              <InputPassword />
            ) : (
              <Loading />
            )}
          </div>
          {hasError ? <div style={{ color: "red" }}>{errorMes}</div> : null}
        </div>
        <div className={styles.logo}>
          <img src="/assets/admin-assets/pictures/logo.png" alt="logo" />
          <div>
            <h4>
              Good Times, Chill Sounds, <br></br>
              Big Waves, GooZy Friends
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
