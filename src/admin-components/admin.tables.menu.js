import React, { useState } from "react";
import styles from "../../styles/css/admin-styles/components-css/tables.components.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { updateMenu } from "../../src/utility/admin-utils/menu.firebase";
const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Menu.png";

const headers = [
  {
    id: 1,
    header: "Picture",
  },
  {
    id: 2,
    header: "Meal Name",
  },
  {
    id: 3,
    header: "Price",
  },
  {
    id: 4,
    header: "Servings",
  },
  {
    id: 5,
    header: "Set Status as",
  },
];

export default function AdminTables(props) {
  const router = useRouter();
  const { menuData, updateData, Loading, notifyUD } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm === "") {
      return 4;
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
    .map((data) => {
      return (
        <div className={styles.Table__Data} key={data.id}>
          <div className={styles.Table__Image_Box}>
            <img
              src={data.ImageUrl ? data.ImageUrl : DefaultPic}
              alt="Image"
              className={styles.Table__Image}
            />
            <div
              className={styles.overlay}
              onClick={() => {
                viewData(data.id);
              }}
            >
              <div className={styles.text}>Click to view</div>
            </div>
          </div>
          <div className={styles.Table__Data__Box}> {data.MealName}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.Price)
              .toFixed(2)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className={styles.Table__Data__Box}>
            {data.Serving ? data.Serving : 0}
          </div>
          <div className={styles.Table__Data__Box}>
            <button
              className={styles.Table__Data_Available_Btn}
              disabled={data.Serving == 0 ? true : false}
              onClick={() => {
                getID(data.id, data.Status, data.MealName);
              }}
            >
              {data.Status == false ? "Available" : "Not Available"}
            </button>
          </div>
        </div>
      );
    });
  const pageCount = Math.ceil(menuData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const getID = (MenuId, Status, MealName) => {
    console.log("clicked");
    if (Status == true) {
      updateMenu(MenuId, false);
      updateData();
      notifyUD(MealName);
    } else {
      updateMenu(MenuId, true);
      updateData();
      notifyUD(MealName);
    }
  };

  const viewData = (id) => {
    router.push(
      {
        pathname: `../admin/meals/menu`,
        query: { MenuID: id },
      },
      "../admin/meals/menu"
    );
  };

  const Header = headers.map((heads) => {
    return (
      <div className={styles.Table__Heads_Data} key={heads.id}>
        {heads.header}
      </div>
    );
  });
  const viewLink = (link) => {
    window.open(link, "_blank");
  };

  const initialValues = {
    search: "",
  };

  const statUpdate = () => {
    menuData.map((data) => {
      if (data.Serving == 0) {
        updateMenu(data.id, false);
        updateData();
      }
      if (data.Serving > 0) {
        updateMenu(data.id, true);
        updateData();
      }
    });
    console.log("re");
  };

  useEffect(() => {
    try {
      statUpdate();
    } catch (err) {}
  }, []);

  const validationSchema = Yup.object().shape({
    search: Yup.string().min(3).required("Invalid"),
  });

  const onSubmit = (data, { resetForm }) => {
    console.log(data);
  };

  return (
    <div className={styles.Table__Container1}>
      <div className={styles.Table__Search_Box}>
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
              placeholder="Search Meal Name"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.Table__Box}>
        <div className={styles.Table__Head}>{Header}</div>
        <div className={styles.Table__Data_Container}>
          {menuData.length > 0 ? (
            DisplayItems
          ) : (
            <div className={styles.NoData}>
              <p>No Data Available</p>
            </div>
          )}
        </div>
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
