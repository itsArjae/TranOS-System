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
      dra
    >
      <div
        className={styles.Table}
        style={{ backgroundColor: table?.Color, position: "absolute" }}
        ref={nodeRef}
      >
        {table?.Category}
        <div
          ref={tableRef}
          className={styles.Table_Handle}
          id="handle"
          onClick={() => {
            console.log(tableRef.current.offsetLeft);
          }}
        >
          {table?.id}
        </div>
        <div className={styles.Table__Button_Box}>
          {table?.id === 0 ? null : (
            <button
              className={styles.Table__Button}
              onClick={() => {
                handleView(table.id, table.Status, table.Category);
              }}
            >
              View
            </button>
          )}
        </div>
      </div>
    </Draggable>
  );
}
