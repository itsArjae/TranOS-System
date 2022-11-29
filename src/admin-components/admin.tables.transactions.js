import React, { useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/components-css/tables.components.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { updateMenu } from "../../src/utility/admin-utils/menu.firebase";
import styled from "@emotion/styled";
const DefaultPic = "/assets/cashier-assets/pictures/Cashier-Def-Pic-Menu.png";
import { useReactToPrint } from "react-to-print";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import {app} from '../../src/utility/firestore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { updateDiscount } from "../utility/admin-utils/beverages.firebase";
const headers = [
  {
    id: 1,
    header: "Transaction ID",
  },
  {
    id: 2,
    header: "Table Number",
  },
  {
    id: 3,
    header: "Amount",
  },
  {
    id: 4,
    header: "Date",
  },
  {
    id: 5,
    header: "Cashier",
  },
];

const dayArr = [
  { id: 1, day: 1 },
  { id: 2, day: 2 },
  { id: 3, day: 3 },
  { id: 4, day: 4 },
  { id: 5, day: 5 },
  { id: 6, day: 6 },
  { id: 7, day: 7 },
  { id: 8, day: 8 },
  { id: 9, day: 9 },
  { id: 10, day: 10 },
  { id: 11, day: 11 },
  { id: 12, day: 12 },
  { id: 13, day: 13 },
  { id: 14, day: 14 },
  { id: 15, day: 15 },
  { id: 16, day: 16 },
  { id: 17, day: 17 },
  { id: 18, day: 18 },
  { id: 19, day: 19 },
  { id: 20, day: 20 },
  { id: 21, day: 21 },
  { id: 22, day: 22 },
  { id: 23, day: 23 },
  { id: 24, day: 24 },
  { id: 25, day: 25 },
  { id: 26, day: 26 },
  { id: 27, day: 27 },
  { id: 28, day: 28 },
  { id: 29, day: 29 },
  { id: 30, day: 30 },
  { id: 31, day: 31 },
];

export default function AdminTables(props) {
  const db = getFirestore(app);
  const [yearArr, setYearArr] = useState([]);

  const dt = new Date();
  let cyear = dt.getFullYear();
  const getYear = () => {
    for (var i = 0; i < 5; i++) {
      let temp = cyear - i;
      let newdata = { id: i, year: temp };
      setYearArr([...yearArr, newdata]);
      console.log(newdata);
    }
  };

  useEffect(() => {
    getDiscount();
  }, []);

  const router = useRouter();
  const { transacData, updateData, Loading } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  let pageCountFixed = () => {
    if (searchTerm === "") {
      return 7;
    } else {
      return transacData.length;
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
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const DisplayItems = transacData
    .filter((val) => {
      if (month == "") {
        return val;
      } else if (val.month == Number(month)) {
        return val;
      }
    })
    .filter((val) => {
      if (day == "") {
        return val;
      } else if (val.day == Number(day)) {
        return val;
      }
    })
    .filter((val) => {
      if (year == "") {
        return val;
      } else if (val.year == Number(year)) {
        return val;
      }
    })
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => {
      return (
        <div className={styles.Table__Data} key={data.id}>
          <div className={styles.Table__Image_Box}>
            <div> {data.transacID}</div>
            <div
              className={styles.overlay}
              onClick={() => {
                viewData(data.transacID, data.tableNum);
              }}
            >
              <div className={styles.text}>View Details</div>
            </div>
          </div>

          <div className={styles.Table__Data__Box}> {data.tableNum}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.totalAmount)
              .toFixed(2)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className={styles.Table__Data__Box}> {data.dateCreated}</div>
          <div className={styles.Table__Data__Box}> {data.cashierName}</div>
        </div>
      );
    });
  const pageCount = Math.ceil(transacData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const printItems = transacData
    .filter((val) => {
      if (month == "") {
        return val;
      } else if (val.month == Number(month)) {
        return val;
      }
    })
    .filter((val) => {
      if (day == "") {
        return val;
      } else if (val.day == Number(day)) {
        return val;
      }
    })
    .filter((val) => {
      if (year == "") {
        return val;
      } else if (val.year == Number(year)) {
        return val;
      }
    });

  const getID = (MenuId, Status) => {
    console.log("clicked");
    if (Status == true) {
      updateMenu(MenuId, false);
      updateData();
      Loading();
    } else {
      updateMenu(MenuId, true);
      updateData();
      Loading();
    }
  };

  const viewData = (id, tableID) => {
    router.push(
      {
        pathname: `../admin/transactions/transaction`,
        query: { TransacID: id, TableNum: tableID },
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

  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const [disData, setDisData] = useState('');
  const [disValue,setDisValue] = useState(0);
  const getDiscount = async () => {
    
    const querySnapshot = await getDocs(collection(db, "discount"));
    let emp = [];
    querySnapshot.forEach((doc) => {
      emp.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");
    emp.map((data)=>{
      setDisValue(data.value);
      setDisData(data.id);
    })
  };


  const updateDisc = () =>{
    updateDiscount(disValue,disData);
  }

  return (
    <div className={styles.Table__Container}>
      <div className={styles.Table__Search_Box}>
        <div className={styles.Table__Search_Form}>
          <select
            name="search"
            className={styles.Table_Search_Input}
            placeholder="Search Date"
            onChange={(event) => {
              setMonth(event.target.value);
            }}
          >
            <option selected diasbled hidden value="">
              Month
            </option>
            <option value="">ALL</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            className={styles.Table_Search_Input}
            placeholder="Search Date"
            onChange={(event) => {
              setDay(event.target.value);
            }}
          >
            <option value="" selected disbaled hidden>
              Day
            </option>
            <option value="">ALL</option>
            {dayArr.map((data) => {
              return (
                <option key={data.id} value={data.day}>
                  {data.day}
                </option>
              );
            })}
          </select>
          <select
            name="search"
            className={styles.Table_Search_Input}
            placeholder="Search Date"
            onChange={(event) => {
              setYear(event.target.value);
            }}
          >
            <option value="" selected disbaled hidden>
              Year
            </option>
            <option value="">ALL</option>
            {dayArr.map((data) => {
              return (
                <option key={cyear} value={cyear}>
                  {cyear--}
                </option>
              );
            })}
          </select>
          <button onClick={setEditDataVisible}>Print</button>
        </div>
      </div>
      <div className={styles.Table__Box}>
        <div className={styles.Table__Head}>{Header}</div>
        <div className={styles.Table__Data_Container}>
          {transacData.length > 0 ? (
            DisplayItems
          ) : (
            <div className={styles.NoData}>
              <p>No Data Available</p>
            </div>
          )}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}} >
        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}} >
          <div>Discount (%)</div>
          <div><input placeholder="discount" value={disValue} style={{textAlign:"center"}} onChange={(e)=>{
            setDisValue(e.target.value);
          }} /><button onClick={updateDisc} >Save</button></div>
        </div>
        <ReactPaginate
          nextLabel={"Next"}
          previousLabel={"Prev"}
          pageCount={pageCount}
          onPageChange={changePage}
          pageRangeDisplayed={2}
          breakLabel="..."
          containerClassName={styles.Pagination__Container}
          previousLinkClassName={styles.Pagination__Prev}
          nextLinkClassName={styles.Pagination__Next}
          disabledClassName={styles.paginationDisabled}
          activeClassName={styles.paginationActive}
        />
      </div>
      {visible === true && (
        <OuterBox>
          <InnerBox>
            <PrintBox
              setEditDataVisible={setEditDataVisible}
              printItems={printItems}
              day={day}
              year={year}
              month={month}
            />
          </InnerBox>
        </OuterBox>
      )}
    </div>
  );
}

const OuterBox = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  display: flex;
  alignitems: center;
  justifycontent: center;
  background-color:white;
  backdrop-filter: blur(10px);
  margin-left: -100px;
`;

const InnerBox = styled.div`
  margin: auto;
  margin-top: 70px;
`;

const PrintBox = (props) => {
  const { setEditDataVisible, printItems, day, year, month } = props;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Result",
    // onAfterPrint:()=>alert('success')
  });
  const getSum = () => {
    let sum = 0;
    printItems.map((data) => {
      sum = sum + Number(data.totalAmount);
    });
    return Number(sum)
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.print_cont}>
      <div className={styles.btn}>
        <button onClick={setEditDataVisible} className={styles.print__btn}>
          BACK
        </button>
        <button onClick={handlePrint} className={styles.print__btn}>
          PRINT
        </button>
      </div>
      <div className={styles.print_box} ref={componentRef}>
        <div className={styles.headers}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              marginRight: "50px",
            }}
          >
            <b>
              <div style={{ fontSize: "30px" }}>TRANOS </div>
              <div style={{ fontSize: "20px" }}>Transaction Summary Report</div>
              <div>
                {month ? month + "-" : "mm/"}
                {day ? day + "-" : "dd/"}
                {year ? year : "yyyy"}
              </div>
            </b>
          </div>
          <img src="/assets/admin-assets/pictures/logo.png" />
        </div>

        <div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <b>Transaction ID</b>
                </TableCell>
                <TableCell>
                  <b>Table No.</b>
                </TableCell>
                <TableCell>
                  {" "}
                  <b>Amount</b>{" "}
                </TableCell>
                <TableCell>
                  {" "}
                  <b>Date</b>{" "}
                </TableCell>
              </TableRow>
              {printItems.map((data) => {
                return (
                  <TableRow key={data.id}>
                    <TableCell> {data.transacID} </TableCell>
                    <TableCell> {data.tableNum} </TableCell>
                    <TableCell>
                      {" "}
                      Php.
                      {Number(data.totalAmount)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    </TableCell>
                    <TableCell> {data.dateCreated} </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className={styles.total_price}> Total: Php.{getSum()} </div>
        </div>
      </div>
    </div>
  );
};
