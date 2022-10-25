import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/css/cashier-styles/cashier.order.module.css";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { app } from "../../src/utility/firebase";
import {
  query,
  where,
  orderBy,
  limit,
  getFirestore,
  collection,
  onSnapshot,
  FieldPath,
  Firestore,
} from "firebase/firestore";
import CashierLayout from "../../src/cashier-components/cashierLayout";
import styled from "@emotion/styled";
import Pay from "../../src/cashier-components/cashier.pay";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const headers = [
  {
    id: 1,
    header: "Name",
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
const headersCheck = [
  {
    id: 1,
    header: <input type="checkbox" onClick={() => {}}></input>,
  },
];

const miscHeader = [
  {
    id: 1,
    header: "Description",
  },
  {
    id: 2,
    header: "Amount",
  },
];

export default function CashierOrder() {
  const successPayment = () =>
    toast.success("SUCCESSFULLY PAID", {
      icon: "✔️",
    });
  const failPayment = () =>
    toast.error("NOT ENOUGH MONEY! ", {
      icon: "❌",
    });
  const router = useRouter();
  const tid = router.query.tid;
  const cat = router.query.tCat;
  const [orderData, setOrderData] = useState([]);
  const [miscData, setMiscData] = useState([]);
  const [orderCat, setOrderCat] = useState("");
  const db = getFirestore(app);

  const [pageNumber, setPageNumber] = useState(0);

  const itemsPerPage = 7;
  const pagesVisited = pageNumber * itemsPerPage;

  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const getTableData = () => {
    const empRef = collection(db, "orders");

    if (!tid) {
      router.push("./cashier.table");
      return;
    }
    console.log("read");
    const q = query(
      empRef,
      where("tableId", "==", Number(tid)),
      where("category", "==", "order")
    );
    onSnapshot(q, (snapshot) => {
      let emp = [];
      snapshot.docs.forEach((doc) => {
        emp.push({ ...doc.data(), id: doc.id });
      });
      setOrderData(emp);
    });
    setTotal(getTotal());
  };

  const getMiscData = () => {
    const empRef = collection(db, "orders");

    if (!tid) {
      router.push("./cashier.table");
      return;
    }
    console.log("read");
    const q = query(
      empRef,
      where("tableId", "==", Number(tid)),
      where("category", "==", "misc")
    );
    onSnapshot(q, (snapshot) => {
      let emp = [];
      snapshot.docs.forEach((doc) => {
        emp.push({ ...doc.data(), id: doc.id });
      });
      setMiscData(emp);
    });
    setCharges(getTotalMisc());
  };
  useEffect(() => {
    getTableData();
    getMiscData();
  }, []);

  const [total, setTotal] = useState(0);
  const [gTotal, setGTotal] = useState(0);
  const [charges, setCharges] = useState(0);
  const [misce, setMisc] = useState(0);
  const [totalFix, setTotalFix] = useState(0);

  const back = () => {
    router.push("./cashier.table");
  };

  const miscRef = new useRef(null);
  const totalRef = new useRef(null);

  const getTotal = () => {
    let sum = 0;
    orderData.map((data) => {
      sum = sum + data.subTotal;
    });
    return sum;
  };

  const getTotalFixed = () => {
    return total
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTotalFixed2 = () => {
    return getTotal()
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTotalMisc = () => {
    let sum1 = 0;
    miscData.map((data) => {
      sum1 = sum1 + data.subTotal;
    });
    return sum1;
  };

  const getTotalFixedMisc = () => {
    return charges
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTotalFixedMisc2 = () => {
    return getTotalMisc()
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const misc = (val) => {
    setMisc(Number(val));
    setTotal(getTotal() + Number(val));
  };

  const getGrandTotal = () => {
    let sum2 = 0;
    sum2 = Number(getTotal()) + Number(getTotalMisc());
    return sum2;
  };

  const getGTotalFixed = () => {
    return gTotal
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const getGTotalFixed2 = () => {
    return getGrandTotal()
      .toFixed(2)
      .toString()
      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const [payList, setPayList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const tryLang = (name, id, total) => {
    console.log("pwede");
    const data = { itemName: name, id: id, total: total };
    setPayList([...payList, data]);
    setTotalPrice(totalPrice + total);
    // console.log(payList);
  };

  const tryLang1 = (name, id, total) => {
    console.log("bawall");
    let data = [];

    payList.map((val) => {
      console.log(val.id, id, "hhh");
      if (val.id != id) {
        data.push({ itemName: val.itemName, id: val.id, total: val.total });
      }
    });

    setPayList(data);
    setTotalPrice(totalPrice - total);
  };

  const DisplayItems = orderData
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => {
      // let isCheck = false;
      // return (
      //   <div key={data.id}>
      //     <OrderItem data={data} tryLang={tryLang} tryLang1={tryLang1} />
      //   </div>
      // );
      return (
        <div className={styles.Table__Data} key={data.id}>
          {/* <div className={styles.Table__Data__Box1}>
            <input
              type="checkbox"
              onChange={(e) => {
                setIsSelected(!isSelected);
                if (!isSelected) {
                  console.log("true");
                  tryLang(data.itemName, data.id, data.subTotal);
                }
                if (isSelected) {
                  console.log("false");
                  tryLang1(data.itemName, data.id, data.subTotal);
                }
              }}
            ></input>
          </div> */}
          <div className={styles.Table__Data__Box}> {data.itemName}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.price).toFixed(2)}
          </div>
          <div className={styles.Table__Data__Box}> {data.quantity}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.subTotal).toFixed(2)}
          </div>
        </div>
      );
    });

  const DisplayMisc = miscData
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => {
      return (
        <div className={styles.Table__Data} key={data.id}>
          <div className={styles.Table__Data__Box}> {data.itemName}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.subTotal).toFixed(2)}
          </div>
        </div>
      );
    });

  const pageCount = Math.ceil(orderData.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const Header = headers.map((heads) => {
    return (
      <div className={styles.Table__Heads_Data} key={heads.id}>
        {heads.header}
      </div>
    );
  });

  const HeaderCheck = headersCheck.map((heads) => {
    return (
      <div className={styles.Table__Heads_Data1} key={heads.id}>
        {heads.header}
      </div>
    );
  });

  const otherFee = miscHeader.map((heads) => {
    return (
      <div className={styles.Table__Heads_Data2} key={heads.id}>
        {heads.header}
      </div>
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.inner__container}>
        <div className={styles.table__header}>
          <div className={styles.table__header1}>
            <div className={styles.Btn__Text1}>
              <img
                src="/assets/cashier-assets/svg/orderList.icon.svg"
                height={35}
                width={35}
                alt="Order Icon"
              />
              <h2>Order List</h2>
            </div>

            <div className={styles.Btn__Text}>
              <h2>
                {cat} {tid}
              </h2>
            </div>

            <div className={styles.Btn__Box}>
              <button className={styles.Exit__Button} onClick={back}>
                ❌
              </button>
            </div>
          </div>
        </div>
        <div className={styles.order__box}>
          <div className={styles.table}>
            <div className={styles.table__container}>
              <p>Order Details</p>
              <div className={styles.Table__Box}>
                <div className={styles.Data}>
                  {/* <div className={styles.Table__Head1}>{HeaderCheck}</div> */}
                  <div className={styles.Table__Head}>{Header}</div>
                </div>

                <div className={styles.Table__Data_Container}>
                  {orderData.length > 0 ? (
                    DisplayItems
                  ) : (
                    <div className={styles.NoData}>
                      <p>No Data Available</p>
                    </div>
                  )}
                </div>
              </div>
              {/* <div>
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
              </div> */}
            </div>
            <div className={styles.table__container1}>
              <p>Additional Charges</p>
              <div className={styles.Table__Box1}>
                <div className={styles.Data}>
                  <div className={styles.Table__Head}>{otherFee}</div>
                </div>
                <div className={styles.Table__Data_Container}>
                  {miscData.length > 0 ? (
                    DisplayMisc
                  ) : (
                    <div className={styles.NoData}>
                      <p>No Data Available</p>
                    </div>
                  )}
                </div>
              </div>
              {/* <div>
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
              </div> */}
            </div>
          </div>
          <div className={styles.other__container}>
            <div className={styles.other__box}>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <label htmlFor="miscFee">Charges:</label>
                  <input
                    className={styles.Form__Input}
                    type="text"
                    id="miscFee"
                    value={charges ? getTotalFixedMisc() : getTotalFixedMisc2()}
                    readOnly={true}
                  ></input>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <label htmlFor="total">Total:</label>
                  <input
                    className={styles.Form__Input}
                    type="text"
                    id="total"
                    value={total ? getTotalFixed() : getTotalFixed2()}
                    readOnly={true}
                  ></input>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <label htmlFor="total">Grand Total:</label>
                  <input
                    className={styles.Form__Input}
                    type="text"
                    id="gtotal"
                    value={getGTotalFixed2()}
                    readOnly={true}
                  ></input>
                </div>
              </div>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <button
                    className={styles.btn__pay}
                    onClick={() => {
                      setVisible(!visible);
                    }}
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
              {/* <button
                onClick={() => {
                  console.log(payList);
                }}
              >
                hjsdh
              </button>
              {totalPrice} */}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      {visible === true && (
        <OuterBox>
          <InnerBox>
            <Pay
              setEditDataVisible={setEditDataVisible}
              orderData={orderData}
              tid={tid}
              total={total}
              misce={misce}
              getTotal={getTotal}
              getTotalFixed={getTotalFixed}
              getTotalFixed2={getTotalFixed2}
              successPayment={successPayment}
              failPayment={failPayment}
              cat={cat}
              getGrandTotal={getGrandTotal}
              getGTotalFixed2={getGTotalFixed2}
              miscData={miscData}
              charges={charges}
              getTotalMisc={getTotalMisc}
              getTotalFixedMisc={getTotalFixedMisc}
              getTotalFixedMisc2={getTotalFixedMisc2}
            />
          </InnerBox>
        </OuterBox>
      )}
    </div>
  );
}

CashierOrder.getLayout = function getLayout(page) {
  return <CashierLayout>{page}</CashierLayout>;
};

// const OrderItem = (props) => {
//   const { data, tryLang, tryLang1 } = props;
//   const [isSelected, setIsSelected] = useState(false);

//   return (
//     <div className={styles.Table__Data}>
//       <div className={styles.Table__Data__Box1}>
//         <input
//           type="checkbox"
//           onChange={(e) => {
//             setIsSelected(!isSelected);
//             if (!isSelected) {
//               console.log("true");
//               tryLang(data.itemName, data.id, data.subTotal);
//             }
//             if (isSelected) {
//               console.log("false");
//               tryLang1(data.itemName, data.id, data.subTotal);
//             }
//           }}
//         ></input>
//       </div>
//       <div className={styles.Table__Data__Box}> {data.itemName}</div>
//       <div className={styles.Table__Data__Box}>
//         {Number(data.price).toFixed(2)}
//       </div>
//       <div className={styles.Table__Data__Box}> {data.quantity}</div>
//       <div className={styles.Table__Data__Box}>
//         {Number(data.subTotal).toFixed(2)}
//       </div>
//     </div>
//   );
// };

const OuterBox = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  backdrop-filter: blur(10px);
  display: flex;
  alignitems: center;
  justifycontent: center;
`;

const InnerBox = styled.div`
  margin: auto;
`;
