import React from "react";
import CashierLayout from "../../src/cashier-components/cashierLayout";
import styles from "../../styles/css/cashier-styles/cashier.menu.module.css";
import { useState, useEffect, useReducer } from "react";
import { Divider } from "@mui/material";
import ReactPaginate from "react-paginate";
import { getDatabase, ref, get, query, orderByChild } from "firebase/database";
import { app } from "../../src/utility/firebase";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  getFirestore,
  where,
  onSnapshot,
} from "firebase/firestore";
const DefaultPicMenu =
  "/assets/cashier-assets/pictures/Cashier-Def-Pic-Drinks.png";

export default function CashierDrinks() {
  const router = useRouter();
  const db = getFirestore(app);

  const [drinksData, setDrinksData] = useState([]);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const getDrinkData = () => {
    const drinkRef = collection(db, "beverages");

    const q = query(drinkRef, where("Status", "==", true));

    onSnapshot(q, (snapshot) => {
      let drinks = [];
      snapshot.docs.forEach((doc) => {
        drinks.push({ ...doc.data(), id: doc.id });
      });
      console.log("read");
      setDrinksData(drinks);
    });
  };
  useEffect(() => {
    getDrinkData();
  }, [ignored]);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm == "") {
      return 6;
    } else {
      return drinksData.length;
    }
  };
  let pageVisitedFixed = () => {
    if (searchTerm === "") {
      return pageNumber * itemsPerPage;
    } else {
      return 0;
    }
  };
  const itemsPerPage = pageCountFixed();
  const pagesVisited = pageVisitedFixed();
  const pageCount = Math.ceil(drinksData.length / itemsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const DisplayItems = drinksData
    .filter((val) => {
      if (searchTerm == "") {
        return val;
      } else if (
        val.BeverageName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      }
    })
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((drinks) => {
      return (
        <div key={drinks.id} className={styles.Data__Container}>
          <div className={styles.Data_Image}>
            <img
              src={drinks.ImageUrl ? drinks.ImageUrl : DefaultPicMenu}
              alt={drinks.BeverageName}
              height={120}
            />
          </div>
          <div className={styles.Data_Info}>
            <h2>
              {drinks.BeverageName} {drinks.Size ? drinks.Size : ""}
              {drinks.Details ? drinks.Details : ""}
            </h2>
            <p>Stock/s: {drinks.Quantity}</p>
            <p>₱{Number(drinks.Price).toFixed(2)}</p>
          </div>
        </div>
      );
    });

  return (
    <div className={styles.Cashier__Container}>
      {/*<div className={styles.Head__Container}>*/}
      <div className={styles.Cashier__Header}>
        <img
          src="/assets/admin-assets/svg/beverage.logo.svg"
          width={50}
          height={50}
          alt="Beverage Icon"
        />
        <p className={styles.Cashier_Header_Text}>DRINKS &amp; BEVERAGES</p>
      </div>
      <div className={styles.Table__Search_Form}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <input
            autoComplete="off"
            name="search"
            className={styles.Table_Search_Input}
            placeholder="Search Beverage Name"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </div>
      </div>
      {/* </div>*/}

      <Divider />
      <div className={styles.Cashier__Tab__Container}>
        <div className={styles.Container}> {DisplayItems}</div>
      </div>

      <div>
        <ReactPaginate
          nextLabel={"Next"}
          previousLabel={"Prev"}
          pageCount={pageCount}
          onPageChange={changePage}
          pageRangeDisplayed={5}
          containerClassName={styles.Pagination__Container}
          previousLinkClassName={styles.Pagination__Prev}
          nextLinkClassName={styles.Pagination__Next}
          disabledClassName={styles.paginationDisabled}
          activeClassName={styles.paginationActive}
        />
      </div>
    </div>
  );
}
CashierDrinks.getLayout = function getLayout(page) {
  return <CashierLayout>{page}</CashierLayout>;
};
