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
  {id:1,day:1},{id:2,day:2},{id:3,day:3},{id:4,day:4},{id:5,day:5},{id:6,day:6},{id:7,day:7},{id:8,day:8},{id:9,day:9},{id:10,day:10},
  {id:11,day:11},{id:12,day:12},{id:13,day:13},{id:14,day:14},{id:15,day:15},{id:16,day:16},{id:17,day:17},{id:18,day:18},{id:19,day:19},{id:20,day:20},
  {id:21,day:21},{id:22,day:22},{id:23,day:23},{id:24,day:24},{id:25,day:25},{id:26,day:26},{id:27,day:27},{id:28,day:28},{id:29,day:29},{id:30,day:30},{id:31,day:31},
];

export default function AdminTables(props) {

  const [yearArr,setYearArr] = useState([]);


  const dt = new Date();
    let cyear = dt.getFullYear();
  const getYear = () => {
  
    for(var i=0; i<5; i++){
      let temp = cyear - i;
      let newdata = {id:i, year:temp}
      setYearArr([...yearArr,newdata])
      console.log(newdata)
    }
  }

  useEffect(()=>{
 
  },[])

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
  const [day,setDay] = useState('');
  const [month,setMonth] = useState('');
  const [year,setYear] = useState('');

  const DisplayItems = transacData
    .filter((val) => {
      if (month == "") {
        return val;
      } else if (
        val.month == Number(month)
      ) {
        return val;
      }
    })
    .filter((val) => {
      if (day == "") {
        return val;
      } else if (
        val.day == Number(day)
      ) {
        return val;
      }
    })
    .filter((val) => {
      if (year == "") {
        return val;
      } else if (
        val.year == Number(year)
      ) {
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
                <option selected diasbled hidden  value="">Month</option>
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
                <option value="" selected disbaled hidden  >Day</option>
                <option value="" >ALL</option>
                {
                  dayArr.map((data)=>{
                    return(
                      <option key={data.id} value={data.day} >
                        {data.day}
                    </option>
                    )
                  })
                }

               </select>
             <select
            
              name="search"
              className={styles.Table_Search_Input}
              placeholder="Search Date"
              onChange={(event) => {
                setYear(event.target.value);
              }}
              >
                  <option value="" selected disbaled hidden  >Year</option>
                <option value="" >ALL</option>
 {
                  dayArr.map((data)=>{
                    return(
                      <option key={cyear} value={cyear} >
                        {cyear--}
                    </option>
                    )
                  })
                }
              </select>
            <button>Print</button>
         
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
      <div>
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
    </div>
  );
}
