import React, { useState } from "react";
import styles from "../../styles/css/admin-styles/components-css/tables.components.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
const DefaultPic = "/assets/admin-assets/pictures/default-profile.jpg";

const headers = [
  {
    id: 1,
    header: "Picture",
  },
  {
    id: 2,
    header: "Surname",
  },
  {
    id: 3,
    header: "FirstName",
  },
  {
    id: 4,
    header: "MiddleName",
  },
  {
    id: 5,
    header: "Position",
  },
];

export default function AdminTables(props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { empData, id } = props;
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm === "") {
      return 4;
    } else {
      return empData.length;
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

  const DisplayItems = empData
    .filter((val) => {
      if (searchTerm == "") {
        return val;
      } else if (val.Surname.toLowerCase().includes(searchTerm.toLowerCase())) {
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
            {data.Position == "SuperAdmin" ? (
              ""
            ) : (
              <div
                className={styles.overlay}
                onClick={() => {
                  viewData(data.id);
                }}
              >
                <div className={styles.text}>Click to view</div>
              </div>
            )}
          </div>
          <div className={styles.Table__Data__Box}> {data.Surname}</div>
          <div className={styles.Table__Data__Box}> {data.FirstName}</div>
          <div className={styles.Table__Data__Box}> {data.MiddleName}</div>
          <div className={styles.Table__Data__Box}> {data.Position}</div>
        </div>
      );
    });
  const pageCount = Math.ceil(empData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const viewData = (id) => {
    router.push(
      {
        pathname: `../admin/employees/emp`,
        query: { EmpID: id },
      },
      "../admin/employees/emp"
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

    resetForm();
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
              placeholder="Search Surname"
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
          {empData.length > 0 ? (
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
