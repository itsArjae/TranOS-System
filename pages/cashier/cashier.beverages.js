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
      return 5;
    } else {
      return 5;
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
        <div className={styles.mainContainer} key={drinks.id}>
          <div className={styles.itemContainer}>
            <div className={styles.imgContainer}>
              <img
                src={drinks.ImageUrl ? drinks.ImageUrl : DefaultPicMenu}
                alt={drinks.BeverageName}
                height={130}
              />
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.Data_Info}>
                <h2>
                  {drinks.BeverageName} {drinks.Size}
                  {drinks.Details}
                </h2>
                <p>₱ {Number(drinks.Price).toFixed(2)}</p>
                <p>Available: {drinks.Quantity}</p>
                <p>
                  {drinks.Bucket == true
                    ? drinks.Quantity > 7
                      ? "Bucket: Available"
                      : "Bucket: Not Available"
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    });

  return (
    <div className={styles.Cashier__Container}>
      <div className={styles.Head__Container}>
        <div className={styles.Cashier__Header}>
          <img
            src="/assets/cashier-assets/svg/beverage.icon.svg"
            width={60}
            height={60}
            alt="Beverage Icon"
          />
          <h1>&nbsp;Beverages&nbsp;</h1>
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
      </div>

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
