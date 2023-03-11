import React from "react";
import styles from "../../styles/css/cashier-styles/components-css/cashier.partialReceipt.module.css";
import styled from "@emotion/styled";
import { Divider } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useEffect } from "react";
import { useAuth } from "../utility/firebase";
export default function CashierReceipt(props) {
  const currentUser = useAuth();
  const {
    setReceiptDataVisible,
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
    disValue,
    isDiscount,
    noDiscountValue,
    disName,
    mess,
  } = props;

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Result",
    // onAfterPrint:()=>alert('success')
  });

  useEffect(() => {
    // handlePrint();
  }, []);

  const getSubTotal = () => {
    if (isDiscount) {
      return Number(getTotal()) * (Number(disValue) / 100);
    } else {
      getTotal();
    }
  };
  return (
    <>
      <div className={styles.receipt__box}>
        <div className={styles.Btn__Box}>
          <button
            className={styles.Exit__Button}
            onClick={setReceiptDataVisible}
          >
            ❌
          </button>
        </div>
        <button onClick={handlePrint} className={styles.print__btn}>
          Print Partial Receipt
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
                  <td>Processed: </td>
                  <td>{currentUser?.email}</td>
                </tr>
                <tr>
                  <td>{cat}: </td>
                  <td>{tid}</td>
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
                      <OrderReceipt>1</OrderReceipt>
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
                {/* <ListBody>
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
                </ListBody> */}
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
                      {isDiscount
                        ? Number(getTotal())
                        : getTotal() + getTotalMisc()}
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
                {isDiscount ? (
                  <tr>
                    <td>Grand Total:</td>
                    <td>{Number(noDiscountValue()).toFixed(2)}</td>
                  </tr>
                ) : null}
                {isDiscount ? (
                  <tr>
                    <td>Discount({disName}):</td>
                    <td>
                      {Number(
                        noDiscountValue() * (Number(disValue) / 100)
                      ).toFixed(2)}{" "}
                      ({disValue}%)
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td>Total:</td>
                  <td>
                    {isDiscount
                      ? Number(getTotal())
                      : getTotal() + getTotalMisc()}
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
                    <h5>{mess}</h5>
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
