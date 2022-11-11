import React, { useEffect, useRef, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import {
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import styles from "../../styles/css/admin-styles/components-css/print.module.css";
import { useReactToPrint } from "react-to-print";
import { app } from "../../src/utility/firebase.js";
import { useRouter } from "next/router";

export default function PrintBeverage() {
  const router = useRouter();
  const dt = new Date();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Result",
    // onAfterPrint:()=>alert('success')
  });

  const db = getFirestore(app);

  const [beverageData, setBeverageData] = useState([]);
  const getBeverageData = async () => {
    const querySnapshot = await getDocs(collection(db, "beverages"));
    let beverage = [];
    querySnapshot.forEach((doc) => {
      beverage.push({ ...doc.data(), id: doc.id });
    });
    console.log("read");

    setBeverageData(beverage);
    // setLoading(true);
  };
  useEffect(() => {
    getBeverageData();
  }, []);

  return (
    <div className={styles.print_container}>
      <div className={styles.print_box1}>
        <div ref={componentRef} className={styles.print_box}>
          <div>{`${dt.getMonth()}/${dt.getDate()}/${dt.getFullYear()}`}</div>
          <div className={styles.header}>
         
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
                <div style={{ fontSize: "20px" }}>Beverage Summary Report</div>
              </b>
            </div>
            <img src="/assets/admin-assets/pictures/logo.png" />
          </div>

          <div>
            <Table>
            
               
              
              <TableBody>
              <TableRow>
                  <TableCell>
                    <b>BEVERAGE NAME</b>
                  </TableCell>
                  <TableCell>
                    <b>QUANTITY</b>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <b>PRICE</b>{" "}
                  </TableCell>
                </TableRow>
                {beverageData.map((data) => {
                  return (
                    <TableRow key={data.id}>
                      <TableCell sx={{ display: "flex", flexDirection: "row" }}>
                        {data.BeverageName} &nbsp;{" "}
                        {data.Size ? (
                          <div>
                            {data.Size}
                            {data.Details}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell >{data.Quantity}</TableCell>
                      <TableCell>
                        Php.
                        {Number(data.Price)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                      </TableCell>
                    </TableRow>
                  );
                })}
                
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className={styles.btn} >
        <button onClick={() => {router.push('/admin/admin.beverages')}} className={styles.print__btn}>
          BACK
        </button>
        <button onClick={handlePrint} className={styles.print__btn}>
          Print
        </button>
      </div>
    </div>
  );
}
