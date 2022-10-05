import React from "react";
import styles from "../styles/css/admin-styles/components-css/admin.auth.module.css";

export default function AdminAuth(props) {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <button>❌</button>
        <img src="/assets/admin-assets/pictures/logo.png" alt="Logo" />
      </div>
      <div className={styles.content}>
        <h4>Admin-Password:</h4>
        <input className={styles.pass__input} type="password" />
        <button>Confirm</button>
      </div>
    </div>
  );
}
