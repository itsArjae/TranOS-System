import React, { useState } from "react";
import styles from "../../styles/css/admin-styles/components-css/tables.components.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { updateBeverageStatus } from "../utility/admin-utils/beverages.firebase";
import { CSVLink, CSVDownload } from "react-csv";

const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Drinks.png";

const headers = [
  {
    id: 1,
    header: "Picture",
  },
  {
    id: 2,
    header: "Description",
  },
  {
    id: 3,
    header: "Price",
  },
  {
    id: 4,
    header: "Quantity",
  },
  {
    id: 5,
    header: "Set Status as",
  },
];

export default function AdminTables(props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { beverageData, updateData, Loading, notifyUD, setEditDataVisible } =
    props;
  const [pageNumber, setPageNumber] = useState(0);
  const [disableBtn, setDisable] = useState(false);
  let pageCountFixed = () => {
    if (searchTerm === "") {
      return 4;
    } else {
      return beverageData.length;
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

  const [bId, setBId] = useState();

  const DisplayItems = beverageData
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
          <div className={styles.Table__Data__Box}>
            {data.BeverageName} &nbsp;
            {data.Size ? data.Size : ""}
            {data.Details ? data.Details : ""}
          </div>
          <div className={styles.Table__Data__Box}>
            {Number(data.Price)
              .toFixed(2)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className={styles.Table__Data__Box}> {data.Quantity}</div>
          <div className={styles.Table__Data__Box}>
            <button
              className={styles.Table__Data_Available_Btn}
              onClick={() => {
                getID(data.id, data.Status, data.BeverageName);
              }}
              disabled={data.Quantity == 0 ? true : false}
            >
              {data.Status == false ? "Available" : "Not Available"}
            </button>
          </div>
        </div>
      );
    });
  const pageCount = Math.ceil(beverageData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const getID = (BevId, Status, BevName) => {
    console.log("clicked");
    if (Status == true) {
      updateBeverageStatus(BevId, false);
      updateData();
      notifyUD(BevName);
    } else {
      updateBeverageStatus(BevId, true);
      updateData();
      notifyUD(BevName);
    }
  };
  const dt = new Date();

  const date = `${dt.getMonth}/${dt.getDate}/${dt.getMonth}`;

  const viewData = (id) => {
    router.push(
      {
        pathname: `../admin/beverages/bev`,
        query: { BevID: id },
      },
      "../admin/beverages/bev"
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
    beverageData.map((data) => {
      if (data.Quantity == 0) {
        updateBeverageStatus(data.id, false);
        updateData();
      }
      if (data.Quantity > 0) {
        updateBeverageStatus(data.id, true);
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

  const CsvHeader = [
    { label: "Beverage Name", key: "BeverageName" },
    { label: "Quantity", key: "Quantity" },
  ];
  return (
    <div className={styles.Table__Container1}>
      <div className={styles.Table__Search_Box}>
        <div className={styles.Table__Search_Form}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
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
            <button
              style={{
                border: "1px solid black",
                padding: "5px",
                margin: "0 1rem",
                cursor: "pointer",
              }}
              onClick={setEditDataVisible}
            >
              PRINT
            </button>
          </div>
        </div>
      </div>
      <div className={styles.Table__Box}>
        <div className={styles.Table__Head}>{Header}</div>
        <div className={styles.Table__Data_Container}>
          {beverageData.length > 0 ? (
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
        <div>
          {/* <CSVLink data={beverageData} headers={CsvHeader} filename={`BeverageReport.csv`} style={{border:"1px solid black",padding:"3px"}} >EXPORT AS CSV</CSVLink> */}
        </div>
      </div>
    </div>
  );
}
