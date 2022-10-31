import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/css/cashier-styles/cashier.managetables.module.css";
import { ref, getDatabase, get, child } from "firebase/database";
import { app } from "../utility/firebase";
import Draggable from "react-draggable";
import { style } from "@mui/system";
import {
  changeTablePos,
  deleteTables,
} from "../utility/admin-utils/manage-table.firebase";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
const hutOrder = "/assets/cashier-assets/svg/hut.icon.svg";
const tableOrder = "/assets/cashier-assets/svg/table.icon.svg";
const table1 = "/assets/cashier-assets/svg/table1.icon.svg";
const hut = "/assets/cashier-assets/svg/hut1.icon.svg";
const door = "/assets/cashier-assets/svg/door.svg";
export default function CashierTableComponent(props) {
  const nodeRef = useRef(null);
  const router = useRouter();
  const tableRef = useRef(null);
  const { table, coordinates, handleMessageVisible, notify } = props;

  const handleView = (id, Status, category) => {
    if (Status == true) {
      handleMessageVisible(true, "No Order/s Available");
      return;
    }
    router.push(
      {
        pathname: `/cashier/cashier.order`,
        query: { tid: id, tCat: category },
      },
      "/cashier/cashier.order"
    );
  };

  return (
    <Draggable
    defaultPosition={{ x: table?.x, y: table?.y }}
    position={{ x: table?.x, y: table?.y }}
    handle="#handle"
    >  
    <div className={styles.Table}   onClick={() => {
                handleView(table.id, table.Status, table.Category);
              }} style={{position:'absolute'}} ref={nodeRef}>
    <div className={styles.table__title}  >{table?.id}</div>
      <div ref={tableRef}  className={styles.Table_Handle} id="handle" onClick={()=>{console.log(tableRef.current.offsetLeft)}}  >
        *
      </div>
      <div className={styles.Table__Button_Box} >
      {/* {table?.id === 0 ? null : (
            <button
              className={styles.Table__Button}
              onClick={() => {
                handleView(table.id, table.Status, table.Category);
              }}
            >
              View
            </button>
          )} */}
      </div>
      {
        table?.Category == "Door" ? <img src={`${door}`} className={styles.table__icon} /> :
        table?.Category == "Table"  && table?.Status == true ? <img src={`${table1}`} className={styles.table__icon} /> :
        table?.Category == "Table"  && table?.Status == false ? <img src={`${tableOrder}`} className={styles.table__icon} /> :
        table?.Category == "Hut"  && table?.Status == true ? <img src={`${hut}`} className={styles.table__icon} /> :
        <img src={`${hutOrder}`} className={styles.table__icon} />
      }
   </div>
</Draggable>
  );
}
