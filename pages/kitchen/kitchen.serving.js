import React, { useEffect, useState } from "react";
import styles from "../../styles/css/kitchen-styles/kitchen.home.module.css";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  where,
  orderBy,
  limitToLast,
} from "firebase/firestore";
import { app } from "../../src/utility/firebase";
import { Divider } from "@mui/material";
import ReactPaginate from "react-paginate";
import KitchenNav from "../kitchen.nav";
import { deleteQueue } from "../../src/utility/kitchen-utils/kitchen.firebase";
import CashierLayout from "../../src/cashier-components/cashierLayout";
import { useRouter } from "next/router";
import { servedOrders } from "../../src/utility/cashier-utils/cashier.firebase";
export default function KitchenServing() {
  const router = useRouter();
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Cashier") {
      router.push("/sign-in");
    }
  }, []);

  const [orderQueue, setOrderQueue] = useState([]);
  const db = getFirestore(app);
  const getOrderQueue = () => {
    const orderRef = collection(db, "orderQueue");
    console.log("read queue");
    const q = query(orderRef, where("status", "==", "serving"));
    onSnapshot(q, (snapshot) => {
      let order = [];
      snapshot.docs.forEach((doc) => {
        order.push({ ...doc.data(), id: doc.id });
      });
      console.log(order);

      setOrderQueue(order);
      //  setDailySales(sale);
    });
  };

  useEffect(() => {
    getOrderQueue();
  }, []);

  return (
    <div className={styles.container}>
      
      <h1 style={{marginTop:"100px"}} >SERVING</h1>
      <div className={styles.table__list}>
        {orderQueue.map((data) => {
          return (
            <div key={data.id}>
              <OrderBox data={data} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const OrderBox = (props) => {
  const db = getFirestore(app);
  const { data } = props;
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 2;
  const [pagesVisited, setPagesVisited] = useState(0);

  const [order, setOrder] = useState([]);
  // .slice(pagesVisited, pagesVisited + itemsPerPage)
  const displayItems = order.map((item) => {
    return (
      <div key={item.id}>
        <OrderDetails item={item} />
      </div>
    );
  });

  const [servedItems,setServedItems] = useState(0);

  const getOrder = () => {
    const orderRef = collection(db, "orders");
    console.log("read queue");
    const q = query(
      orderRef,
      where("queueID", "==", data.id),
      where("category", "==", "order"),
    );
    onSnapshot(q, (snapshot) => {
      let order = [];
      snapshot.docs.forEach((doc) => {
        order.push({ ...doc.data(), id: doc.id });
      });
      //console.log(order);
      setOrder(order);

      let total = 0;
      order.map((data)=>{
        if(data.status == true){
          total = total + 1;
        }
      });

      setServedItems(total);

      
    });
  };

  useEffect(() => {
    getOrder();
  }, []);
  const pageCount = Math.ceil(order.length / itemsPerPage);
  const [doneCooking, setDoneCooking] = useState(false);

  const handleCook = () => {
    deleteQueue(data.id);
  };
  return (
    <div className={styles.q__box}>
      <div className={styles.q__header}>Table {data.tableId}</div>
      <div className={styles.q__order}>{displayItems.length > 0? displayItems: 'Only Drinks/Services are ordered - Click Served to proceed'}</div>
      <div className={styles.q__btn}>
        <div className={styles.stat__cook1}>
          {servedItems == order.length? <button onClick={handleCook}>SERVED</button>: <button disabled={true} onClick={handleCook}>SERVED</button>}
        </div>

        {/* <button  >COOKING</button>
          <button >SERVE</button> */}
      </div>
    </div>
  );
};

const OrderDetails = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const { item } = props;

  const handleSelect = () => {
    servedOrders(item.id)
  };
  return item?(
    <div className={styles.order__box}>
      <div className={styles.order__det}>
        <div className={styles.itemname}>{item.itemName}</div>
        <div className={styles.itemqty}>QTY: {item.quantity}</div>
      </div>
      <div className={styles.orderbtn}>
        {item.status ? "✔" : <button onClick={handleSelect}>✔️</button>}
      </div>
    </div>
  ):'Only Drinks are ordered';
};

KitchenServing.getLayout = function getLayout(page) {
  return <CashierLayout>{page}</CashierLayout>;
};