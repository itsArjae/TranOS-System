import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/css/cashier-styles/cashier.order.module.css";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { app, loginUser2 } from "../../src/utility/firebase";
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
import { voidData } from "../../src/utility/cashier-utils/cashier.firebase";

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
  {
    id: 5,
    header: "Action",
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
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Cashier") {
      router.push("/sign-in");
    }
  }, []);

  const successPayment = () =>
    toast.success("Payment Success!", {
      icon: "✔️",
    });
  const failPayment = () =>
    toast.error("Not enough money! ", {
      icon: "❌",
    });
  const failConfirmPayment = () =>
    toast.error("The food is not yet serve!", {
      icon: "❌",
    });
  const router = useRouter();
  const tid = router.query.tid;
  const cat = router.query.tCat;
  const [orderData, setOrderData] = useState([]);
  const [miscData, setMiscData] = useState([]);
  const [orderQData, setOrderQData] = useState([]);
  const [orderCat, setOrderCat] = useState("");
  const [disable, setDisable] = useState(false);
  const [qID, setQID] = useState("");
  const db = getFirestore(app);

  const [pageNumber, setPageNumber] = useState(0);

  const itemsPerPage = 7;
  const pagesVisited = pageNumber * itemsPerPage;

  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }
  const [confVisible, setConfVisible] = useState(false);
  const [voidData,setVoidData] = useState([]);

  function handleConfVisible(data) {
    console.log(data)
    setVoidData(data);
    setConfVisible(!confVisible);
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

  const getOrderQueueData = () => {
    const empRef = collection(db, "orderQueue");

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
      setOrderQData(emp);
      emp.map((data) => {
        if (data.tableId == tid) {
          console.log("SAME SILA");
          setDisable(true);
        }
      });
    });
  };

  useEffect(() => {
    setDisable(false);
    getTableData();
    getMiscData();
    getOrderQueueData();
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
      return (
        <div className={styles.Table__Data} key={data.id}>
          <div className={styles.Table__Data__Box}> {data.itemName}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.price).toFixed(2)}
          </div>
          <div className={styles.Table__Data__Box}> {data.quantity}</div>
          <div className={styles.Table__Data__Box}>
            {Number(data.subTotal).toFixed(2)}
          </div>
          <div className={styles.Table__Data__Box}>
            {" "}
            <button onClick={()=>{
              handleConfVisible(data);
            }} >VOID</button>{" "}
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
                    //disabled={disable}
                    onClick={() => {
                      {
                        disable ? failConfirmPayment() : setVisible(!visible);
                      }
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
              getGrandTotal1={getGrandTotal}
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
      {confVisible === true && (
        <OuterBox>
          <InnerBox>
            <Confirmation 
            handleConfVisible={handleConfVisible}
            data={voidData}
            />
          </InnerBox>
        </OuterBox>
      )}
    </div>
  );
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

const Confirmation = (props) => {

  const {data,handleConfVisible} = props;

  const db = getFirestore(app);

  const [empData, setEmpData] = useState([]);

  const getEmpData = async () => {
    const saleRef = collection(db, "employees");
    console.log("read");
    const q = query(saleRef, where("Position", "==", "Admin"));
    onSnapshot(q, (snapshot) => {
      let sale = [];
      snapshot.docs.forEach((doc) => {
        sale.push({ ...doc.data(), id: doc.id });
      });

      setEmpData(sale);
    });
  };

  useEffect(() => {
    getEmpData();
  }, []);

  const [adEmail, setAdEmail] = useState("");
  const [adPass, setAdPass] = useState("");
  const [errMessage,setErrMessage] = useState('');
  const onSubmit = async() => {
    console.log(adEmail,adPass)
    try {
      await loginUser2(adEmail, adPass);
      voidData(data.id)
      handleConfVisible();
    } catch (err) {
      setErrMessage("Wrong Password");   
      return;
    }
  }

  return (
    <div className={styles.conf_container}>
      <h2>Do you confirm to void this product? <br/> Item: {data?.itemName} </h2>
      
      <div
        className={styles.admin__email}
        onChange={(e) => {
          setAdEmail(e.target.value);
        }}
      >
        <select>
          <option value="" selected disabled hidden>
            Admin Email
          </option>
          {empData.map((data) => {
            return (
              <option key={data.id} value={data.Email}>
                {data.Email}
                
              </option>
            );
          })}
        </select>
      </div>


      <div className={styles.admin_pass}>
        <input
          type="password"
          placeholder="Admin Password"
          value={adPass}
          onChange={(e) => {
            setAdPass(e.target.value);
          }}
        />
        {errMessage}
      </div>
      


      <div className={styles.conf__btn}>
        <button onClick={handleConfVisible} >Cancel</button>
        <button onClick={onSubmit} >Confirm</button>
      </div>
    </div>
  );
};
