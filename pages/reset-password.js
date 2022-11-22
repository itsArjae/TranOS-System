import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { statusLoginChange } from "../src/utility/admin-utils/employees.firebase";
import { loginUser, resetUserPassword } from "../src/utility/firebase";
import styles from "../styles/css/misc/resetpass.module.css";
import Head from "next/head";
export default function ResetPassword() {
  const router = useRouter();

  const id = router.query.id;
  const email = router.query.email;
  const pass = router.query.password;

  useEffect(() => {
    statusLoginChange(id);
    set();
  }, []);

  const set = async () => {
    try {
      await resetUserPassword(email);
      await loginUser(email, pass);

      console.log("semt");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.reset__container}>
      <Head>
        <title>TRANOS | FIRST LOG IN</title>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <div className={styles.image}>
        <img src="/assets/admin-assets/pictures/logo.png" />
      </div>
      <h1>
        Thank You! Since it&lsquo;s your first log in, a reset password
        link has been sent to your email.
      </h1>
      <p>
        If by chance that you didn&lsquo;t received the email, kindly report it
        to the admin. Thank You!
      </p>
      <button
        onClick={() => {
          router.push("/");
        }}
        className={styles.backbtn}
      >
        GO BACK LOGIN
      </button>
    </div>
  );
}
