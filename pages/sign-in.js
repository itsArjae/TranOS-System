import React, { useEffect, useState } from "react";
import styles from "../styles/css/login-pages/login.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { app, loginUser, useAuth } from "../src/utility/firebase";
import { useRouter } from "next/router";
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
import bcrypt from "bcryptjs";
import { async } from "@firebase/util";
import { sign } from "jsonwebtoken";
import { TailSpin } from "react-loader-spinner";

export default function SignIn() {
  const router = useRouter();
  const [pos, setPos] = useState("Admin");
  const currentUser = useAuth();
  const initialValues = {
    email: "",
    password: "",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);

  const validationSchema = Yup.object().shape({
    password: Yup.string().required(),
    email: Yup.string().required(),
  });

  const onSubmit = async (data, resetForm) => {
    await loginUser(data.email, data.password);
    router.push("/admin/admin.employees");
  };


  const [hasLoaded,setHasLoaded] = useState(true);
  const [emailExist,setEmailExist] = useState(true);
  const InputEmail = () => {
    return hasLoaded?
     <div>
        <div className={styles.Input__Box} >
            <input placeholder="Enter Email" />
        </div>
        <div className={styles.Button__Box} >
          <button>Next</button>
        </div>
    </div>: 
    <Loading/>;
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
          <h2>Login</h2>
          <div className={styles.Form__Box} >
            <InputEmail />
          </div>
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
