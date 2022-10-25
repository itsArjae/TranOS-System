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
    header: "Description",
  },
  {
    id: 2,
    header: "Price",
  },
  {
    id: 3,
    header: "Quantity",
  },
  {
    id: 4,
    header: "Sub-total",
  },
];

export default function AdminTablesTransac(props) {
  const router = useRouter();
  const { transacData, tableID, id } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm === "") {
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

  const DisplayItems = transacData

    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => {
      return (
        <div className={styles.Table__Data} key={data.id}>
          <div className={styles.Table__Data__Box}> {data.description}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.price)
              .toFixed(2)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className={styles.Table__Data__Box}> {data.quantity}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.total)
              .toFixed(2)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
      );
    });
  const pageCount = Math.ceil(transacData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const viewData = (id) => {
    router.push(
      {
        pathname: `../admin/transactions/transaction`,
        query: { TransacID: id },
      },
      "../admin/transactions/transaction"
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
    <div className={styles.Table__Container}>
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
