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
import {app} from '../../src/utility/firebase'
import { Divider } from "@mui/material";
import ReactPaginate from "react-paginate";
import KitchenNav from "../kitchen.nav";

export default function KitchenHome() {
  const [orderQueue, setOrderQueue] = useState([]);
  const db = getFirestore(app)
  const getOrderQueue= () => {
    const orderRef = collection(db, "orderQueue");
    console.log("read queue");
    const q = query(orderRef, orderBy("timeStamp","asc"));
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

  useEffect(()=>{
    getOrderQueue();
  },[]);

  return (
    <div className={styles.container}>
      <div>
        <KitchenNav/>
      </div>
      <h1>ORDERS</h1>
      <div className={styles.table__list}>

          {
            orderQueue.map((data)=>{
              return(
                <div key={data.id} >
                      <OrderBox data={data}  />
               </div>
              )
            })
          }

      </div>
    </div>
  );
}


const OrderBox = (props) => {
  const db = getFirestore(app)
  const {data} = props;
  const [pageNumber,setPageNumber] = useState(1);
  const itemsPerPage = 2;
 const [pagesVisited,setPagesVisited] = useState(0);
 
  const [order,setOrder] = useState([]);
  // .slice(pagesVisited, pagesVisited + itemsPerPage)
  const displayItems = order
  .map((item)=>{
    return(
      <div key={item.id} >
       <OrderDetails item={item}/>
      </div>
    )
  })

  const getOrder = () => {
    const orderRef = collection(db, "orders");
    console.log("read queue");
    const q = query(orderRef,where("queueID","==",data.id));
    onSnapshot(q, (snapshot) => {
      let order = [];
      snapshot.docs.forEach((doc) => {
        order.push({ ...doc.data(), id: doc.id });
      });
      //console.log(order);
      setOrder(order);
      //setDailySales(sale);
    });
  };

  useEffect(()=>{
    getOrder();
  },[])
  const pageCount = Math.ceil(order.length / itemsPerPage);
  const [doneCooking,setDoneCooking] = useState(false);

  const handleCook = () => {
    setDoneCooking(true);
  }
  return(
    <div className={styles.q__box} >
        <div className={styles.q__header} >
            Table {data.TableId}
        </div>
        <div className={styles.q__order} >
          {displayItems}
        </div>
        <div className={styles.q__btn} >
          {
            doneCooking? <div className={styles.stat__cook} ><div>COOKING</div> <button >SERVE</button> </div>: 
            <div className={styles.stat__cook1} ><button onClick={handleCook} >COOKING</button> <div>SERVE</div> </div>
          }
          {/* <button  >COOKING</button>
          <button >SERVE</button> */}
      
        </div> 
    
    </div>
  )
}


const OrderDetails = (props) => {
  const [isSelected,setIsSelected] = useState(false);
  const {item} = props;

  const handleSelect = () => {
      setIsSelected(true);

  }
  return(
    <div className={styles.order__box} >
      <div className={styles.order__det} >
        <div className={styles.itemname} >{item.itemName}</div>
        <div className={styles.itemqty} >QTY: {item.quantity}</div>
      </div>
      <div className={styles.orderbtn} >
        {
          isSelected? '✔' : <button onClick={handleSelect} >✔️</button>
        }
      </div>
    </div>
  );
}


