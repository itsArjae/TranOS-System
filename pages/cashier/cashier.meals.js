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
  "/assets/cashier-assets/pictures/Cashier-Def-Pic-Menu.png";

export default function CashierMenu() {
  const router = useRouter();
  const db = getFirestore(app);

  const [menuData, setMenuData] = useState([]);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const getMenuData = () => {
    const mealRef = collection(db, "meals");

    const q = query(mealRef, where("Status", "==", true));

    onSnapshot(q, (snapshot) => {
      let meals = [];
      snapshot.docs.forEach((doc) => {
        meals.push({ ...doc.data(), id: doc.id });
      });
      console.log("read");
      setMenuData(meals);
    });
  };
  useEffect(() => {
    getMenuData();
  }, [ignored]);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm == "") {
      return 5;
    } else {
      return menuData.length;
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
  const pageCount = Math.ceil(menuData.length / itemsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const DisplayItems = menuData
    .filter((val) => {
      if (searchTerm == "") {
        return val;
      } else if (
        val.MealName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return val;
      }
    })
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((meals) => {
      return (
        <div className={styles.mainContainer} key={meals.id}>
          <div className={styles.itemContainer}>
            <div className={styles.imgContainer}>
              <img
                src={meals.ImageUrl ? meals.ImageUrl : DefaultPicMenu}
                alt={meals.MealName}
                height={130}
              />
            </div>
            <div className={styles.contentContainer}>
              <div className={styles.Data_Info}>
                <h2>{meals.MealName}</h2>
                <p>₱ {Number(meals.Price).toFixed(2)}</p>
                <p>Servings: {meals.Serving >= 0 ? meals.Serving : 0}</p>
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
            src="/assets/cashier-assets/svg/meals.icon.svg"
            height={60}
            width={60}
            alt="Drinks Icon"
          />
          <h1>&nbsp;Meals&nbsp;</h1>
        </div>

        <div className={styles.Table__Search_Form}>
          <input
            autoComplete="off"
            name="search"
            className={styles.Table_Search_Input}
            placeholder="Search Meal Name"
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
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
CashierMenu.getLayout = function getLayout(page) {
  return <CashierLayout>{page}</CashierLayout>;
};
