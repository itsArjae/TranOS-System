import React, { useEffect, useState } from "react";
import styles from "../../styles/css/kitchen-styles/kitchen.status.module.css";
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
import { data } from "autoprefixer";
import KitchenNav from "../kitchen.nav";
export default function KitchenOrderStatus() {

  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if(position != "Chef"){
      router.push('/sign-in');
    }
  }, []);

  const [preparing,setPreparing] = useState([]);
  const [cooking,setCooking] = useState([]);
  const [serving,setServing] = useState([]);

  const db = getFirestore(app);
  const getPreparingQueue = () => {
    const orderRef = collection(db, "orderQueue");
    console.log("read queue");
    const q = query(orderRef,where("status","==","preparing"));
    onSnapshot(q, (snapshot) => {
      let order = [];
      snapshot.docs.forEach((doc) => {
        order.push({ ...doc.data(), id: doc.id });
      });
   //   console.log(order);

      setPreparing(order);
    //  setDailySales(sale);
    });
  };
  const getCookingQueue = () => {
    const orderRef = collection(db, "orderQueue");
    console.log("read queue");
    const q = query(orderRef,where("status","==","cooking"));
    onSnapshot(q, (snapshot) => {
      let order = [];
      snapshot.docs.forEach((doc) => {
        order.push({ ...doc.data(), id: doc.id });
      });
   //   console.log(order);

      setCooking(order);
    //  setDailySales(sale);
    });
  };
  const getServingQueue = () => {
    const orderRef = collection(db, "orderQueue");
    console.log("read queue");
    const q = query(orderRef,where("status","==","serving"));
    onSnapshot(q, (snapshot) => {
      let order = [];
      snapshot.docs.forEach((doc) => {
        order.push({ ...doc.data(), id: doc.id });
      });
      console.log(order);

      setServing(order);
    //  setDailySales(sale);
    });
  };
  useEffect(()=>{
    getPreparingQueue();
    getCookingQueue();
    getServingQueue();
  },[]);

  
  

  return (
    <div className={styles.container}>
      <div>
        <KitchenNav/>
      </div>
      <div className={styles.content}>
        <div className={styles.status__box}>
          <div className={styles.status__header}>
           <h2>PREPARING</h2>
          </div>
          <div className={styles.list__box} >
            
            {
              preparing.map((data)=>{
                return(
                  <div key={data.id} >
                        <TableInfo data={data}/>
                    </div>
                )
              })
            }
           

          </div>

        </div>
        <div className={styles.status__box}>
          <div className={styles.status__header1}>
          <h2>COOKING</h2>
          </div>
          <div className={styles.list__box} >
            
            {
              cooking.map((data)=>{
                return(
                  <div key={data.id} >
                        <TableInfo data={data}/>
                    </div>
                )
              })
            }
           

          </div>
        </div>
        <div className={styles.status__box}>
          <div  className={styles.status__header2}>
          <h2>SERVING</h2>
          </div>
          <div className={styles.list__box} >
            
            {
              serving.map((data)=>{
                return(
                  <div key={data.id} >
                        <TableInfo data={data}/>
                    </div>
                )
              })
            }
           

          </div>
        </div>
      </div>
    </div>
  );
}

const TableInfo = (props) => {
  const {data} = props;
  return(
    <div className={styles.info__box} >
        Table
        <div>{data.tableId}</div>
        </div>
  )
}

// style={{backgroundColor:"green"}}