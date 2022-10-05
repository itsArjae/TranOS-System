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
    header: "Sub-Total",
  },
];

export default function CashierOrder() {
  const router = useRouter();
  const tid = router.query.tid;
  const [orderData, setOrderData] = useState([]);
  const db = getFirestore(app);

  const [pageNumber, setPageNumber] = useState(0);

  const itemsPerPage = 6;
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
    const q = query(empRef, where("TableID", "==", tid));
    onSnapshot(q, (snapshot) => {
      let emp = [];
      snapshot.docs.forEach((doc) => {
        emp.push({ ...doc.data(), id: doc.id });
      });
      setOrderData(emp);
    });
    setTotal(getTotal());
  };
  useEffect(() => {
    getTableData();
  }, []);

  const [total, setTotal] = useState(0);
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
      sum = sum + data.total;
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

  const misc = (val) => {
    setMisc(Number(val));
    setTotal(getTotal() + Number(val));
  };

  const DisplayItems = orderData
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => {
      return (
        <div className={styles.Table__Data} key={data.id}>
          <div className={styles.Table__Data__Box}> {data.mealName}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.price).toFixed(2)}
          </div>
          <div className={styles.Table__Data__Box}> {data.quantity}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.total).toFixed(2)}
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

  return (
    <div className={styles.container}>
      <div className={styles.inner__container}>
        <div className={styles.table__header}>
          <img
            src="/assets/cashier-assets/pictures/order-list.png"
            height={35}
            width={35}
            alt="Order Icon"
          />
          <h2>Orders of Table No. {tid} </h2>
          <div className={styles.Btn__Box}>
            <button onClick={back}>❌</button>
          </div>
        </div>
        <div className={styles.order__box}>
          <div className={styles.table__container}>
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
          <div className={styles.other__container}>
            <div className={styles.other__box}>
              <div className={styles.Form__Input_Container}>
                <div className={styles.Form__Input_Box1}>
                  <label htmlFor="miscFee">Miscellaneous Fee:</label>
                  <input
                    className={styles.Form__Input}
                    type="number"
                    id="miscFee"
                    placeholder="0.00"
                    onChange={(e) => {
                      misc(e.target.value);
                    }}
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
            </div>
          </div>
        </div>
      </div>
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
