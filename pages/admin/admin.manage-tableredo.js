import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/css/admin-styles/admin.managetables.module.css";
import { app } from "../../src/utility/firebase";
import Draggable from "react-draggable";
import { style } from "@mui/system";
import TableComponent from "../../src/admin-components/table.component";
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
import IdleTimerContainer from "../../src/misc/IdleTimerContainer";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

export default function AdminManageTableredo() {
  useEffect(() => {
    const position = sessionStorage.getItem("Position");
    if (position != "Admin") {
      router.push("/sign-in");
    }
  }, []);

  const router = useRouter();

  const [hasloaded, setHasLoaded] = useState(false);
  const [tableRecord, setTableRecord] = useState([]);
  const nodeRef = useRef(null);
  const containerRef = useRef(null);
  const tableRef = useRef(null);
  const [initPos, setInitPos] = useState([]);

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

  const handleAddTable = () => {
    console.log(tableRecord.length);
    let id = tableRecord.length;
    if (tableRecord.length === 0) {
      //   id=1;
      const data = {
        id: 0,
        Category: "Door",
        Color: "blue",
        x: 0,
        y: 0,
        Status: true,
      };
      AddTables(id, data);
      console.log(tableRecord.length);
      window.location.reload(false);
      return;
    }
    let temp = 0,
      found = false;
    if (tableRecord.length !== 0) {
      tableRecord.map((table) => {
        console.log(table.id + " temp-" + temp);
        if (table.id !== temp && found === false) {
          console.log("found");
          id = temp;
          found = true;
        }
        temp++;
      });
      if (id < temp) {
        const data = {
          id: id,
          Category: "Table",
          Color: "green",
          x: 0,
          y: 0,
          Status: true,
        };
        AddTables(id, data);
        window.location.reload(false);
        return;
      }
    }
    const data = {
      id: id,
      Category: "Table",
      Color: "green",
      x: 0,
      y: 0,
      Status: true,
    };
    AddTables(id, data);
    console.log(tableRecord.length);
  };

  const handleAddHut = () => {
    console.log(tableRecord.length);
    let id = tableRecord.length;
    if (tableRecord.length === 0) {
      //   id=1;
      const data = {
        id: 0,
        Category: "Door",
        Color: "blue",
        x: 0,
        y: 0,
        Status: true,
      };
      AddTables(id, data);
      console.log(tableRecord.length);
      window.location.reload(false);
      return;
    }
    let temp = 0,
      found = false;
    if (tableRecord.length !== 0) {
      tableRecord.map((table) => {
        console.log(table.id + " temp-" + temp);
        if (table.id !== temp && found === false) {
          console.log("found");
          id = temp;
          found = true;
        }
        temp++;
      });
      if (id < temp) {
        const data = {
          id: id,
          Category: "Table",
          Color: "green",
          x: 0,
          y: 0,
          Status: true,
        };
        AddTables(id, data);
        window.location.reload(false);
        return;
      }
    }
    const data = {
      id: id,
      Category: "Hut",
      Color: "green",
      x: 0,
      y: 0,
      Status: true,
    };
    AddTables(id, data);
    console.log(tableRecord.length);
  };

  const resetTables = () => {
    
    clearTables();
    setEditDataVisible();
  };

  const getOffsetLeft = () => {
    return containerRef.current.offsetLeft
      ? containerRef.current.offsetLeft
      : 0;
  };
  const getOffsetTop = () => {
    return containerRef.current.offsetTop ? containerRef.current.offsetTop : 0;
  };

  const [visible, setVisible] = useState(false);

  function setEditDataVisible() {
    setVisible(!visible);
  }

  const [editOn,setEditOn] = useState(false);
  const handleEditOn = () => {
    setEditOn(!editOn);
  }
  return hasloaded ? (
    <IdleTimerContainer>
      <div className={styles.Container}>
        <div className={styles.Table__Container} ref={containerRef}>
          <div className={styles.Table__ButtonBox}>
          <button className={styles.Table__Manage_Btn} onClick={handleEditOn}>
              {editOn? 'VIEW MODE':'EDIT MODE'}
            </button>
            <button
              className={styles.Table__Manage_Btn}
              onClick={handleAddTable}
            >
              
              +TABLE
            </button>
            <button className={styles.Table__Manage_Btn} onClick={handleAddHut}>
              +HUT
            </button>
            <button className={styles.Table__Manage_Btn} onClick={setEditDataVisible}>
              ↻
            </button>
          </div>
          {tableRecord?.map((table) => {
            return (
              <>
                <TableComponent
                  table={table}
                  getOffsetLeft={getOffsetLeft}
                  getOffsetTop={getOffsetTop}
                  editOn={editOn}
                />
              </>
            );
          })}
        </div>
        {visible === true && (
        <OuterBox>
          <InnerBox>
            <Confirmation
              setEditDataVisible={setEditDataVisible}
              resetTables={resetTables}
            />
          </InnerBox>
        </OuterBox>
      )}
      </div>
    </IdleTimerContainer>
  ) : null;
}

const Confirmation = (props) => {
  const {setEditDataVisible,resetTables} = props;
  return(
    <div className={styles.confirm} >
      <h3>Are you sure you want to reset all the table?</h3>
      <div className={styles.btn_choices} > 
      <button onClick={setEditDataVisible} >No</button>
      <button onClick={resetTables} >Yes</button>
       </div>
    </div>
  )
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
AdminManageTableredo.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
