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
    const q = query(empRef, where("tableId", "==", Number(tid)));
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

  const misc = (val) => {
    setMisc(Number(val));
    setTotal(getTotal() + Number(val));
  };

  const [payList,setPayList] = useState([]);
  const [totalPrice,setTotalPrice] = useState(0);
  const tryLang = (name,id,total) => {
    console.log("pwede")
    const data = {itemName:name,id:id,total:total};
    setPayList([...payList,data]);
    setTotalPrice(totalPrice + total);
   // console.log(payList);
  };

  const tryLang1 = (name,id,total) => {
    console.log("bawall")
    let data = [];
    
    payList.map((val)=>{
      console.log(val.id,id,"hhh")
      if(val.id != id){
        data.push({itemName:val.itemName,id:val.id,total:val.total})
      }
    })

    setPayList(data);
    setTotalPrice(totalPrice - total);

  };


  const DisplayItems = orderData
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((data) => {
      let isCheck = false;
      return (
        <div key={data.id}>
          <OrderItem data={data} tryLang={tryLang} tryLang1={tryLang1} />
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
          <div className={styles.table__container}>
            <div className={styles.Table__Box}>
              <div className={styles.Data}>
                <div className={styles.Table__Head1}>{HeaderCheck}</div>
                <div className={styles.Table__Head}>{Header}</div>
              </div>

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
              {/* <div className={styles.Form__Input_Container}>
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
              </div> */}
              <button onClick={()=>{console.log(payList)}} >hjsdh</button>
              {totalPrice}
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


const OrderItem = (props) => {

  const {data,tryLang,tryLang1} = props;
  const [isSelected,setIsSelected] = useState(false);

return(
  <div className={styles.Table__Data} >
          <div className={styles.Table__Data__Box1}>
            <input
              type="checkbox"
              onChange={(e) => {
                setIsSelected(!isSelected);
               if(!isSelected){
                console.log("true")
                tryLang(data.itemName,data.id,data.subTotal);
               }
               if(isSelected){
                console.log("false")
                tryLang1(data.itemName,data.id,data.subTotal);
               }
              }}
            >
            </input>
          </div>
          <div className={styles.Table__Data__Box}> {data.itemName}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.price).toFixed(2)}
          </div>
          <div className={styles.Table__Data__Box}> {data.quantity}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.subTotal).toFixed(2)}
          </div>
        </div>
)
}

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
