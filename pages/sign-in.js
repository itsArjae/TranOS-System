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

export default function SignIn() {
  const router = useRouter();
  const [pos, setPos] = useState("Admin");
  const currentUser = useAuth();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required(),
    email: Yup.string().required(),
  });


  const onSubmit = async(data, resetForm) => {
          await loginUser(data.email,data.password);
          router.push('/admin/admin.employees');
  
  };

  return (
    <div className={styles.container}>
      <div className={styles.Login__Box}>
        <div className={styles.Login__Form}>
          <h1>Log In</h1>
          <select
            name="position"
            onChange={(event) => {
              setPos(event.target.value);
            }}
          >
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
            <option value="Chef">Chef</option>
          </select>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form autoComplete="off" className={styles.form}>
              <div className={styles.input__box}>
                <Field
                  name="email"
                  placeholder="email"
                  className={styles.input}
                />
                <ErrorMessage component="span" name="email" />
              </div>
              <div className={styles.input__box}>
                <Field
                  name="password"
                  type="password"
                  placeholder="password"
                  className={styles.input}
                />
                <ErrorMessage component="span" name="password" />
              </div>
              <button className={styles.submit} type="submit">
                LOGIN
              </button>
            </Form>
          </Formik>
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
