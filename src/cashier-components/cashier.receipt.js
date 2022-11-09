import React from "react";
import styles from "../../styles/css/cashier-styles/components-css/cashier.receipt.module.css";
import styled from "@emotion/styled";
import { Divider } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
export default function CashierReceipt(props) {
  const {
    orderData,
    tid,
    total,
    dateTime,
    misce,
    getTotal,
    change,
    payment,
    trID,
    getTotalFixed,
    getTotalFixed2,
    getGrandTotal,
    getGTotalFixed2,
    miscData,
    cat,
    charges,
    getTotalMisc,
    getTotalFixedMisc,
    getTotalFixedMisc2,
  } = props;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Result",
    // onAfterPrint:()=>alert('success')
  });

  return (
    <>
      <div className={styles.receipt__box}>
        <button onClick={handlePrint} className={styles.print__btn}>
          Print Receipt
        </button>
        <div ref={componentRef} className={styles.container}>
          <div className={styles.image__container}>
            <img
              src="/assets/admin-assets/pictures/logo.png"
              height={100}
              width={100}
              alt="beverages Icon"
            />
          </div>
          <div className={styles.info}>
            <p>
              Location @ ABRU Beach Front Resort <br></br>
              Buton St., Brgy. Sabang,Baler, Aurora<br></br>
              Contact: 0915-130-5981 / 0999-833-0802
            </p>
          </div>
          <div className={styles.table__container}>
            <table>
              <tbody>
                <tr>
                  <td colSpan={2}>===================================</td>
                </tr>
                <tr>
                  <td>{cat}: </td>
                  <td>{tid}</td>
                </tr>
                <tr>
                  <td>Transaction #: </td>
                  <td>{trID}</td>
                </tr>
                <tr>
                  <td>Date & Time: </td>
                  <td>{dateTime}</td>
                </tr>
                <tr>
                  <td colSpan={2}>===================================</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.order__list}>
            <table>
              <thead>
                <tr>
                  <OrderList>Descr.</OrderList>
                  <OrderList>Price</OrderList>
                  <OrderList>Qty.</OrderList>
                  <OrderList>SubTotal</OrderList>
                </tr>
              </thead>
              <ListBody>
                {orderData.map((record) => {
                  return (
                    <List key={record.id}>
                      <OrderReceipt>{record.itemName}</OrderReceipt>
                      <OrderReceipt>
                        {Number(record.price).toFixed(2)}
                      </OrderReceipt>
                      <OrderReceipt>{record.quantity}</OrderReceipt>
                      <OrderReceipt>
                        {Number(record.subTotal)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                      </OrderReceipt>
                    </List>
                  );
                })}
              </ListBody>
            </table>
          </div>

          <Divider sx={{ marginBottom: "10px", marginTop: "10px" }} />

          <div className={styles.table__container}>
            <table>
              <tbody>
                <ListBody>
                  {miscData.map((record) => {
                    return (
                      <List key={record.id}>
                        <OrderReceipt>{record.itemName}</OrderReceipt>
                        <OrderReceipt>
                          {Number(record.subTotal)
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                        </OrderReceipt>
                      </List>
                    );
                  })}
                </ListBody>
                <Divider />
                <tr>
                  <td colSpan={2}>===================================</td>
                </tr>
                <tr>
                  <td>
                    <i>Charges:</i>
                  </td>
                  <td>
                    <i>
                      {Number(getTotalMisc())
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                    </i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i>Sub Total:</i>
                  </td>
                  <td>
                    <i>
                      {Number(getTotal())
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                    </i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Divider sx={{ marginBottom: "10px", marginTop: "10px" }} />

          <div className={styles.table__container}>
            <table>
              <tbody>
                <tr>
                  <td>Total:</td>
                  <td>{getGTotalFixed2()}</td>
                </tr>
                <tr>
                  <td>Cash:</td>
                  <td>
                    {Number(payment)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                </tr>
                <tr>
                  <td>Change:</td>
                  <td>
                    {Number(change)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Divider sx={{ marginBottom: "10px", marginTop: "10px" }} />

          <div className={styles.other__details}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <p>
                      Good Times... Chilling Sounds... <br></br>
                      Big Waves... GooZy Friends...<br></br>
                      Thank You! Please Come Again!
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const OrderList = styled.td`
  padding-left: 10px;
  padding-right: 10px;
  font-family: "Times New Roman", Times, serif;
  text-align: center;
  font-size: small;
`;
const OrderReceipt = styled.td`
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
  font-size: small;
`;
const List = styled.tr`
  font-family: Times New Roman;
`;

const ListBody = styled.tbody`
  text-align: center;
`;
