import React, { useEffect, useReducer, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.menus.module.css";
import AdminLayout from "../../src/admin-components/adminLayout";
import Image from "next/image";
import styled from "@emotion/styled";
import LoadingScreen from "../loading-screen";
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";

export default function AdminMenus() {
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Admin") {
      router.push("/sign-in");
    }
  }, []);

  const router = useRouter();
  const [open, setopen] = useState(false);

  const goMenu = () => {
    setopen(false);
    router.push("/admin/admin.menu");
  };

  const goDrinks = () => {
    setopen(false);
    router.push("/admin/admin.beverages");
  };

  const goCombo = () => {
    setopen(false);
    router.push("/admin/admin.combo_meals");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src="/assets/admin-assets/svg/spoonNfork.icon.svg"
          height={50}
          width={50}
          alt="Drinks Icon"
        />
        <h1>&emsp;MENU&emsp;</h1>
        <img
          src="/assets/admin-assets/svg/spoonNfork.icon.svg"
          height={50}
          width={50}
          alt="Drinks Icon"
        />
      </div>
      <div className={styles.inner__container}>
        <div className={styles.content__container} onClick={goDrinks}>
          <div className={styles.content}>
            <img
              src="/assets/admin-assets/svg/admin.drinks.icon.svg"
              height={100}
              width={100}
              alt="Drinks Icon"
            />
            <h1>DRINKS</h1>
          </div>
        </div>

        <div className={styles.content__container} onClick={goMenu}>
          <div className={styles.content}>
            <img
              src="/assets/admin-assets/svg/admin.meals.icon.svg"
              height={100}
              width={100}
              alt="Meals Icon"
            />
            <h1>MEALS</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

AdminMenus.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
