import React, { useEffect, useRef, useState } from "react";
import CashierLayout from "../../src/cashier-components/cashierLayout";
import styles from "../../styles/css/cashier-styles/cashier.managetables.module.css";
import { app } from "../../src/utility/firebase";
import Draggable from "react-draggable";
import { style } from "@mui/system";
import {
  AddTables,
  clearTables,
} from "../../src/utility/admin-utils/manage-table.firebase";
import AdminLayout from "../../src/admin-components/adminLayout";
import {
  getDatabase,
  ref,
  get,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import CashierTableComponent from "../../src/cashier-components/cashier-table.component";
import styled from "@emotion/styled";
import MessageBox from "../../src/misc/messagebox";
import { useRouter } from "next/router";
//
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CashierManageTableredo() {
  const notify = () => toast.warn("There's no order yet or this table", {
    icon: "✔️"
  });

  const router = useRouter();

  const [hasloaded, setHasLoaded] = useState(false);
  const [tableRecord, setTableRecord] = useState([]);
  const nodeRef = useRef(null);
  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const [initPos, setInitPos] = useState([]);
  const [messageVisible, setMessageVisible] = useState(false);
  const [message, setMessage] = useState("");
  const handleMessageVisible = (temp, message) => {
   // setMessage(message);
  //  setMessageVisible(temp);
notify();
  };

  function getTableData() {
    // setRecord(null);

    const db = getDatabase(app);
    const empRef = query(ref(db, "Dine/Tables"), orderByChild("id"));

    get(empRef).then((snapshot) => {
      var employees = [];

      snapshot.forEach((childSnapshot) => {
        employees.push(childSnapshot.val());
      });
      setTableRecord(employees);
    });
  }

  useEffect(() => {
    getTableData();
    setHasLoaded(true);
  }, [tableRecord]);

  return hasloaded ? (
    <div className={styles.Container}>
      <div className={styles.Table__Container} ref={containerRef}>
        <div className={styles.Table__ButtonBox}></div>
        {tableRecord?.map((table) => {
          return (
            <div key={table.id}>
              <CashierTableComponent
                table={table}
                handleMessageVisible={handleMessageVisible}
                coordinates={{
                  x: containerRef.current.offsetLeft,
                  y: containerRef.current.offsetTop,
                }}
              />
            </div>
          );
        })}
      </div>
      <ToastContainer/>
      {messageVisible == true && (
        <OuterBox>
          <InnerBox>
            <MessageBox message={message} setClose={handleMessageVisible} notify={notify} />
          </InnerBox>
        </OuterBox>
      )}
    </div>
  ) : null;
}

CashierManageTableredo.getLayout = function getLayout(page) {
  return <CashierLayout>{page}</CashierLayout>;
};

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
