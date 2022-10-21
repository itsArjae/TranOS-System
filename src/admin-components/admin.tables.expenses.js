import React, { useState } from "react";
import styles from "../../styles/css/admin-styles/components-css/tables.components.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
const DefaultPic = "/assets/admin-assets/pictures/expenses.png";

const headers = [
  {
    id: 1,
    header: "Picture",
  },
  {
    id: 2,
    header: "Remarks",
  },
  {
    id: 3,
    header: "Amount",
  },
  {
    id: 4,
    header: "Date",
  },
];
const sampleData = [
  {
    id: 1,
    Name: "A",
    Address: "hh",
    Number: 1,
  },
  {
    id: 2,
    Name: "A2",
    Address: "hh",
    Number: 1,
  },
  {
    id: 3,
    Name: "A3",
    Address: "hh",
    Number: 1,
  },
];

export default function AdminTables(props) {
  const router = useRouter();
  const { expensesData, id } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm === "") {
      return 4;
    } else {
      return expensesData.length;
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

  const DisplayItems = expensesData
    .filter((val) => {
      if (searchTerm == "") {
        return val;
      } else if (val.date.includes(searchTerm)) {
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
          </div>
          <div className={styles.Table__Data__Box}>
            {data.remarks ? data.remarks : "N/A"}
          </div>
          <div className={styles.Table__Data__Box}>
            {Number(data.amount).toFixed(2)}
          </div>
          <div className={styles.Table__Data__Box}>
            {data.date + " " + data.time}
          </div>
        </div>
      );
    });
  const pageCount = Math.ceil(expensesData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const viewData = (id) => {
    router.push(
      {
        pathname: `../admin/Raw_Goods/raw_goods`,
        query: { RawGoodsID: id },
      },
      "../admin/Raw_Goods/raw_goods"
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
              placeholder="Search Date"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.Table__Box}>
        <div className={styles.Table__Head}>{Header}</div>
        <div className={styles.Table__Data_Container}>{DisplayItems}</div>
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
